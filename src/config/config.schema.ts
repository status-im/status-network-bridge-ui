import Joi from "joi";

const generateNetworkConfigSchema = (disableRPCRequired?: boolean) => {
  return Joi.object({
    name: Joi.string().required(),
    iconPath: Joi.string().required(),
    chainId: Joi.number().required(),
    messageServiceAddress: Joi.string().required(),
    tokenBridgeAddress: Joi.string().required(),
    usdcBridgeAddress: Joi.string().required(),
    defaultRPC: disableRPCRequired ? Joi.string() : Joi.string().required(),
    isAuthenticatedRPC: Joi.boolean()
  })
}

export const configSchema = Joi.object({
  history: Joi.object({
    totalBlocksToParse: Joi.number().required(),
    blocksPerLoop: Joi.number().required(),
  }),
  networks: Joi.object({
    MAINNET: Joi.object({
      L1: generateNetworkConfigSchema(true),
      L2: generateNetworkConfigSchema(true),
      gasEstimated: Joi.required(),
      gasLimitSurplus: Joi.required(),
      profitMargin: Joi.required(),
    }),
    SEPOLIA: Joi.object({
      L1: generateNetworkConfigSchema(),
      L2: generateNetworkConfigSchema(),
      gasEstimated: Joi.required(),
      gasLimitSurplus: Joi.required(),
      profitMargin: Joi.required(),
    }),
    DEVNET: Joi.object({
      L1: generateNetworkConfigSchema(),
      L2: generateNetworkConfigSchema(),
      gasEstimated: Joi.required(),
      gasLimitSurplus: Joi.required(),
      profitMargin: Joi.required(),
    }),
  }),
  walletConnectId: Joi.string().disallow("").required(),
  storage: Joi.object({
    minVersion: Joi.string().required(),
  })
})
