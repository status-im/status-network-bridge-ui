"use client";

import { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config, wagmiConfig } from "@/config";
import { createAppKit } from "@reown/appkit/react";
import { chains, wagmiAdapter } from "@/config/wagmi";

const queryClient = new QueryClient();

if (!config.walletConnectId) throw new Error("Project ID is not defined");

const METAMASK_WALLET_ID = "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96"
const STATUS_WALLET_ID = "af9a6dfff9e63977bbde28fb23518834f08b696fe8bff6dd6827acad1814c6be"

const metadata = {
    name: "Status Network Bridge",
    description: `The Status Network Bridge is a bridge solution, providing secure and efficient cross-chain transactions between Ethereum Layer 1 and Status networks.
  Discover the future of blockchain interaction with Status Network Bridge.`,
    url: "https://bridge.status.network",
    icons: [],
};

createAppKit({
    adapters: [wagmiAdapter],
    networks: chains,
    projectId: config.walletConnectId,
    metadata,
    features: {
        analytics: true,
        email: false,
        socials: false,
        swaps: false,
        onramp: false,
        history: false,
    },
    enableEIP6963: true,
    coinbasePreference: "eoaOnly",
    featuredWalletIds: [METAMASK_WALLET_ID, STATUS_WALLET_ID],
});

type Web3ProviderProps = {
  children: ReactNode;
};

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
