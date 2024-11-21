import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { http, injected } from "@wagmi/core";
import {coinbaseWallet, walletConnect} from "@wagmi/connectors";
import { config } from "./config";
import { chains } from "./wagmiChains"
import {availableChainIds, CHAIN_ID_TO_DEFAULT_RPC} from "@/utils/constants";
import {Transport} from "viem";

if (!config.walletConnectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Status Network Bridge",
  description: `Status Network Bridge is a bridge solution, providing secure and efficient cross-chain transactions between Layer 1 and Status networks.
  Discover the future of blockchain interaction with Status Network Bridge.`,
  url: "https://bridge.status.network",
  icons: [],
};

const getTransports = () => {
  const ts: Record<number, Transport> = {};
  availableChainIds.forEach(chainId => {
    ts[chainId] = http(CHAIN_ID_TO_DEFAULT_RPC[chainId], { batch: true })
  })

  return ts;
}
const transports = getTransports()

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: config.walletConnectId,
  metadata,
  multiInjectedProviderDiscovery: true,
  ssr: true,
  enableEIP6963: true,
  batch: {
    multicall: true,
  },
  connectors: [
    walletConnect({
      projectId: config.walletConnectId,
      showQrModal: false,
    }),
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: "Status Network Bridge",
    }),
  ],
  transports
});
