import "dotenv/config";
import { formatEther, formatUnits } from "viem";

export const METAMASK_SEED_PHRASE = process.env.E2E_TEST_SEED_PHRASE;
export const METAMASK_PASSWORD = process.env.E2E_TEST_WALLET_PASSWORD;
export const TEST_PRIVATE_KEY = process.env.E2E_TEST_PRIVATE_KEY;
export const L2_RPC_URL = process.env.NEXT_PUBLIC_L2_TESTNET_RPC_URL

// @TODO Update tests when network live
export const LINEA_SEPOLIA_NETWORK = {
  name: "Linea Sepolia",
  rpcUrl: L2_RPC_URL as string,
  chainId: 59141,
  symbol: "LineaETH",
  blockExplorerUrl: "https://sepolia.lineascan.build",
};

export const TEST_URL = "http://localhost:3000/";
export const SEPOLIA_NETWORK_NAME = "Sepolia";
export const WEI_AMOUNT = formatEther(BigInt(1)).toString();
export const USDC_AMOUNT = formatUnits(BigInt(1), 6).toString();
