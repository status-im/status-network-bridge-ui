import { Address } from "viem";
import { configSchema } from "./config.schema";

export enum NetworkType {
  UNKNOWN = "UNKNOWN",
  MAINNET = "MAINNET",
  SEPOLIA = "SEPOLIA",
  DEVNET = "DEVNET",
  WRONG_NETWORK = "WRONG_NETWORK",
}

export enum NetworkLayer {
  UNKNOWN = "UNKNOWN",
  L1 = "L1",
  L2 = "L2",
}

export interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  type: TokenType;
  L1: Address | null;
  L2: Address | null;
  UNKNOWN: Address | null;
  image: string;
  isDefault: boolean;
}

export enum TokenType {
  ETH,
  USDC,
  ERC20,
}

interface LayerConfig {
  name: string;
  iconPath: string;
  chainId: number;
  messageServiceAddress: Address;
  tokenBridgeAddress: Address;
  usdcBridgeAddress: Address;
  defaultRPC: string;
  isAuthenticatedRPC: boolean;
}

interface NetworkConfig {
  L1: LayerConfig;
  L2: LayerConfig;
  gasEstimated: bigint;
  gasLimitSurplus: bigint;
  profitMargin: bigint;
}

interface Networks {
  MAINNET: NetworkConfig;
  SEPOLIA: NetworkConfig;
  [key: string]: NetworkConfig; // For potential additional networks
}

export interface History {
  totalBlocksToParse: number;
  blocksPerLoop: number;
}

export interface Storage {
  minVersion: string;
}

export type NetworkTokens = {
  MAINNET: TokenInfo[];
  SEPOLIA: TokenInfo[];
  DEVNET: TokenInfo[];
  UNKNOWN: TokenInfo[];
};

export interface Config {
  history: History;
  networks: Networks;
  walletConnectId?: string;
  storage: Storage;
}

