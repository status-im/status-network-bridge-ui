declare global {
  namespace NodeJS {
    interface ProcessEnv {
      E2E_TEST_SEED_PHRASE: string;
      E2E_TEST_PRIVATE_KEY: string;
      E2E_TEST_WALLET_PASSWORD: string;
      NEXT_L1_TESTNET_RPC_URL: string;
      NEXT_L1_MAINNET_RPC_URL: string;
      NEXT_L2_TESTNET_RPC_URL: string;
      NEXT_L2_MAINNET_RPC_URL: string;
    }
  }
}

export {};
