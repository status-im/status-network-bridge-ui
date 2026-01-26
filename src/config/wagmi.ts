import { http } from "@wagmi/core";
import { config } from "./config";
import { chains } from "./wagmiChains";
import { availableChainIds, CHAIN_ID_TO_RPC } from "@/utils/constants";
import { Transport } from "viem";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { isChainRPCAuthenticated } from "@/utils/chainsUtil";
import { generateRPCBasicAuthToken, isPuzzleAuthEnabled } from "@/utils/auth";
import { PuzzleAuthService } from "@/services/puzzleAuth";

if (!config.walletConnectId) throw new Error("Project ID is not defined");

// Initialize puzzle auth if enabled
if (isPuzzleAuthEnabled()) {
  PuzzleAuthService.initialize();
}

const basicHeadersForChain = (chainId: number): Record<string, string> =>
  isChainRPCAuthenticated(chainId)
    ? { Authorization: `Basic ${generateRPCBasicAuthToken()}` }
    : {};

const puzzleHooks = () => {
  const RETRY_STATUS_CODES = new Set([401, 403, 429]);

  return {
    onFetchRequest: async (_req: Request, init: RequestInit): Promise<RequestInit> => {
      const token = PuzzleAuthService.getToken() ?? (await PuzzleAuthService.ensureToken());
      if (!token) return init;

      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);
      return { ...init, headers };
    },
    onFetchResponse: async (res: Response) => {
      if (RETRY_STATUS_CODES.has(res.status)) {
        PuzzleAuthService.invalidateToken();
      }
    },
  };
};

const createTransports = (): Record<number, Transport> => {
  const puzzle = isPuzzleAuthEnabled();
  const hooks = puzzle ? puzzleHooks() : undefined;

  return Object.fromEntries(
    availableChainIds.map((chainId) => [
      chainId,
      http(CHAIN_ID_TO_RPC[chainId], {
        batch: true,
        timeout: 100_000,
        ...hooks,
        fetchOptions: {
          headers: puzzle ? {} : basicHeadersForChain(chainId),
        },
      }),
    ]),
  ) as Record<number, Transport>;
};

export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId: config.walletConnectId,
  multiInjectedProviderDiscovery: true,
  ssr: true,
  batch: {
    multicall: true,
  },
  transports: createTransports()
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
