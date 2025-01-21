import { lineaSepolia, sepolia } from "@wagmi/core/chains";
import { defineChain } from "viem";
import {ESupportedNetworks, SUPPORTED_NETWORK_TO_CHAIN_ID} from "@/utils/constants";

const devL1 = defineChain({
  id: 31648428,
  name: "Dev L1",
  nativeCurrency: {
    name: "Sepolia Ether",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_L1_DEVNET_RPC_URL]
    }
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'http://localhost:1234',
      apiUrl: 'http://localhost:1234/api'
    }
  },
  contracts: {
  },
  testnet: true,
})

const devL2 = defineChain({
  ...lineaSepolia,
  id: 1337,
  name: "Dev L2",
  nativeCurrency: {
    name: 'Status Sepolia Ether',
    symbol: 'ETH',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_L2_DEVNET_RPC_URL]
    }
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'http://localhost:1234',
      apiUrl: 'http://localhost:1234/api'
    }
  },
  contracts: {
  },
  testnet: true,
})

const statusSepolia = defineChain({
  id: SUPPORTED_NETWORK_TO_CHAIN_ID[ESupportedNetworks.STATUS_SEPOLIA],
  name: "Status Network Sepolia",
  nativeCurrency: {
    name: "Status Sepolia Ether",
    symbol: "ETH",
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_L2_TESTNET_RPC_URL]
    }
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://status-sepolia-blockscout.eu-north-2.gateway.fm/',
      apiUrl: 'https://status-sepolia-blockscout.eu-north-2.gateway.fm/api'
    }
  },
  contracts: {
  },
  testnet: true,
})

const devnetChains = [devL1, devL2] as const;
const productionChains = [sepolia, statusSepolia] as const;

export const chains = process.env.NEXT_PUBLIC_USE_DEVNET === "true" ? devnetChains : productionChains;