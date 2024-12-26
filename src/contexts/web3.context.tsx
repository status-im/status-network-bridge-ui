"use client";

import { ReactNode } from "react";
import { State, WagmiProvider } from "wagmi";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config, wagmiConfig } from "@/config";

const queryClient = new QueryClient();

if (!config.walletConnectId) throw new Error("Project ID is not defined");

const METAMASK_WALLET_ID = "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96"
const STATUS_WALLET_ID = "af9a6dfff9e63977bbde28fb23518834f08b696fe8bff6dd6827acad1814c6be"

createWeb3Modal({
  wagmiConfig,
  projectId: config.walletConnectId,
  featuredWalletIds: [METAMASK_WALLET_ID, STATUS_WALLET_ID],
});

type Web3ProviderProps = {
  children: ReactNode;
  initialState?: State;
};

export function Web3Provider({ children, initialState }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
