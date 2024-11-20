import { useMemo } from "react";
import { LineaSDK, Network } from "@consensys/linea-sdk";
import { L1MessageServiceContract, L2MessageServiceContract } from "@consensys/linea-sdk/dist/lib/contracts";
import { NetworkType } from "@/config";
import { useChainStore } from "@/stores/chainStore";

interface LineaSDKContracts {
  L1: L1MessageServiceContract;
  L2: L2MessageServiceContract;
}

const useLineaSDK = () => {
  const networkType = useChainStore((state) => state.networkType);

  const { lineaSDK, lineaSDKContracts } = useMemo(() => {
    const rpcUrlAvailable =
      (process.env.NEXT_L1_MAINNET_RPC_URL && process.env.NEXT_L2_MAINNET_RPC_URL) &&
      (process.env.NEXT_L1_TESTNET_RPC_URL && process.env.NEXT_L2_TESTNET_RPC_URL)

    if (rpcUrlAvailable) return { lineaSDK: null, lineaSDKContracts: null };

    let l1RpcUrl;
    let l2RpcUrl;
    switch (networkType) {
      case NetworkType.MAINNET:
        l1RpcUrl = process.env.NEXT_L1_MAINNET_RPC_URL;
        l2RpcUrl = process.env.NEXT_L2_MAINNET_RPC_URL;
        break;
      case NetworkType.SEPOLIA:
        l1RpcUrl = process.env.NEXT_L1_TESTNET_RPC_URL;
        l2RpcUrl = process.env.NEXT_L2_TESTNET_RPC_URL;
        break;
      default:
        return { lineaSDK: null, lineaSDKContracts: null };
    }

    const sdk = new LineaSDK({
      l1RpcUrl,
      l2RpcUrl,
      network: `linea-${networkType.toLowerCase()}` as Network,
      mode: "read-only",
    });

    const newLineaSDKContracts: LineaSDKContracts = {
      L1: sdk.getL1Contract(),
      L2: sdk.getL2Contract(),
    };

    return { lineaSDK: sdk, lineaSDKContracts: newLineaSDKContracts };
  }, [networkType]);

  return { lineaSDK, lineaSDKContracts };
};

export default useLineaSDK;
