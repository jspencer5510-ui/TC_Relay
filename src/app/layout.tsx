import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Playfair_Display, Public_Sans } from "next/font/google";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";
import { siteConfig } from "@/lib/site";

import { LazyCookie } from "@/components/common/Cookie";
import { CONSENT_FLAG_SCRIPT } from "@/components/common/Cookie/consent-flag";
import { AdaptiveGrid } from "@/components/common/grid";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { Preloader } from "@/components/common/preloader";
import { ScrollLayout } from "@/layouts/scroll-layout";

import "@/app/globals.css";

// Thinking Christian brand type: Public Sans for paragraphs and UI, Playfair
// Display Medium for titles, Cormorant Garamond for subtitles / the italic
// accent word (replaces the template's Mulish).
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

// Homepage title carries the brand + tagline (keyword-rich); subpages pass their own.
export const metadata: Metadata = generateMetadata({
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
});
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `data-consent` is set on <html> by CONSENT_FLAG_SCRIPT before hydration.
    <html suppressHydrationWarning lang="en">
      <body
        className={`${publicSans.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable}`}
      >
        {/* Before anything is parsed: marks a returning visitor's choice so the
            server-rendered consent banner is hidden before its first paint. */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_FLAG_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData()),
          }}
        />
        <Preloader />
        <ScrollLayout>
          {/* coef=1 → root font-size scales fully proportionally with the viewport
              on displays wider than the base width, so the rem-based layout grows to
              fill large monitors instead of staying small. */}
          <AdaptiveGrid coef={1} />
          <ReducedMotion />
          <LazyCookie />
          {children}
        </ScrollLayout>
      </body>
    </html>
  );
}
