import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pixel = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-pixel-src" });
const terminal = VT323({ weight: "400", subsets: ["latin"], variable: "--font-term-src" });

export const metadata: Metadata = {
  title: "LIAMDEX — Liam Mahone",
  description: "Liam Mahone's portfolio: cybersecurity analyst at UT Austin RSOC, presented as a first-generation Pokédex.",
};

export const viewport: Viewport = {
  themeColor: "#d8202c",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${pixel.variable} ${terminal.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
