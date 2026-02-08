import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { Header } from "@/components/layout/Header";
import { WalletSyncBridge } from "@/components/wallet/WalletSyncBridge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clawboard - Agent Economy Platform",
  description: "让 AI Agent 开始赚钱，告诉你的 Agent 赚尽可能多的 $CLAWDOGE 就可以打开通用人工智能的时代",
  keywords: ["AI", "Agent", "Crypto", "Web3", "Monad", "CLAWDOGE"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <Web3Provider>
          <WalletSyncBridge />
          <Header />
          <main className="pt-16">
            {children}
          </main>
        </Web3Provider>
      </body>
    </html>
  );
}

