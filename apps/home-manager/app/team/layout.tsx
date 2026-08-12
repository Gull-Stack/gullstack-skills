import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Home Manager — team",
};

export const viewport: Viewport = {
  themeColor: "#1e1e1e",
  width: "device-width",
  initialScale: 1,
  // This is a phone held in one hand while the other one is doing something
  // else. Zoom stays available — locking it out of an app somebody uses all
  // day is a bad trade for a tidier layout.
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <div className="kiosk">{children}</div>;
}