export const config: Config = {
  history: {
    // Total blocks to process
    totalBlocksToParse: 8000,
    // Blocks processed per loop
    blocksPerLoop: 700,
  },
  networks: {
    MAINNET: {
      L1: {
        name: "Ethereum",
        iconPath: "/images/logo/ethereum-rounded.svg",
        chainId: 1,
        messageServiceAddress: process.env.NEXT_PUBLIC_MAINNET_L1_MESSAGE_SERVICE
          ? (process.env.NEXT_PUBLIC_MAINNET_L1_MESSAGE_SERVICE as Address)
          : ({} as Address),
        tokenBridgeAddress: process.env.NEXT_PUBLIC_MAINNET_L1_TOKEN_BRIDGE
          ? (process.env.NEXT_PUBLIC_MAINNET_L1_TOKEN_BRIDGE as Address)
          : ({} as Address),
        usdcBridgeAddress: process.env.NEXT_PUBLIC_MAINNET_L1_USDC_BRIDGE
          ? (process.env.NEXT_PUBLIC_MAINNET_L1_USDC_BRIDGE as Address)
          : ({} as Address),
        defaultRPC: process.env.NEXT_PUBLIC_L1_MAINNET_RPC_URL,
        isAuthenticatedRPC: process.env.NEXT_PUBLIC_L1_MAINNET_RPC_IS_AUTHENTICATED === "true"
      },
      L2: {
        name: "Status",
        chainId: 59144, // @TODO Update chain ID
        iconPath: "/images/logo/sn-mainnet.svg",
        messageServiceAddress: process.env.NEXT_PUBLIC_MAINNET_LINEA_MESSAGE_SERVICE
          ? (process.env.NEXT_PUBLIC_MAINNET_LINEA_MESSAGE_SERVICE as Address)
          : ({} as Address),
        tokenBridgeAddress: process.env.NEXT_PUBLIC_MAINNET_LINEA_TOKEN_BRIDGE
          ? (process.env.NEXT_PUBLIC_MAINNET_LINEA_TOKEN_BRIDGE as Address)
          : ({} as Address),
        usdcBridgeAddress: process.env.NEXT_PUBLIC_MAINNET_LINEA_USDC_BRIDGE
          ? (process.env.NEXT_PUBLIC_MAINNET_LINEA_USDC_BRIDGE as Address)
          : ({} as Address),
        defaultRPC: process.env.NEXT_PUBLIC_L2_MAINNET_RPC_URL,
        isAuthenticatedRPC: process.env.NEXT_PUBLIC_L2_MAINNET_RPC_IS_AUTHENTICATED === "true"
      },
      gasEstimated: process.env.NEXT_PUBLIC_MAINNET_GAS_ESTIMATED
        ? BigInt(process.env.NEXT_PUBLIC_MAINNET_GAS_ESTIMATED)
        : BigInt(100000),
      gasLimitSurplus: process.env.NEXT_PUBLIC_MAINNET_DEFAULT_GAS_LIMIT_SURPLUS
        ? BigInt(process.env.NEXT_PUBLIC_MAINNET_DEFAULT_GAS_LIMIT_SURPLUS)
        : BigInt(6000),
      profitMargin: process.env.NEXT_PUBLIC_MAINNET_PROFIT_MARGIN
        ? BigInt(process.env.NEXT_PUBLIC_MAINNET_PROFIT_MARGIN)
        : BigInt(1),
    },
    SEPOLIA: {
      L1: {
        name: "Sepolia",
        iconPath: "/images/logo/ethereum-rounded.svg",
        chainId: 11155111,
        messageServiceAddress: process.env.NEXT_PUBLIC_SEPOLIA_L1_MESSAGE_SERVICE
          ? (process.env.NEXT_PUBLIC_SEPOLIA_L1_MESSAGE_SERVICE as Address)
          : ({} as Address),
        tokenBridgeAddress: process.env.NEXT_PUBLIC_SEPOLIA_L1_TOKEN_BRIDGE
          ? (process.env.NEXT_PUBLIC_SEPOLIA_L1_TOKEN_BRIDGE as Address)
          : ({} as Address),
        usdcBridgeAddress: process.env.NEXT_PUBLIC_SEPOLIA_L1_USDC_BRIDGE
          ? (process.env.NEXT_PUBLIC_SEPOLIA_L1_USDC_BRIDGE as Address)
          : ({} as Address),
        defaultRPC: process.env.NEXT_PUBLIC_L1_TESTNET_RPC_URL,
        isAuthenticatedRPC: process.env.NEXT_PUBLIC_L1_TESTNET_RPC_IS_AUTHENTICATED === "true"
      },
      L2: {
        name: "Status Sepolia",
        iconPath: "/images/logo/sn-sepolia.svg",
        chainId: 1660990954,
        messageServiceAddress: process.env.NEXT_PUBLIC_SEPOLIA_LINEA_MESSAGE_SERVICE
          ? (process.env.NEXT_PUBLIC_SEPOLIA_LINEA_MESSAGE_SERVICE as Address)
          : ({} as Address),
        tokenBridgeAddress: process.env.NEXT_PUBLIC_SEPOLIA_LINEA_TOKEN_BRIDGE
          ? (process.env.NEXT_PUBLIC_SEPOLIA_LINEA_TOKEN_BRIDGE as Address)
          : ({} as Address),
        usdcBridgeAddress: process.env.NEXT_PUBLIC_SEPOLIA_LINEA_USDC_BRIDGE
          ? (process.env.NEXT_PUBLIC_SEPOLIA_LINEA_USDC_BRIDGE as Address)
          : ({} as Address),
        defaultRPC: process.env.NEXT_PUBLIC_L2_TESTNET_RPC_URL,
        isAuthenticatedRPC: process.env.NEXT_PUBLIC_L2_TESTNET_RPC_IS_AUTHENTICATED === "true"
      },
      gasEstimated: process.env.NEXT_PUBLIC_SEPOLIA_GAS_ESTIMATED
        ? BigInt(process.env.NEXT_PUBLIC_SEPOLIA_GAS_ESTIMATED)
        : BigInt(100000),
      gasLimitSurplus: process.env.NEXT_PUBLIC_SEPOLIA_DEFAULT_GAS_LIMIT_SURPLUS
        ? BigInt(process.env.NEXT_PUBLIC_SEPOLIA_DEFAULT_GAS_LIMIT_SURPLUS)
        : BigInt(6000),
      profitMargin: process.env.NEXT_PUBLIC_SEPOLIA_PROFIT_MARGIN
        ? BigInt(process.env.NEXT_PUBLIC_SEPOLIA_PROFIT_MARGIN)
        : BigInt(1),
    },
    DEVNET: {
      L1: {
        name: "Sepolia Dev",
        iconPath: "/images/logo/ethereum-rounded.svg",
        chainId: 31648428,
        messageServiceAddress: process.env.NEXT_PUBLIC_SEPOLIA_L1_MESSAGE_SERVICE
          ? (process.env.NEXT_PUBLIC_DEVNET_L1_MESSAGE_SERVICE as Address)
          : ({} as Address),
        tokenBridgeAddress: process.env.NEXT_PUBLIC_DEVNET_L1_TOKEN_BRIDGE
          ? (process.env.NEXT_PUBLIC_DEVNET_L1_TOKEN_BRIDGE as Address)
          : ({} as Address),
        usdcBridgeAddress: process.env.NEXT_PUBLIC_DEVNET_L1_USDC_BRIDGE
          ? (process.env.NEXT_PUBLIC_DEVNET_L1_USDC_BRIDGE as Address)
          : ({} as Address),
        defaultRPC: process.env.NEXT_PUBLIC_L1_DEVNET_RPC_URL,
        isAuthenticatedRPC: process.env.NEXT_PUBLIC_L1_DEVNET_RPC_IS_AUTHENTICATED === "true",
      },
      L2: {
        name: "Status Dev",
        iconPath: "/images/logo/sn-sepolia.svg",
        chainId: 1337,
        messageServiceAddress: process.env.NEXT_PUBLIC_DEVNET_LINEA_MESSAGE_SERVICE
          ? (process.env.NEXT_PUBLIC_DEVNET_LINEA_MESSAGE_SERVICE as Address)
          : ({} as Address),
        tokenBridgeAddress: process.env.NEXT_PUBLIC_DEVNET_LINEA_TOKEN_BRIDGE
          ? (process.env.NEXT_PUBLIC_DEVNET_LINEA_TOKEN_BRIDGE as Address)
          : ({} as Address),
        usdcBridgeAddress: process.env.NEXT_PUBLIC_DEVNET_LINEA_USDC_BRIDGE
          ? (process.env.NEXT_PUBLIC_DEVNET_LINEA_USDC_BRIDGE as Address)
          : ({} as Address),
        defaultRPC: process.env.NEXT_PUBLIC_L2_DEVNET_RPC_URL,
        isAuthenticatedRPC: process.env.NEXT_PUBLIC_L2_DEVNET_RPC_IS_AUTHENTICATED === "true",
      },
      gasEstimated: process.env.NEXT_PUBLIC_DEVNET_GAS_ESTIMATED
        ? BigInt(process.env.NEXT_PUBLIC_DEVNET_GAS_ESTIMATED)
        : BigInt(100000),
      gasLimitSurplus: process.env.NEXT_PUBLIC_DEVNET_DEFAULT_GAS_LIMIT_SURPLUS
        ? BigInt(process.env.NEXT_PUBLIC_DEVNET_DEFAULT_GAS_LIMIT_SURPLUS)
        : BigInt(6000),
      profitMargin: process.env.NEXT_PUBLIC_DEVNET_PROFIT_MARGIN
        ? BigInt(process.env.NEXT_PUBLIC_DEVNET_PROFIT_MARGIN)
        : BigInt(1),
    }
  },
  walletConnectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID,
  storage: {
    // The storage will be cleared if its version is smaller than the one configured
    minVersion: process.env.NEXT_PUBLIC_STORAGE_MIN_VERSION || "1",
  },
};

