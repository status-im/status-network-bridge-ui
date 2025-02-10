import { http } from "@wagmi/core";
import { config } from "./config";
import { chains } from "./wagmiChains"
import {availableChainIds, CHAIN_ID_TO_DEFAULT_RPC} from "@/utils/constants";
import {Transport} from "viem";
import {WagmiAdapter} from "@reown/appkit-adapter-wagmi";

if (!config.walletConnectId) throw new Error("Project ID is not defined");

const getTransports = () => {
  const ts: Record<number, Transport> = {};
  availableChainIds.forEach(chainId => {
    ts[chainId] = http(CHAIN_ID_TO_DEFAULT_RPC[chainId], { batch: true })
  })

  return ts;
}
const transports = getTransports()

export const wagmiAdapter = new WagmiAdapter({
  networks: chains,
  projectId: config.walletConnectId,
  multiInjectedProviderDiscovery: true,
  ssr: true,
  batch: {
    multicall: true,
  },
  transports
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;