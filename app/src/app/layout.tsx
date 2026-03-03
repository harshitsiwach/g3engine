import type { Metadata } from "next";
import "./globals.css";
import SolanaProvider from "@/providers/SolanaProvider";

export const metadata: Metadata = {
  title: "G3Engine",
  description: "A zero-code, browser-based 3D game engine with Web3 integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}
