/**
 * Site-wide configuration — the single source of truth for SEO.
 *
 * Consumed by the metadata generator, `robots.ts`, `sitemap.ts`, and the
 * JSON-LD structured-data helper. Update the placeholder values per project.
 */
import { getServerEnv, publicEnv } from "@/env";

/**
 * Vercel's production domain, read at build time — the fallback when a deploy
 * doesn't set `NEXT_PUBLIC_SITE_URL` (none did: the live canonical said
 * localhost). Server-only: every consumer of `siteConfig` renders on the server.
 */
const vercelProduction = getServerEnv().VERCEL_PROJECT_PRODUCTION_URL;

export const siteConfig = {
  name: "Thinking Christian",
  /** Short brand promise — used in the page title, PWA, and JSON-LD slogan. */
  tagline: "Unsettling convention. Cultivating conviction.",
  description:
    "Calm, thoughtful, theological conversations. Reading the Bible as the final authority for life and faith means questioning the assumptions of our culture, even our Christian culture.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url:
    publicEnv.NEXT_PUBLIC_SITE_URL ??
    (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000"),
  /** Default Open Graph / Twitter share image (path under `public/`) — a
   *  1200×630 capture of the hero (optimization-pipeline scaffold-brand). */
  ogImage: "/open-graph.jpg",
  ogImageAlt:
    "Thinking Christian — “Unsettling convention. Cultivating conviction.”",
  /** No real handle on the site (its X link is a placeholder) — no twitter:site tags. */
  twitterHandle: undefined as string | undefined,
  author: "James Spencer",
  /** Search keywords, from the page's own copy. */
  keywords: [
    "Thinking Christian",
    "James Spencer",
    "Christian podcast",
    "theology",
    "Digital Discernment",
    "Thinking Christian Framework",
  ],
  /** Browser theme-color (address bar / PWA) — the dark hero backdrop the page opens on. */
  themeColor: "#1e1e1e", // brand ink — the hero is dark
} as const;
