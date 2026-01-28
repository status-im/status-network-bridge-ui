/**
 * PuzzleAuthService
 *
 * Instance-based service for managing puzzle authentication.
 *
 * Tokens are stored in a shared Zustand store keyed by origin,
 * so multiple instances for the same origin share the same token.
 *
 * Use `PuzzleAuthService.forOrigin(origin)` to get a cached instance for an origin.
 */

import type {
  Solution,
  PuzzleAuthConfig,
  PuzzleAuthResult,
  TokenData,
  ProgressCallback,
  StatusCallback,
} from "./types";
import { solvePuzzle } from "./solver";
import { getPuzzleAuthStoreState } from "@/stores/puzzleAuthStore";

const DEFAULTS = {
  maxAttempts: 100000,
  expiryBuffer: 5 * 60 * 1000, // 5 minutes
} as const;

const createError = (
  code: string,
  message: string,
  status?: number,
): PuzzleAuthResult => ({
  success: false as const,
  error: { code, message, status },
});

// Shared state across all instances
const refreshInFlight: Map<string, Promise<string | null>> = new Map();
const instances: Map<string, PuzzleAuthService> = new Map();
let globalConfig: PuzzleAuthConfig = {};

class PuzzleAuthService {
  private readonly origin: string;
  private readonly config: PuzzleAuthConfig;

  constructor(origin: string, config?: PuzzleAuthConfig) {
    this.origin = origin;
    this.config = config ?? globalConfig;
  }

  /**
   * Set global configuration for all new instances
   */
  public static configure(config: PuzzleAuthConfig): void {
    globalConfig = config;
  }

  /**
   * Get or create a cached instance for an origin
   */
  public static forOrigin(origin: string): PuzzleAuthService {
    let instance = instances.get(origin);
    if (!instance) {
      instance = new PuzzleAuthService(origin);
      instances.set(origin, instance);
    }
    return instance;
  }

  /**
   * Get the current valid token (synchronous)
   * Returns null if token is expired or doesn't exist
   */
  public getToken(): string | null {
    const store = getPuzzleAuthStoreState();
    const tokenData = store.getTokenData(this.origin);

    if (!this.isValid(tokenData)) {
      this.invalidateToken();
      return null;
    }

    return tokenData!.token;
  }

  /**
   * Invalidate the token for this origin
   */
  public invalidateToken(): void {
    const store = getPuzzleAuthStoreState();
    store.clearTokenData(this.origin);
  }

  /**
   * Refresh the token (generates a new one)
   */
  public async refreshToken(
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback,
  ): Promise<string | null> {
    // Return existing refresh if in flight for this origin
    const existingRefresh = refreshInFlight.get(this.origin);
    if (existingRefresh) {
      return existingRefresh;
    }

    const refreshPromise = (async () => {
      const result = await this.generateJwtToken(onProgress, onStatus);

      if (result.success && result.token) {
        const tokenData: TokenData = {
          token: result.token,
          expiresAt: (result.puzzle?.expires_at ?? 0) * 1000,
          solveTime: result.solveTime,
          attempts: result.attempts,
        };

        const store = getPuzzleAuthStoreState();
        store.setTokenData(this.origin, tokenData);

        return result.token;
      }

      return null;
    })().finally(() => {
      refreshInFlight.delete(this.origin);
    });

    refreshInFlight.set(this.origin, refreshPromise);
    return refreshPromise;
  }

  /**
   * Ensure a valid token exists (get existing or refresh)
   */
  public async ensureToken(
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback,
  ): Promise<string | null> {
    const existingToken = this.getToken();
    if (existingToken) {
      return existingToken;
    }

    return this.refreshToken(onProgress, onStatus);
  }

  /**
   * Make an authenticated fetch request to this origin
   * Automatically includes the auth token in headers
   */
  public async fetch(
    path: string,
    init?: RequestInit,
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback,
  ): Promise<Response> {
    const token = await this.ensureToken(onProgress, onStatus);

    const url = path.startsWith("/") ? `${this.origin}${path}` : `${this.origin}/${path}`;

    const headers = new Headers(init?.headers);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return fetch(url, {
      ...init,
      headers,
    });
  }

  /**
   * Check if token data is valid (not expired)
   */
  private isValid(tokenData: TokenData | null): boolean {
    if (!tokenData?.token) return false;
    if (!tokenData.expiresAt) return true; // No expiry set, assume valid

    const buffer = this.config.expiryBuffer ?? DEFAULTS.expiryBuffer;
    return Date.now() < tokenData.expiresAt - buffer;
  }

  /**
   * Fetch a puzzle from the server
   */
  private async getPuzzle(): Promise<PuzzleAuthResult> {
    const puzzlePath = `${this.origin}/auth/puzzle`;

    try {
      const response = await fetch(puzzlePath, {
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
   * Submit a solution to the server
   */
  private async submitSolution(solution: Solution): Promise<PuzzleAuthResult> {
    const solvePath = `${this.origin}/auth/solve`;

    try {
      const response = await fetch(solvePath, {
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
   * Generate a JWT token by solving a puzzle
   */
  private async generateJwtToken(
    onProgress?: ProgressCallback,
    onStatus?: StatusCallback,
  ): Promise<PuzzleAuthResult> {
    try {
      onStatus?.("Getting puzzle...");
      const puzzleResult = await this.getPuzzle();

      if (!puzzleResult.success || !puzzleResult.puzzle) {
        return puzzleResult;
      }

      onStatus?.("Solving puzzle...");
      const solveResult = await solvePuzzle(
        puzzleResult.puzzle,
        onProgress,
        this.config.maxSolveAttempts ?? DEFAULTS.maxAttempts,
      );

      if (!solveResult.success || !solveResult.solution) {
        return solveResult;
      }

      onStatus?.("Submitting solution...");
      const submitResult = await this.submitSolution(solveResult.solution);

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
