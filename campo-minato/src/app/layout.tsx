import type { Metadata } from "next";

import "./globals.css";
import { GameStateProvider } from "@/context/GameStateContext";

export const metadata: Metadata = {
  title: "Campo Minato",
  description: "Gioca a Campo Minato",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GameStateProvider>
        <body>{children}</body>
      </GameStateProvider>
    </html>
  );
}
