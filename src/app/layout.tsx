import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Fragment_Mono,
  Playfair_Display,
  Public_Sans,
} from "next/font/google";

import {
  generateMetadata,
  generateViewport,
} from "@/utils/seo/generate-page-metadata";
import { getSiteStructuredData } from "@/utils/seo/structured-data";
import { BOT_UA } from "@/utils/bot-ua";

import { LazyCookie } from "@/components/common/Cookie";
import { CONSENT_FLAG_SCRIPT } from "@/components/common/Cookie/consent-flag";
import { ReducedMotion } from "@/components/common/reduced-motion";
import { ScrollLayout } from "@/layouts/scroll-layout";

import "@/app/globals.css";

// Brand typefaces (owner brand sheet, 2026-11-14 — ADR-0031):
// Public Sans for paragraphs and UI, Playfair Display Medium for titles,
// Cormorant Garamond for subtitles and the italic accent word.
const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  weight: "500",
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

const fragmentMono = Fragment_Mono({
  variable: "--font-fragment-mono",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = generateMetadata();
export const viewport: Viewport = generateViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The head script adds `data-preload` before hydration (see Preloader).
    // `data-consent` is set on <html> by CONSENT_FLAG_SCRIPT before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            // The list in src/utils/bot-ua.ts — a crawler or lab run opens the
            // page at once, with no preloader.
            // The page is served at rest under the opaque preloader and sent
            // off-screen (`data-preload-away`, preloader.css) once the browser
            // has reported painting the first screen's backdrop — its LCP
            // element — so the LCP is the first paint, not the fold. The
            // Preloader sets it at hydration at the latest, before any
            // entrance can see the page. The preloader always opens on the
            // hero: no restored scroll position (a reload after scrolling
            // used to land sections down) — ScrollLayout resets to the top
            // as the stage lets go.
            __html: `if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!/${BOT_UA.source}/i.test(navigator.userAgent)){try{history.scrollRestoration="manual"}catch(e){}var d=document.documentElement;d.dataset.preload="";try{var o=new PerformanceObserver(function(l){if(!l.getEntries().some(function(e){return e.element&&e.element.tagName==="IMG"&&e.element.closest("main")}))return;o.disconnect();requestAnimationFrame(function(){d.dataset.preloadAway=""})});o.observe({type:"largest-contentful-paint",buffered:true})}catch(e){d.dataset.preloadAway=""}}`,
          }}
        />
      </head>
      <body
        className={`${publicSans.variable} ${playfairDisplay.variable} ${cormorantGaramond.variable} ${fragmentMono.variable}`}
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
        <ScrollLayout>
          <ReducedMotion />
          <LazyCookie />
          {children}
        </ScrollLayout>
      </body>
    </html>
  );
}
