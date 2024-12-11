declare global {
  namespace NodeJS {
    interface ProcessEnv {
      E2E_TEST_SEED_PHRASE: string;
      E2E_TEST_PRIVATE_KEY: string;
      E2E_TEST_WALLET_PASSWORD: string;
      NEXT_PUBLIC_USE_DEVNET: string;
      NEXT_PUBLIC_L1_MAINNET_RPC_URL: string;
      NEXT_PUBLIC_L2_MAINNET_RPC_URL: string;
      NEXT_PUBLIC_L1_TESTNET_RPC_URL: string;
      NEXT_PUBLIC_L2_TESTNET_RPC_URL: string;
      NEXT_PUBLIC_L1_DEVNET_RPC_URL: string;
      NEXT_PUBLIC_L2_DEVNET_RPC_URL: string;
    }
  }
}

export {};
