import { Metadata } from "next";
import { Providers } from "@/components/layouts/Providers";
import { Layout } from "@/components/layouts/Layout";
import { cn } from "@/utils/cn";
import interFont from "@/assets/fonts/inter";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Fathom from "@/components/fathom/Fathom";

const metadata: Metadata = {
  title: "Status Network Bridge",
  description: `Status Network Bridge is a bridge solution, providing secure and efficient cross-chain transactions between Layer 1 and Status Network.
  Discover the future of blockchain interaction with Status Network Bridge.`,
  icons: {
    icon: "./favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <title>{metadata.title?.toString()}</title>
      <meta name="description" content={metadata.description?.toString()} key="desc" />

      <body className={cn(interFont.variable, interFont.className)}>

        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>

      <Fathom/>
    </html>
  );
}
