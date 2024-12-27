"use client";

import { ToastContainer } from "react-toastify";
import { Header } from "./header";
import { useInitialiseChain } from "@/hooks";
import Sidebar from "./Sidebar";
import { useAccount } from "wagmi";
import WrongNetwork from "./WrongNetwork";
import TermsModal from "../terms/TermsModal";
import {availableChainIds} from "@/utils/constants";

export function Layout({ children }: { children: React.ReactNode }) {
  useInitialiseChain();

  const { chainId } = useAccount();

  return chainId &&
    !availableChainIds.includes(chainId) ? (
    <WrongNetwork />
  ) : (
    <div className="flex min-h-screen flex-col bg-cover bg-no-repeat">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        pauseOnFocusLoss={false}
        theme="dark"
      />
      <TermsModal />
      <Sidebar />
      <div className="md:ml-64">
        <Header />
      </div>
      <main className="m-0 flex-1 p-3 md:ml-64 md:p-10">{children}</main>
    </div>
  );
}
