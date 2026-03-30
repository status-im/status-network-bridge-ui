import {Address} from "viem";

export function isMimeAllowanceResetNeeded(allowedAmount: bigint, requestedAmount: bigint) {
  if (allowedAmount === 0n || allowedAmount >= requestedAmount) {
    return false;
  }

  return true;
}

// Keep it simple for now, validating only if SNT
export function isMimeToken(tokenAddress?: Address | null): boolean {
  const statusTestnetAddress = "0x0B5DAd18B8791ddb24252B433ec4f21f9e6e5Ed0";
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