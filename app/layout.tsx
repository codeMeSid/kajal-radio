import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kajal Radio · काजल रेडियो",
  description:
    "A one-street radio station. Thirty-six songs about kajal, playing out of a cassette shop in Jaisalmer, 1997.",
};

export const viewport: Viewport = {
  themeColor: "#16110b",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
