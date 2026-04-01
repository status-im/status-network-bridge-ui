import {SimulateContractReturnType} from "viem";
import {estimateGas} from "viem/linea";
import {NetworkLayer, wagmiConfig} from "@/config";
import {getChainNetworkLayer} from "@/utils/chainsUtil";
import log from "loglevel";

class PremiumGasService {
  public static async prepareSimulationRequest<T extends SimulateContractReturnType>(simulation: T): Promise<T> {
    try {
      const client = wagmiConfig.getClient();
      const chainLayer = getChainNetworkLayer(client.chain);

      if (chainLayer !== NetworkLayer.L2) {
        return simulation;
      }

      const {
        baseFeePerGas,
        priorityFeePerGas
      } = await estimateGas(client, { ...(simulation.request) as any })

      return {
        ...simulation,
        request: {
          ...simulation.request,
          baseFeePerGas,
          maxFeePerGas: priorityFeePerGas,
          maxPriorityFeePerGas: priorityFeePerGas
        }
      }
    } catch (error) {
      log.error("Failed filling tx using linea_estimateGas", error);
      return simulation;
    }
  }
}

export default PremiumGasService;