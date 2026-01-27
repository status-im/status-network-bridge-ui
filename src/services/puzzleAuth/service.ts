/**
 * PuzzleAuthService
 *
 * Class-based service for managing puzzle authentication.
 * Uses static methods and properties for singleton behavior.
 */

import type {
  Puzzle,
  Solution,
  PuzzleAuthConfig,
  PuzzleAuthResult,
  TokenData,
  ProgressCallback,
  StatusCallback,
} from "./types";
import { solvePuzzle } from "./solver";
import { getPuzzleAuthStoreState } from "@/stores/puzzleAuthStore";

// ============================================================================
// Constants
// ============================================================================

const DEFAULTS = {
  maxAttempts: 100000,
  expiryBuffer: 5 * 60 * 1000, // 5 minutes
} as const;

const RETRY_CODES = [401, 403, 429] as const;

// ============================================================================
// Helper functions
// ============================================================================

const createError = (
  code: string,
  message: string,
  status?: number,
): PuzzleAuthResult => ({
  success: false as const,
  error: { code, message, status },
});

// ============================================================================
// PuzzleAuthService Class
// ============================================================================

class PuzzleAuthService {
  // Private static properties
  private static config: PuzzleAuthConfig | null = null;
  private static refreshInFlight: Map<string, Promise<string | null>> = new Map();

  // ============================================================================
  // Public Static Methods
  // ============================================================================

  /**
   * Initialize the puzzle auth service with optional configuration
   */
  public static initialize(cfg?: PuzzleAuthConfig): void {
    this.config = cfg ?? {};
  }

  /**
   * Check if the service has been initialized
   */
  public static isInitialized(): boolean {
    return this.config !== null;
  }

  /**
   * Get the current valid token for an origin (synchronous)
   * Returns null if token is expired or doesn't exist
   */
  public static getToken(origin: string): string | null {
    const store = getPuzzleAuthStoreState();
    const tokenData = store.getTokenData(origin);

    if (!this.isValid(tokenData)) {
      this.invalidateToken(origin);
      return null;
    }

    return tokenData!.token;
  }

  /**
   * Invalidate the token for an origin
   */
  public static invalidateToken(origin: string): void {
    const store = getPuzzleAuthStoreState();
    store.clearTokenData(origin);
  }

  /**
   * Wait for any in-flight authentication to complete for an origin
   */
  public static waitForAuthentication(origin: string): Promise<string | null> {
    return this.refreshInFlight.get(origin) ?? Promise.resolve(this.getToken(origin));
  }

  /**
   * Refresh the token for an origin (generates a new one)
   */
  public static async refreshToken(
    origin: string,
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback,
  ): Promise<string | null> {
    // Return existing refresh if in flight
    const existingRefresh = this.refreshInFlight.get(origin);
    if (existingRefresh) {
      return existingRefresh;
    }

    if (!this.config) {
      console.error("PuzzleAuthService: Not initialized");
      return null;
    }

    const refreshPromise = (async () => {
      const result = await this.generateJwtToken(origin, onProgress, onStatus);

      if (result.success && result.token) {
        const tokenData: TokenData = {
          token: result.token,
          expiresAt: (result.puzzle?.expires_at ?? 0) * 1000,
          solveTime: result.solveTime,
          attempts: result.attempts,
        };

        const store = getPuzzleAuthStoreState();
        store.setTokenData(origin, tokenData);

        return result.token;
      }

      return null;
    })().finally(() => {
      this.refreshInFlight.delete(origin);
    });

    this.refreshInFlight.set(origin, refreshPromise);
    return refreshPromise;
  }

  /**
   * Ensure a valid token exists for an origin (get existing or refresh)
   */
  public static async ensureToken(
    origin: string,
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback,
  ): Promise<string | null> {
    const existingToken = this.getToken(origin);
    if (existingToken) {
      return existingToken;
    }

    return this.refreshToken(origin, onProgress, onStatus);
  }

