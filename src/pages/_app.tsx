import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiConfig } from "wagmi";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

import { chains, config } from "../wagmi";
import Layout from "@/layout";
import { ThemeModeProvider } from "@/hooks/useThemeMode";
import WrongNetworkModal from "@/components/WrongNetworkModal";

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>AIRDROP</title>
      </Head>
      <WagmiConfig config={config}>
        <ThemeModeProvider>
          <RainbowKitProvider chains={chains}>
            {mounted && (
              <Layout>
                <Component {...pageProps} />
                <WrongNetworkModal />
              </Layout>
            )}
          </RainbowKitProvider>
          <Toaster />
        </ThemeModeProvider>
      </WagmiConfig>
    </>
  );
}
