import { http } from "@wagmi/core";
import { config } from "./config";
import { chains } from "./wagmiChains"
import {availableChainIds, CHAIN_ID_TO_RPC} from "@/utils/constants";
import {Transport} from "viem";
import {WagmiAdapter} from "@reown/appkit-adapter-wagmi";
import {isChainRPCAuthenticated} from "@/utils/chainsUtil";
import {generateRPCBasicAuthToken} from "@/utils/auth";

if (!config.walletConnectId) throw new Error("Project ID is not defined");

const generateTransportHeader = (chainId: number) => {
  if (isChainRPCAuthenticated(chainId)) {
    return {
      "Authorization": `Basic ${generateRPCBasicAuthToken()}`
    }
  }
}

const getTransports = () => {
  const ts: Record<number, Transport> = {};
  availableChainIds.forEach(chainId => {
    ts[chainId] = http(CHAIN_ID_TO_RPC[chainId], {
      batch: true,
      timeout: 100_000,
      fetchOptions: {
        headers: generateTransportHeader(chainId)
      }
    })
  })

  return ts;
}

export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId: config.walletConnectId,
  multiInjectedProviderDiscovery: true,
  ssr: true,
  batch: {
    multicall: true,
  },
  transports: getTransports()
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;