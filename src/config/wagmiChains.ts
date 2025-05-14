import { sepolia, statusSepolia } from "@wagmi/core/chains";
import { defineChain } from "viem";
import { AppKitNetwork } from "@reown/appkit/networks";
import {ESupportedNetworks, SUPPORTED_NETWORK_TO_CHAIN_ID} from "@/utils/constants";

const devL1 = defineChain({
    id: SUPPORTED_NETWORK_TO_CHAIN_ID[ESupportedNetworks.DEV_L1],
  name: "Dev L1",
  nativeCurrency: {
    name: "Devnet Ether",
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
  ...statusSepolia,
  id: SUPPORTED_NETWORK_TO_CHAIN_ID[ESupportedNetworks.DEV_L2],
  name: "Dev L2",
  nativeCurrency: {
    name: 'Devnet L2 Ether',
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

const devnetChains = [devL1, devL2];
const productionChains = [sepolia, statusSepolia];

// @ts-ignore
export const chains: [AppKitNetwork, ...AppKitNetwork[]] = process.env.NEXT_PUBLIC_USE_DEVNET === "true" ? devnetChains : productionChains;
