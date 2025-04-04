import {ChangeEvent, useCallback, useEffect} from "react";
import {useAccount} from "wagmi";
import {useFormContext} from "react-hook-form";
import {formatUnits, parseUnits, zeroAddress} from "viem";
import {PiApproximateEqualsBold} from "react-icons/pi";

import {NetworkType, TokenType} from "@/config";
import useTokenPrices from "@/hooks/useTokenPrices";
import {useChainStore} from "@/stores/chainStore";
import {formatBalance} from "@/utils/format";

const AMOUNT_REGEX = "^[0-9]*[.,]?[0-9]*$";
const MAX_AMOUNT_CHAR = 20;

export function Amount() {
  const token = useChainStore((state) => state.token);
  const fromChain = useChainStore((state) => state.fromChain);
  const tokenAddress = useChainStore((state) => state.token?.[state.networkLayer] || zeroAddress);
  const networkType = useChainStore((state) => state.networkType);

  const {address} = useAccount();

  const {setValue, getValues, setError, clearErrors, trigger, watch} = useFormContext();
  const watchBalance = watch("balance");
  const [amount, gasFees, minFees] = getValues(["amount", "gasFees", "minFees"]);

  const {data: tokenPrices} = useTokenPrices([tokenAddress], fromChain?.id);

  const compareAmountBalance = useCallback(
    (_amount: string) => {
      if (!token) {
        return;
      }
      const amountToCompare =
        token.type === TokenType.ETH
          ? parseUnits(_amount, token.decimals) + gasFees + minFees
          : parseUnits(_amount, token.decimals);

      const balanceToCompare = parseUnits(watchBalance, token.decimals);

      if (amountToCompare > balanceToCompare) {
        setError("amount", {
          type: "custom",
          message: "Not enough funds (Incl fees)",
        });
      } else {
        clearErrors("amount");
      }
    },
    [token, gasFees, minFees, clearErrors, setError, watchBalance],
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const {key} = event;

    // Allow control keys, numeric keys, decimal point (if not already present), +, -, and arrow keys
    const allowedKeys = ["Backspace", "Tab", "ArrowLeft", "ArrowRight", "Delete"];

    if (/[0-9]/.test(key) && !amount.includes(".") && amount[0] === "0") {
      event.preventDefault();
      return;
    }
    if (
      !(
        /[0-9]/.test(key) ||
        allowedKeys.includes(key) ||
        (key === "." && !amount.includes(".")) ||
        (key === "," && !amount.includes(","))
      )
    ) {
      event.preventDefault();
    }
  };

  const checkAmountHandler = (e?: ChangeEvent<HTMLInputElement>, value?: string) => {
    // Replace minus
    const val = value ?? e?.target.value ?? "0";
    const amount = val.replace(/,/g, ".");

    if (!token) {
      return;
    }

    if (new RegExp(AMOUNT_REGEX).test(amount) || amount === "") {
      // Limit max char
      if (amount.length > MAX_AMOUNT_CHAR) {
        setValue("amount", amount.substring(0, MAX_AMOUNT_CHAR));
      } else {
        setValue("amount", amount);
      }
    }
    compareAmountBalance(amount);
  };

  const handleMaxBtn = () => {
    if (!token) {
      return;
    }

    let afterFees: string;
    if (token.type === TokenType.ETH) {
      // Compute the displayed value to match what the user is seeing
      const computedDisplayedValue = formatBalance(watchBalance);
      const beforeFeesInt = parseUnits(computedDisplayedValue, token.decimals)
      const afterFeesInt = beforeFeesInt - gasFees - minFees - 1n;

      if (afterFeesInt < 0) {
        afterFees = "0";
      } else {
        afterFees = formatUnits(afterFeesInt, token.decimals);
      }
    } else {
      afterFees = watchBalance;
    }

    const roundedNumber = formatBalance(afterFees);
    checkAmountHandler(undefined, roundedNumber)
  }

  useEffect(() => {
    if (amount) {
      trigger(["amount"]);
      compareAmountBalance(amount);
    }
  }, [amount, trigger, compareAmountBalance]);

  // Detect when changing account
  useEffect(() => {
    setValue("amount", "");
    clearErrors("amount");
  }, [address, setValue, clearErrors]);

  return (
    <>
      <div className="flex align-middle">
        <input
          id="amount-input"
          type="text"
          autoCorrect="off"
          autoComplete="off"
          spellCheck="false"
          inputMode="decimal"
          value={amount}
          onKeyDown={handleKeyDown}
          onChange={checkAmountHandler}
          pattern={AMOUNT_REGEX}
          placeholder="Enter amount"
          className="input input-md w-full border-0 bg-inherit p-0 text-right text-lg font-medium placeholder:text-right placeholder:text-inherit focus:border-0 focus:outline-none md:text-3xl"
        />
        { !amount &&
          <span className="btn p-1 justify-center ml-3" onClick={handleMaxBtn}>
            MAX
          </span>
        }
      </div>
      {networkType === NetworkType.MAINNET && (
        <span className="label-text flex items-center justify-end">
          {amount &&
          tokenPrices?.[tokenAddress.toLowerCase()]?.usd &&
          tokenPrices?.[tokenAddress.toLowerCase()]?.usd > 0 ? (
            <>
              <PiApproximateEqualsBold/>
              {(Number(amount) * tokenPrices?.[tokenAddress.toLowerCase()]?.usd).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 4,
              })}
            </>
          ) : (
            ""
          )}
        </span>
      )}
    </>
  );
}