  /**
   * Create an authenticated fetch wrapper
   */
  public static createAuthenticatedFetch(
    opts: {
      maxRetries?: number;
      shouldAddAuth?: (url: string) => boolean;
      retryCodes?: readonly number[];
    } = {},
  ): typeof fetch {
    const {
      maxRetries = 1,
      shouldAddAuth = () => true,
      retryCodes = RETRY_CODES,
    } = opts;

    return async (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url;

      if (!shouldAddAuth(url)) {
        return fetch(input, init);
      }

      const origin = new URL(url).origin;

      const makeRequest = async (token: string | null) => {
        const headers = new Headers(init?.headers);
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        return fetch(input, { ...init, headers });
      };

      let token =
        (await this.waitForAuthentication(origin)) ?? (await this.refreshToken(origin));
      let response = await makeRequest(token);

      for (
        let i = 0;
        i < maxRetries && retryCodes.includes(response.status as (typeof retryCodes)[number]);
        i++
      ) {
        this.invalidateToken(origin);
        token = await this.refreshToken(origin);
        if (!token) break;
        response = await makeRequest(token);
      }

      return response;
    };
  }

  // ============================================================================
  // Private Static Methods
  // ============================================================================

  /**
   * Check if token data is valid (not expired)
   */
  private static isValid(tokenData: TokenData | null): boolean {
    if (!tokenData?.token) return false;
    if (!tokenData.expiresAt) return true; // No expiry set, assume valid

    const buffer = this.config?.expiryBuffer ?? DEFAULTS.expiryBuffer;
    return Date.now() < tokenData.expiresAt - buffer;
  }

  /**
   * Fetch a puzzle from the server for a given origin
   */
  private static async getPuzzle(origin: string): Promise<PuzzleAuthResult> {
    const fetchFn = this.config?.fetch ?? fetch;
    const puzzlePath = `${origin}/auth/puzzle`;

    try {
      const response = await fetchFn(puzzlePath, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        return createError(
          "PUZZLE_FETCH_ERROR",
          `Failed to get puzzle: ${response.statusText}`,
          response.status,
        );
      }

      return { success: true, puzzle: await response.json() };
    } catch (error) {
      return createError(
        "NETWORK_ERROR",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Submit a solution to the server for a given origin
   */
  private static async submitSolution(
    origin: string,
    solution: Solution,
  ): Promise<PuzzleAuthResult> {
    const fetchFn = this.config?.fetch ?? fetch;
    const solvePath = `${origin}/auth/solve`;

    try {
      const response = await fetchFn(solvePath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(solution),
      });

      if (!response.ok) {
        return createError(
          "SOLUTION_SUBMIT_ERROR",
          `Failed to submit: ${response.statusText}`,
          response.status,
        );
      }

      const data = await response.json();
      return { success: true, token: data.token };
    } catch (error) {
      return createError(
        "NETWORK_ERROR",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }

  /**
   * Generate a JWT token by solving a puzzle for a given origin
   */
  private static async generateJwtToken(
    origin: string,
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback,
  ): Promise<PuzzleAuthResult> {
    try {
      onStatus?.("Getting puzzle...");
      const puzzleResult = await this.getPuzzle(origin);

      if (!puzzleResult.success || !puzzleResult.puzzle) {
        return puzzleResult;
      }

      onStatus?.("Solving puzzle...");
      const solveResult = await solvePuzzle(
        puzzleResult.puzzle,
        onProgress,
        this.config?.maxSolveAttempts ?? DEFAULTS.maxAttempts,
      );

      if (!solveResult.success || !solveResult.solution) {
        return solveResult;
      }

      onStatus?.("Submitting solution...");
      const submitResult = await this.submitSolution(origin, solveResult.solution);

      if (!submitResult.success) {
        return submitResult;
      }

      return {
        success: true,
        token: submitResult.token,
        puzzle: puzzleResult.puzzle,
        solution: solveResult.solution,
        solveTime: solveResult.solveTime,
        attempts: solveResult.attempts,
      };
    } catch (error) {
      return createError(
        "GENERATE_TOKEN_ERROR",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
  }
}

export default PuzzleAuthService;
