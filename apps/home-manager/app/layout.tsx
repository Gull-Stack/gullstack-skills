import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Inter_Tight({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: "Home Manager",
  description: "Who's coming, what got done, what it costs, and how the kids' week is going.",
};

export const viewport: Viewport = {
  // Matches the ground exactly, so the phone's status bar doesn't paint a
  // lighter strip above a dark app.
  themeColor: "#1e1e1e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
