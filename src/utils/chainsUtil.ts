import {config, NetworkLayer, NetworkType, AuthType} from "@/config";
import {Chain} from "viem/chains";
import {CHAIN_ID_TO_ICON_PATH, CHAIN_ID_TO_SUPPORTED_NETWORK, ESupportedNetworks} from "@/utils/constants";

export const getChainNetworkLayer = (chain: Chain) => {
  return getChainNetworkLayerByChainId(chain.id)
};

export const getChainNetworkLayerByChainId = (chainId: number) => {
  const supportedChain = CHAIN_ID_TO_SUPPORTED_NETWORK[chainId];

  switch (supportedChain) {
    case ESupportedNetworks.DEV_L2:
    case ESupportedNetworks.STATUS_HOODI:
    case ESupportedNetworks.STATUS_MAINNET:
      return NetworkLayer.L2;
    case ESupportedNetworks.DEV_L1:
    case ESupportedNetworks.ETH_MAINNET:
    case ESupportedNetworks.ETH_HOODI:
      return NetworkLayer.L1;
    default:
      return undefined;
  }
};

export const getChainNetworkType = (chain: Chain) => {
  return getChainNetworkTypeByChainId(chain.id)
};

export const getChainNetworkTypeByChainId = (chainId: number) => {
  const supportedChain = CHAIN_ID_TO_SUPPORTED_NETWORK[chainId];

  switch (supportedChain) {
    case ESupportedNetworks.DEV_L1:
    case ESupportedNetworks.DEV_L2:
      return NetworkType.DEVNET;
    case ESupportedNetworks.ETH_HOODI:
    case ESupportedNetworks.STATUS_HOODI:
      return NetworkType.HOODI;
    case ESupportedNetworks.STATUS_MAINNET:
    case ESupportedNetworks.ETH_MAINNET:
      return NetworkType.MAINNET;
    default:
      return undefined;
  }
}

export const getChainAuthType = (chainId: number): AuthType => {
  const networkType = getChainNetworkTypeByChainId(chainId)
  const networkLayer = getChainNetworkLayerByChainId(chainId)

  if (!networkType || !networkLayer) {
    return AuthType.NONE;
  }

  return config.networks[networkType][networkLayer].authType;
}

export const getChainLogoPath = (chainId: number) => {
  const path = CHAIN_ID_TO_ICON_PATH[chainId]
  
  return path ? path : "";
};
