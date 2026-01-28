import { useMemo } from "react";
import { LineaSDK } from "@consensys/linea-sdk";
import { L1MessageServiceContract, L2MessageServiceContract } from "@consensys/linea-sdk/dist/lib/contracts";
import { config, NetworkType } from "@/config";
import { useChainStore } from "@/stores/chainStore";
import { FetchRequest, FetchResponse, JsonRpcProvider } from "ethers";
import { generateRPCBasicAuthToken, isPuzzleAuthEnabled } from "@/utils/auth";
import { isChainRPCAuthenticated } from "@/utils/chainsUtil";
import { PuzzleAuthService } from "@/services/puzzleAuth";

interface LineaSDKContracts {
  L1: L1MessageServiceContract;
  L2: L2MessageServiceContract;
}

const RETRY_STATUS_CODES = new Set([401, 403, 429]);

const createPuzzleAuthProvider = (rpcUrl: string): JsonRpcProvider => {
  const origin = new URL(rpcUrl).origin;
  const service = PuzzleAuthService.forOrigin(origin);
  const fetchRequest = new FetchRequest(rpcUrl);

  fetchRequest.preflightFunc = async (req: FetchRequest) => {
    const token = service.getToken() ?? (await service.ensureToken());
    if (token) {
      req.setHeader("Authorization", `Bearer ${token}`);
    }
    return req;
  };

  fetchRequest.processFunc = async (_req: FetchRequest, resp: FetchResponse) => {
    if (RETRY_STATUS_CODES.has(resp.statusCode)) {
      service.invalidateToken();
    }
    return resp;
  };

  return new JsonRpcProvider(fetchRequest);
};

const createBasicAuthProvider = (rpcUrl: string): JsonRpcProvider => {
  const fetchRequest = new FetchRequest(rpcUrl);
  fetchRequest.setHeader("Authorization", `Basic ${generateRPCBasicAuthToken()}`);
  return new JsonRpcProvider(fetchRequest);
};

const useLineaSDK = () => {
  const networkType = useChainStore((state) => state.networkType);

  const { lineaSDK, lineaSDKContracts } = useMemo(() => {
    const rpcUrlAvailable =
      (process.env.NEXT_PUBLIC_L1_MAINNET_RPC_URL && process.env.NEXT_PUBLIC_L2_MAINNET_RPC_URL) ||
      (process.env.NEXT_PUBLIC_L1_TESTNET_RPC_URL && process.env.NEXT_PUBLIC_L2_TESTNET_RPC_URL)

    if (!rpcUrlAvailable) return { lineaSDK: null, lineaSDKContracts: null };

    let l1Rpc, l2Rpc: JsonRpcProvider | undefined;
    let l1RpcUrl, l2RpcUrl: string;

    const isUsableNetworkType = networkType !== NetworkType.WRONG_NETWORK && networkType !== NetworkType.UNKNOWN;
    if (networkType && isUsableNetworkType) {
      l1RpcUrl = config.networks[networkType].L1.defaultRPC;
      l2RpcUrl = config.networks[networkType].L2.defaultRPC;

      const isL1Authenticated = isChainRPCAuthenticated(config.networks[networkType].L1.chainId);
      const isL2Authenticated = isChainRPCAuthenticated(config.networks[networkType].L2.chainId);
      const usePuzzleAuth = isPuzzleAuthEnabled();

      if (isL1Authenticated || isL2Authenticated) {
        const createProvider = usePuzzleAuth ? createPuzzleAuthProvider : createBasicAuthProvider;

        if (isL1Authenticated) {
          l1Rpc = createProvider(l1RpcUrl);
        }
        if (isL2Authenticated) {
          l2Rpc = createProvider(l2RpcUrl);
        }
      }
    } else {
      return { lineaSDK: null, lineaSDKContracts: null };
    }

    const sdk = new LineaSDK({
      l1RpcUrl,
      l2RpcUrl,
      l1Rpc,
      l2Rpc,
      network: 'localhost',
      mode: "read-only",
    });

    const l1MessageServiceAddress = config.networks[networkType].L1.messageServiceAddress;
    const l2MessageServiceAddress = config.networks[networkType].L2.messageServiceAddress;

    const newLineaSDKContracts: LineaSDKContracts = {
      L1: sdk.getL1Contract(l1MessageServiceAddress, l2MessageServiceAddress),
      L2: sdk.getL2Contract(l2MessageServiceAddress),
    };

    return { lineaSDK: sdk, lineaSDKContracts: newLineaSDKContracts };
  }, [networkType]);

  return { lineaSDK, lineaSDKContracts };
};

export default useLineaSDK;