export async function getConfiguration(): Promise<Config> {
  return config;
}

// Config Manager

export class ConfigManager {
  static async getMessageServiceAddress(networkType: NetworkType, layer: NetworkLayer): Promise<Address> {
    if (layer !== NetworkLayer.L1 && layer !== NetworkLayer.L2) {
      throw new Error(`Invalid network layer: ${layer}`);
    }

    const config = await getConfiguration();
    const messageServiceAddress = config.networks[networkType][layer]?.messageServiceAddress;
    if (!messageServiceAddress) {
      throw new Error(`Message service address for layer ${layer} not found`);
    }

    return messageServiceAddress;
  }

  static async getTokenBridgeAddress(networkType: NetworkType, layer: NetworkLayer): Promise<Address> {
    if (layer !== NetworkLayer.L1 && layer !== NetworkLayer.L2) {
      throw new Error(`Invalid network layer: ${layer}`);
    }

    const config = await getConfiguration();
    const tokenBridgeAddress = config.networks[networkType][layer]?.tokenBridgeAddress;
    if (!tokenBridgeAddress) {
      throw new Error(`Token bridge address for layer ${layer} not found`);
    }

    return tokenBridgeAddress;
  }

  static async getUSDCBridgeAddress(networkType: NetworkType, layer: NetworkLayer): Promise<Address> {
    if (layer !== NetworkLayer.L1 && layer !== NetworkLayer.L2) {
      throw new Error(`Invalid network layer: ${layer}`);
    }

    const config = await getConfiguration();
    const usdcBridgeAddress = config.networks[networkType][layer]?.usdcBridgeAddress;
    if (!usdcBridgeAddress) {
      throw new Error(`USDC Bridge address for layer ${layer} not found`);
    }

    return usdcBridgeAddress;
  }
}

// Schema validation
getConfiguration().then((config) => {
  const validationResult = configSchema.validate(config);

  if (validationResult.error) {
    throw new Error(`Invalid config: ${validationResult.error.message}`);
  }
});
