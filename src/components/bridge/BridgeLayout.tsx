"use client";

import { useAccount } from "wagmi";
import Bridge from "../bridge/Bridge";
import { BridgeExternal } from "./BridgeExternal";
import { useTokenStore } from "@/stores/tokenStoreProvider";
import { FormProvider, useForm } from "react-hook-form";
import { BridgeForm } from "@/models";
import { useChainStore } from "@/stores/chainStore";
import { TokenType } from "@/config";
import Image from "next/image";
import Girl from "../../../public/images/girl.gif"

export default function BridgeLayout() {
  const { isConnected } = useAccount();

  const configContextValue = useTokenStore((state) => state.tokensList);
  const token = useChainStore((state) => state.token);

  const methods = useForm<BridgeForm>({
    defaultValues: {
      token: configContextValue?.UNKNOWN[0],
      claim: token?.type === TokenType.ETH ? "auto" : "manual",
      amount: "",
      minFees: 0n,
      gasFees: 0n,
      bridgingAllowed: false,
      balance: "0",
    },
  });

  return (
    <div className="flex flex-col align-items-center">
      <Image src={Girl} alt={"Hero image"} height={200} className="self-end"/>
      {!isConnected && (
        <div className="mb-4 min-w-min max-w-lg rounded-lg bg-cardBg p-2 shadow-lg">
          <BridgeExternal />
        </div>
      )}
      <FormProvider {...methods}>
        <Bridge />
      </FormProvider>
    </div>
  );
}
