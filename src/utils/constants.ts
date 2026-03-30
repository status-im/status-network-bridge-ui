import BridgeIcon from "@/assets/icons/bridge.svg";
import TransactionsIcon from "@/assets/icons/transaction.svg";
import DocsIcon from "@/assets/icons/docs.svg";
import FaqIcon from "@/assets/icons/faq.svg";
import {keys} from "@/utils/utils";

export const MENU_ITEMS = [
  {
    title: "Bridge",
    href: "/",
    external: false,
    Icon: BridgeIcon,
  },
  {
    title: "Transactions",
    href: "/transactions",
    external: false,
    Icon: TransactionsIcon,
  },
  {
    title: "Docs",
    href: "https://docs.status.network/general-info/bridge/bridging-testnet",
    external: true,
    Icon: DocsIcon,
  },
  {
    title: "FAQ",
    href: "/faq",
    external: false,
    Icon: FaqIcon,
  }
];

export enum ESupportedNetworks {
  ETH_HOODI = "ETH_HOODI",
  ETH_MAINNET = "ETH_MAINNET",
  STATUS_HOODI = "STATUS_HOODI",
  STATUS_MAINNET = "STATUS_MAINNET",
  DEV_L1 = "DEV_L1",
  DEV_L2 = "DEV_L2",
}

export const SUPPORTED_NETWORK_TO_CHAIN_ID: Record<ESupportedNetworks, number> = {
  [ESupportedNetworks.ETH_HOODI]: 560048,
  [ESupportedNetworks.ETH_MAINNET]: 1,
  [ESupportedNetworks.STATUS_HOODI]: 374,
  [ESupportedNetworks.STATUS_MAINNET]: 373,
  [ESupportedNetworks.DEV_L1]: Number(process.env.NEXT_PUBLIC_L1_DEVNET_CHAIN_ID),
  [ESupportedNetworks.DEV_L2]: Number(process.env.NEXT_PUBLIC_L2_DEVNET_CHAIN_ID)
}

export const CHAIN_ID_TO_RPC: Record<number, string> = {
  [SUPPORTED_NETWORK_TO_CHAIN_ID.ETH_HOODI]: process.env.NEXT_PUBLIC_L1_TESTNET_RPC_URL,
  [SUPPORTED_NETWORK_TO_CHAIN_ID.ETH_MAINNET]: "", //@TODO
  [SUPPORTED_NETWORK_TO_CHAIN_ID.STATUS_HOODI]: process.env.NEXT_PUBLIC_L2_TESTNET_RPC_URL,
  [SUPPORTED_NETWORK_TO_CHAIN_ID.STATUS_MAINNET]: "", //@TODO
  [SUPPORTED_NETWORK_TO_CHAIN_ID.DEV_L1]: process.env.NEXT_PUBLIC_L1_DEVNET_RPC_URL,
  [SUPPORTED_NETWORK_TO_CHAIN_ID.DEV_L2]: process.env.NEXT_PUBLIC_L2_DEVNET_RPC_URL
}

export const CHAIN_ID_TO_NAME: Record<number, string> = {
  [SUPPORTED_NETWORK_TO_CHAIN_ID.ETH_HOODI]: "Hoodi",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.ETH_MAINNET]: "Ethereum",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.STATUS_HOODI]: "Status Hoodi",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.STATUS_MAINNET]: "Status",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.DEV_L1]: "Dev L1",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.DEV_L2]: "Dev L2"
};

export const CHAIN_ID_TO_ICON_PATH: Record<number, string> = {
  [SUPPORTED_NETWORK_TO_CHAIN_ID.ETH_HOODI]: "/images/logo/ethereum-rounded.svg",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.ETH_MAINNET]: "/images/logo/ethereum-rounded.svg",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.STATUS_HOODI]: "/images/logo/sn-testnet.svg",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.STATUS_MAINNET]: "/images/logo/sn-mainnet.svg",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.DEV_L1]: "/images/logo/ethereum-rounded.svg",
  [SUPPORTED_NETWORK_TO_CHAIN_ID.DEV_L2]: "/images/logo/sn-testnet.svg"
}

export function getAvailableNetworks() {
  if (process.env.NEXT_PUBLIC_USE_DEVNET === "true") {
    return [
      ESupportedNetworks.DEV_L1,
      ESupportedNetworks.DEV_L2
    ]
  } else {
    return [
      ESupportedNetworks.ETH_HOODI,
      ESupportedNetworks.STATUS_HOODI,
      // @TODO Re-enable for Mainnet Release
      // ESupportedNetworks.ETH_MAINNET,
      // ESupportedNetworks.STATUS_MAINNET
    ]
  }
}

export function getSupportedChainIds(): Record<number, ESupportedNetworks>  {
  let CHAIN_ID_TO_SUPPORTED_NETWORK: Record<number, ESupportedNetworks> = {};

  keys(SUPPORTED_NETWORK_TO_CHAIN_ID).forEach(network => {
    const chainId = SUPPORTED_NETWORK_TO_CHAIN_ID[network];
    CHAIN_ID_TO_SUPPORTED_NETWORK[chainId] = network;
  })

  return CHAIN_ID_TO_SUPPORTED_NETWORK;
}

export const CHAIN_ID_TO_SUPPORTED_NETWORK = getSupportedChainIds();
export const availableNetworks = getAvailableNetworks();
export const availableChainIds: number[] = availableNetworks.map(availableNetwork => SUPPORTED_NETWORK_TO_CHAIN_ID[availableNetwork])