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
  name: "Relay",
  /** Home `<title>`; inner pages render as "Page — Relay" (see `titleTemplate`). */
  title: "Relay — the handoffs run themselves",
  titleTemplate: "%s — Relay",
  description:
    "Relay runs the steps between your apps and only pings a person when it matters. Approvals in Slack, automatic retries, 240 apps connected.",
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
    "Relay — The handoffs run themselves. Relay runs the steps between your apps and only pings a person when it matters.",
  /** X / Twitter handle, e.g. "@relay" — left unset until the account exists. */
  twitterHandle: undefined as string | undefined,
  author: "Relay Labs",
  keywords: [
    "workflow automation",
    "no-code automation",
    "Slack approvals",
    "integrations",
    "Stripe automation",
    "business process automation",
  ],
  /** Browser theme-color (address bar / PWA) — the page background. */
  themeColor: "#000000",
} as const;
