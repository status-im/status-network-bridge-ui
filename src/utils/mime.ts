import {TokenInfo} from "@/config";
import {Address} from "viem";

export function isMimeAllowanceResetNeeded(token: TokenInfo) {
  if (!token) {
    return false;
  }

  if (!token.isMime) {
    return false;
  }


}

// Keep it simple for now, relying purely on metadata and address being correct
export function isMimeToken(tokenAddress: Address, tokenSymbol: string): boolean {
  if (tokenSymbol === "STT" && tokenAddress.toLowerCase() === "0x1C3Ac2a186c6149Ae7Cb4D716eBbD0766E4f898a".toLowerCase()) {
    return true;
  } else if (tokenSymbol === "SNT" && tokenAddress.toLowerCase() === "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E".toLowerCase()) {
    return true;
  }

  return false;
}