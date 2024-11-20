import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { cookieStorage, createStorage } from "wagmi";
import { http, injected } from "@wagmi/core";
import { mainnet, sepolia, linea, lineaSepolia } from "@wagmi/core/chains";
import { walletConnect, coinbaseWallet } from "@wagmi/connectors";
import { config } from "./config";

if (!config.walletConnectId) throw new Error("Project ID is not defined");

const metadata = {
  name: "Linea Bridge",
  description: `Linea Bridge is a bridge solution, providing secure and efficient cross-chain transactions between Layer 1 and Linea networks.
  Discover the future of blockchain interaction with Linea Bridge.`,
  url: "https://bridge.linea.build",
  icons: [],
};

const chains = [mainnet, sepolia, linea, lineaSepolia] as const;

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
      appName: "Linea Bridge",
    }),
  ],
  transports: {
    [mainnet.id]: http(process.env.NEXT_L1_MAINNET_RPC_URL, { batch: true }),
    [sepolia.id]: http(process.env.NEXT_L1_TESTNET_RPC_URL, { batch: true }),
    [linea.id]: http(process.env.NEXT_L2_MAINNET_RPC_URL, { batch: true }),
    [lineaSepolia.id]: http(process.env.NEXT_L2_TESTNET_RPC_URL, { batch: true }),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
});
