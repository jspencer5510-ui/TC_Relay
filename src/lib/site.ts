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
  /** Home `<title>`; inner pages render as "Page — Thinking Christian" (see `titleTemplate`). */
  title: "Thinking Christian | Unsettling Convention. Cultivating Conviction.",
  titleTemplate: "%s — Thinking Christian",
  description:
    "Reading the Bible as the final authority for life and faith means questioning the assumptions of our culture, even our Christian culture. Calm, thoughtful, theological conversations.",
  /**
   * Public origin, no trailing slash. Drives canonical URLs, OG tags, the
   * sitemap, and JSON-LD. Set `NEXT_PUBLIC_SITE_URL` in production.
   */
  url:
    publicEnv.NEXT_PUBLIC_SITE_URL ??
    (vercelProduction ? `https://${vercelProduction}` : "http://localhost:3000"),
  /** Default Open Graph / Twitter share image (path under `public/`), 1200×630. */
  ogImage: "/open-graph.png",
  ogImageAlt:
    "Thinking Christian — Unsettling convention. Cultivating conviction. Calm, thoughtful, theological.",
  /** X / Twitter handle — left unset until confirmed. */
  twitterHandle: undefined as string | undefined,
  author: "James Spencer",
  keywords: [
    "Christian theology",
    "biblical discernment",
    "Christian podcast",
    "Scripture and theology",
    "Christians and politics",
    "faith and technology",
  ],
  /** Browser theme-color (address bar / PWA) — the page background. */
  themeColor: "#e4e2dd", // brand paper — matches --background (ADR-0031)
} as const;
