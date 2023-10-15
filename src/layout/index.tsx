import React from "react";
import { Inter } from "next/font/google";

import Header from "./header";
import useThemeMode from "@/hooks/useThemeMode";
import { THEME } from "@/types";

type LayoutType = {
  children: React.ReactNode;
};

const inter = Inter({
  subsets: ["latin"],
});

const Layout: React.FC<LayoutType> = ({ children }) => {
  const { mode } = useThemeMode();

  return (
    <main
      className={`w-full min-h-screen bg-[0_-30vh] transition-all relative ${
        mode === THEME.DARK ? "bg-back-dark bg-[#2c2f36]" : "bg-back-light"
      } ${inter.className}`}
    >
      <Header />
      {children}
    </main>
  );
};

export default Layout;
