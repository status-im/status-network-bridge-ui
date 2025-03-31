import {Address} from "viem";

export function isMimeAllowanceResetNeeded(allowedAmount: bigint, requestedAmount: bigint) {
  if (allowedAmount === 0n || allowedAmount === requestedAmount) {
    return false;
  }

  return true;
}

// Keep it simple for now, validating only if SNT
export function isMimeToken(tokenAddress?: Address | null): boolean {
  const statusTestnetAddress = "0xE452027cdEF746c7Cd3DB31CB700428b16cD8E51";
  const statusMainnetAddress = "0x744d70FDBE2Ba4CF95131626614a1763DF805B9E"

  if (tokenAddress) {
    const isSTT = tokenAddress.toLowerCase() === statusTestnetAddress.toLowerCase();
    const isSNT = tokenAddress.toLowerCase() === statusMainnetAddress.toLowerCase();

    if (isSTT || isSNT) {
      return true;
    }
  }

  return false;
}