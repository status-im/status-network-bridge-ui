/**
 * Puzzle Auth Service
 *
 * Exports the PuzzleAuthService class and related types.
 */

export { default as PuzzleAuthService } from "./service";
export type {
  Puzzle,
  Solution,
  PuzzleAuthConfig,
  PuzzleAuthResult,
  TokenData,
  ProgressCallback,
  StatusCallback,
  PuzzleAuthError,
  Argon2Params,
} from "./types";
export { solvePuzzle, checkDifficulty, hexToUint8Array } from "./solver";
