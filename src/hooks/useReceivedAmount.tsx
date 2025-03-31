import { useMemo, useEffect, useState } from "react";
import { formatEther, parseEther, parseUnits } from "viem";
import { TokenType } from "@/config";
import { useGasEstimation, useApprove, useMinimumFee, useExecutionFee } from "@/hooks";
import { useChainStore } from "@/stores/chainStore";
import { isMimeToken} from "@/utils/mime";

type UseReceivedAmountProps = {
  amount: string;
  claim?: string;
  enoughAllowance: boolean;
};

export function useReceivedAmount({ amount, enoughAllowance, claim }: UseReceivedAmountProps) {
  const [estimatedGasFee, setEstimatedGasFee] = useState<bigint>(0n);

  const { token, tokenBridgeAddress, networkLayer, networkType } = useChainStore((state) => ({
    token: state.token,
    tokenBridgeAddress: state.tokenBridgeAddress,
    networkLayer: state.networkLayer,
    networkType: state.networkType,
  }));

  const { minimumFee } = useMinimumFee();
  const { estimateGasBridge } = useGasEstimation();
  const { estimateApprove } = useApprove();

  const executionFee = useExecutionFee({
    token,
    claim,
    networkLayer,
    networkType,
    minimumFee,
  });

  useEffect(() => {
    const estimate = async () => {
      if (!amount || minimumFee === null || !token?.decimals) {
        setEstimatedGasFee(0n);
        return;
      }

      let calculatedGasFee = 0n;
      if (enoughAllowance) {
        calculatedGasFee = (await estimateGasBridge(amount, minimumFee)) || 0n;
      } else {
        let amountBigInt = parseUnits(amount, token.decimals);
        if (isMimeToken(token[networkLayer])) {
          // There's a chance that different amount will throw error,
          // for estimation purposes it doesn't matter too much for number to be exact.
          // Gas will differ slightly, but inconsiderably
          amountBigInt = 0n;
        }
        calculatedGasFee = (await estimateApprove(amountBigInt, tokenBridgeAddress)) || 0n;
      }

      setEstimatedGasFee(calculatedGasFee);
    };

    estimate();
  }, [amount, minimumFee, enoughAllowance, tokenBridgeAddress, estimateGasBridge, estimateApprove, token?.decimals]);

  const totalReceived = useMemo(() => {
    if (!amount || !token?.decimals) {
      return "0";
    }

    if (token.type !== TokenType.ETH) {
      return amount;
    }

    const amountInWei = parseEther(amount);
    const gasFee = estimatedGasFee || BigInt(0);

    return formatEther(amountInWei - executionFee - gasFee);
  }, [amount, token?.decimals, token?.type, executionFee, estimatedGasFee]);

  return {
    totalReceived,
    fees: {
      total: executionFee + estimatedGasFee,
      bridgingFeeInWei: executionFee,
      transactionFeeInWei: estimatedGasFee,
    },
  };
}
