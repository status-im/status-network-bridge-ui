import { useChainStore } from "@/stores/chainStore";
import { useFormContext } from "react-hook-form";
import { Stepper } from "../ui";
import { parseUnits } from "viem";
import {isMimeAllowanceResetNeeded, isMimeToken} from "@/utils/mime";

const STEPS = ["Approve", "Bridge"];
const MIME_TOKEN_STEPS = ["Allowance Reset", "Approve", "Bridge"];

export function ERC20Stepper() {
  const token = useChainStore((state) => state.token);
  const layer = useChainStore((state) => state.networkLayer);

  const { watch } = useFormContext();

  const watchAmount = watch("amount");
  const watchAllowance = watch("allowance");

  const isETHTransfer = token && token.symbol === "ETH";

  const isApproved =
    !isETHTransfer &&
    watchAmount &&
    watchAmount > 0 &&
    watchAllowance &&
    token?.decimals &&
    watchAllowance >= parseUnits(watchAmount, token?.decimals);

  if (token && isMimeToken(token[layer])) {
    const isResetStep = isMimeAllowanceResetNeeded(watchAllowance, parseUnits(watchAmount, token.decimals))

    return (
      <Stepper
        steps={MIME_TOKEN_STEPS}
        activeStep={isResetStep ? 0 : isApproved ? 2 : 1}
      />
    );
  } else {
    return <Stepper steps={STEPS} activeStep={isApproved ? 1 : 0} />;
  }
}
