/**
 * Puzzle Auth Service
 *
 * Exports the PuzzleAuthService class and related types.
 */

import PuzzleAuthService from "./service";

export { PuzzleAuthService };
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
export { solvePuzzle } from "./solver";
export { RETRY_STATUS_CODES } from "./constants";
