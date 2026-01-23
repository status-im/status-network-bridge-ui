/**
 * Puzzle Auth Module (Compact)
 */

import type {
  Puzzle,
  Solution,
  PuzzleAuthConfig,
  PuzzleAuthResult,
  TokenData,
  ProgressCallback,
  StatusCallback,
} from './types';
import { solvePuzzle } from './solver';

export type { Puzzle, Solution, PuzzleAuthConfig, PuzzleAuthResult, TokenData, ProgressCallback, StatusCallback } from './types';
export { solvePuzzle, checkDifficulty, hexToUint8Array } from './solver';

// ============================================================================
// Defaults & constants
// ============================================================================

const DEFAULTS = {
  puzzlePath: '/api/auth/puzzle',
  solvePath: '/api/auth/solve',
  maxAttempts: 100000,
  expiryBuffer: 5 * 60 * 1000,
  storageKey: 'puzzle-auth-token',
} as const;

const RETRY_CODES = [401, 403, 429] as const;

// ============================================================================
// Helpers
// ============================================================================

const err = (code: string, message: string, status?: number) => ({
  success: false as const,
  error: { code, message, status },
});

const storage = () => (typeof window !== 'undefined' ? localStorage : null);

const readJson = <T>(key: string): T | null => {
  try {
    const raw = storage()?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeJson = (key: string, data: unknown) => {
  try { storage()?.setItem(key, JSON.stringify(data)); } catch {}
};

const removeKey = (key: string) => {
  try { storage()?.removeItem(key); } catch {}
};

// ============================================================================
// Module state
// ============================================================================

let token: TokenData | null = null;
let config: PuzzleAuthConfig | null = null;
let refreshInFlight: Promise<string | null> | null = null;

// ============================================================================
// HTTP Client
// ============================================================================

export const getPuzzle = async (cfg: PuzzleAuthConfig): Promise<PuzzleAuthResult> => {
  const f = cfg.fetch ?? fetch;
  const puzzlePath = cfg.puzzlePath ?? DEFAULTS.puzzlePath;
  try {
    const res = await f(puzzlePath, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
    if (!res.ok) return err('PUZZLE_FETCH_ERROR', `Failed to get puzzle: ${res.statusText}`, res.status);
    return { success: true, puzzle: await res.json() };
  } catch (e) {
    return err('NETWORK_ERROR', e instanceof Error ? e.message : 'Unknown error');
  }
};

export const submitSolution = async (cfg: PuzzleAuthConfig, solution: Solution): Promise<PuzzleAuthResult> => {
  const f = cfg.fetch ?? fetch;
  const solvePath = cfg.solvePath ?? DEFAULTS.solvePath;
  try {
    const res = await f(solvePath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(solution),
    });
    if (!res.ok) return err('SOLUTION_SUBMIT_ERROR', `Failed to submit: ${res.statusText}`, res.status);
    const data = await res.json();
    return { success: true, token: data.token };
  } catch (e) {
    return err('NETWORK_ERROR', e instanceof Error ? e.message : 'Unknown error');
  }
};

export const generateJwtToken = async (
  cfg: PuzzleAuthConfig,
  onProgress?: ProgressCallback,
  onStatus?: StatusCallback
): Promise<PuzzleAuthResult> => {
  try {
    onStatus?.('Getting puzzle...');
    const p = await getPuzzle(cfg);
    if (!p.success || !p.puzzle) return p;

    onStatus?.('Solving puzzle...');
    const s = await solvePuzzle(p.puzzle, onProgress, cfg.maxSolveAttempts ?? DEFAULTS.maxAttempts);
    if (!s.success || !s.solution) return s;

    onStatus?.('Submitting solution...');
    const r = await submitSolution(cfg, s.solution);
    if (!r.success) return r;

    return { success: true, token: r.token, puzzle: p.puzzle, solution: s.solution, solveTime: s.solveTime, attempts: s.attempts };
  } catch (e) {
    return err('GENERATE_TOKEN_ERROR', e instanceof Error ? e.message : 'Unknown error');
  }
};

// ============================================================================
// Token management
// ============================================================================

const isValid = (t: TokenData | null) =>
  t?.token && (!t.expiresAt || Date.now() < t.expiresAt - (config?.expiryBuffer ?? DEFAULTS.expiryBuffer));

export const initPuzzleAuth = (cfg?: PuzzleAuthConfig) => {
  config = cfg ?? {};
  const key = config.storageKey ?? DEFAULTS.storageKey;
  const stored = readJson<TokenData>(key);
  if (isValid(stored)) token = stored;
};

export const getToken = (): string | null => {
  if (!isValid(token)) {
    invalidateToken();
    return null;
  }
  return token!.token;
};

export const invalidateToken = () => {
  token = null;
  removeKey(config?.storageKey ?? DEFAULTS.storageKey);
};

export const waitForAuthentication = () => refreshInFlight ?? Promise.resolve(getToken());

export const refreshToken = async (
  onProgress?: ProgressCallback,
  onStatus?: StatusCallback
): Promise<string | null> => {
  if (refreshInFlight) return refreshInFlight;
  if (!config) {
    console.error('Puzzle auth not initialized');
    return null;
  }

  refreshInFlight = (async () => {
    const result = await generateJwtToken(config!, onProgress, onStatus);
    if (result.success && result.token) {
      const data: TokenData = {
        token: result.token,
        expiresAt: (result.puzzle?.expires_at ?? 0) * 1000,
        solveTime: result.solveTime,
        attempts: result.attempts,
      };
      token = data;
      writeJson(config!.storageKey ?? DEFAULTS.storageKey, data);
      return result.token;
    }
    return null;
  })().finally(() => { refreshInFlight = null; });

  return refreshInFlight;
};

export const ensureToken = async (onProgress?: ProgressCallback, onStatus?: StatusCallback) =>
  getToken() ?? refreshToken(onProgress, onStatus);

// ============================================================================
// Fetch decorator
// ============================================================================

export interface FetchOptions {
  maxRetries?: number;
  shouldAddAuth?: (url: string) => boolean;
  retryCodes?: readonly number[];
}

export const createAuthenticatedFetch = (opts: FetchOptions = {}): typeof fetch => {
  const { maxRetries = 1, shouldAddAuth = () => true, retryCodes = RETRY_CODES } = opts;

  return async (input, init) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
    if (!shouldAddAuth(url)) return fetch(input, init);

    const req = async (t: string | null) => {
      const h = new Headers(init?.headers);
      if (t) h.set('Authorization', `Bearer ${t}`);
      return fetch(input, { ...init, headers: h });
    };

    let t = await waitForAuthentication() ?? await refreshToken();
    let res = await req(t);

    for (let i = 0; i < maxRetries && retryCodes.includes(res.status as any); i++) {
      invalidateToken();
      t = await refreshToken();
      if (!t) break;
      res = await req(t);
    }
    return res;
  };
};
