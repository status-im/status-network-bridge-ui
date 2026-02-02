import { http } from "@wagmi/core";
import { config, AuthType } from "./config";
import { chains } from "./wagmiChains";
import { availableChainIds, CHAIN_ID_TO_RPC } from "@/utils/constants";
import { Transport } from "viem";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { getChainAuthType } from "@/utils/chainsUtil";
import { generateRPCBasicAuthToken } from "@/utils/auth";
import { PuzzleAuthService, RETRY_STATUS_CODES } from "@/services/puzzleAuth";

if (!config.walletConnectId) throw new Error("Project ID is not defined");

const basicHeaders = (): Record<string, string> => ({
  Authorization: `Basic ${generateRPCBasicAuthToken()}`
});

const puzzleHooks = (rpcUrl: string) => {
  const origin = new URL(rpcUrl).origin;
  const service = PuzzleAuthService.forOrigin(origin);

  return {
    onFetchRequest: async (_req: Request, init: RequestInit): Promise<RequestInit> => {
      const token = service.getToken() ?? (await service.ensureToken());
      if (!token) return init;

      const headers = new Headers(init.headers);
      headers.set("Authorization", `Bearer ${token}`);
      return { ...init, headers };
    },
    onFetchResponse: async (res: Response) => {
      if (RETRY_STATUS_CODES.has(res.status)) {
        service.invalidateToken();
      }
    },
  };
};

const createTransports = (): Record<number, Transport> => {
  return Object.fromEntries(
    availableChainIds.map((chainId) => {
      const rpcUrl = CHAIN_ID_TO_RPC[chainId];
      const authType = getChainAuthType(chainId);
      
      return [
        chainId,
        http(rpcUrl, {
          batch: true,
          timeout: 100_000,
          ...(authType === AuthType.POW ? puzzleHooks(rpcUrl) : {}),
          fetchOptions: {
            headers: authType === AuthType.BASIC ? basicHeaders() : {},
          },
        }),
      ];
    }),
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
