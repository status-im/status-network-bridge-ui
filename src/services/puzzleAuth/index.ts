/**
 * Puzzle Auth Service
 *
 * Exports the PuzzleAuthService class and related types.
 */

import PuzzleAuthService from "./service";
import { isPuzzleAuthEnabled } from "@/utils/auth";

// Initialize the service when module is imported
if (isPuzzleAuthEnabled()) {
  PuzzleAuthService.initialize();
}

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
export { solvePuzzle, checkDifficulty, hexToUint8Array } from "./solver";
