import { switchChain } from "@wagmi/core";
import Image from "next/image";
import { linea, lineaSepolia, mainnet, sepolia } from "viem/chains";
import { wagmiConfig } from "@/config";
import { Button } from "../ui";
import {availableChainIds, availableNetworks, CHAIN_ID_TO_ICON_PATH, CHAIN_ID_TO_NAME} from "@/utils/constants";

const supportedChains = availableChainIds.map(chainId => ({
  title: CHAIN_ID_TO_NAME[chainId],
  iconPath: CHAIN_ID_TO_ICON_PATH[chainId],
  chainId
}))

export default function WrongNetwork() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cover bg-no-repeat p-8">
      <div className="flex min-w-fit flex-col items-center gap-8 rounded-lg border-2 border-card bg-cardBg p-8">
        <span className="text-center">
          This app doesn&apos;t support your current network. Switch to an available option to continue.
        </span>
        <div className="flex flex-col gap-4">
          {supportedChains.map(({ title, iconPath, chainId }) => (
            <div key={`dropdown-item-${title}`}>
              <Button
                className={"w-full justify-start"}
                size="sm"
                variant="outline"
                onClick={() => switchChain(wagmiConfig, { chainId })}
              >
                <Image src={iconPath} alt={title} width={18} height={18} style={{ width: "18px", height: "auto" }} />
                {title}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
