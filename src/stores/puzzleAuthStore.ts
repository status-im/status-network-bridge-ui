import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { config } from "@/config";

const PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || "bridge";
const STORAGE_KEY = `${PROJECT_ID}-puzzle-auth`;

export interface TokenData {
  token: string;
  expiresAt: number;
  solveTime?: number;
  attempts?: number;
}

export type PuzzleAuthState = {
  tokenData: TokenData | null;
  rehydrated: boolean;
};

export type PuzzleAuthActions = {
  setTokenData: (data: TokenData) => void;
  clearTokenData: () => void;
  getTokenData: () => TokenData | null;
};

export type PuzzleAuthStore = PuzzleAuthState & PuzzleAuthActions;

export const defaultInitState: PuzzleAuthState = {
  tokenData: null,
  rehydrated: false,
};

export const usePuzzleAuthStore = create<PuzzleAuthStore>()(
  persist(
    (set, get) => ({
      ...defaultInitState,
      setTokenData: (data) => set({ tokenData: data }),
      clearTokenData: () => set({ tokenData: null }),
      getTokenData: () => get().tokenData,
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
