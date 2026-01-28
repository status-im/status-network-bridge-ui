import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { config } from "@/config";

const STORAGE_KEY = "bridge-puzzle-auth";

export interface TokenData {
  token: string;
  expiresAt: number;
  solveTime?: number;
  attempts?: number;
}

export type PuzzleAuthState = {
  tokens: Record<string, TokenData>; // key = origin
  rehydrated: boolean;
};

export type PuzzleAuthActions = {
  setTokenData: (origin: string, data: TokenData) => void;
  clearTokenData: (origin: string) => void;
  getTokenData: (origin: string) => TokenData | null;
};

export type PuzzleAuthStore = PuzzleAuthState & PuzzleAuthActions;

export const defaultInitState: PuzzleAuthState = {
  tokens: {},
  rehydrated: false,
};

export const usePuzzleAuthStore = create<PuzzleAuthStore>()(
  persist(
    (set, get) => ({
      ...defaultInitState,
      setTokenData: (origin, data) =>
        set((state) => ({
          tokens: { ...state.tokens, [origin]: data },
        })),
      clearTokenData: (origin) =>
        set((state) => {
          const { [origin]: _, ...rest } = state.tokens;
          return { tokens: rest };
        }),
      getTokenData: (origin) => get().tokens[origin] ?? null,
    }),
    {
      name: STORAGE_KEY,
      version: parseInt(config.storage.minVersion),
      storage: createJSONStorage(() => localStorage),
      migrate: () => {
        return defaultInitState;
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.rehydrated = true;
        }
      },
    },
  ),
);

// Non-reactive access for use in services (outside React components)
export const getPuzzleAuthStoreState = () => usePuzzleAuthStore.getState();
