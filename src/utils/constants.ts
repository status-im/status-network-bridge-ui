import BridgeIcon from "@/assets/icons/bridge.svg";
import TransactionsIcon from "@/assets/icons/transaction.svg";
import DocsIcon from "@/assets/icons/docs.svg";
import FaqIcon from "@/assets/icons/faq.svg";

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
    href: "https://docs.status.network/general-info/bridge/bridge-to-status",
    external: true,
    Icon: DocsIcon,
  },
];

export const NETWORK_ID_TO_NAME: Record<number, string> = {
  59144: "Status",
  59141: "Status Sepolia",
  1: "Ethereum",
  11155111: "Sepolia",
};
