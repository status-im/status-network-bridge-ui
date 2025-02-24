import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useConfigStore } from "@/stores/configStore";
import { cn } from "@/utils/cn";
import { Button } from "../ui";

export default function TermsModal() {
  const termsModalRef = useRef<HTMLDivElement>(null);

  const { agreeToTerms, rehydrated, setAgreeToTerms } = useConfigStore((state) => ({
    agreeToTerms: state.agreeToTerms,
    rehydrated: state.rehydrated,
    setAgreeToTerms: state.setAgreeToTerms,
  }));

  const [open, setOpen] = useState(false);

  const handleAgreeToTerms = () => {
    setAgreeToTerms(true);
    setOpen(false);
  };

  useEffect(() => {
    if (rehydrated && window && !agreeToTerms) {
      setTimeout(() => {
        setOpen(true);
      }, 1000);
    }
  }, [agreeToTerms, rehydrated]);

  if (!rehydrated) {
    return null;
  }

  return (
    <div
      ref={termsModalRef}
      id="terms_modal"
      className={cn(
        "p-4 fixed right-2 left-2 md:left-auto md:right-5 md:max-w-[20rem] bg-white rounded text-black z-50 transition-all duration-500",
        !open ? "invisible -bottom-full" : "visible bottom-2 md:bottom-16",
      )}
    >
      <h2 className="text-xl font-normal">Terms of Use</h2>
      <div className="mb-2 text-xs font-normal leading-relaxed">
        I understand and agree to comply with the Status Network Testnet Terms and Conditions in connection with my participation in the Status Network Testnet Programme.
        <br/>
        <Link href="https://docs.status.network/terms-of-use" target="_blank" className="ml-1 font-extrabold">
          (Terms of Service | Status Network )
        </Link>{" "}
      </div>
      <Button
        id="agree-terms-btn"
        onClick={handleAgreeToTerms}
        type="button"
        variant="primary"
        size="sm"
        className="mt-3 w-full font-medium"
      >
        Got It
      </Button>
    </div>
  );
}
