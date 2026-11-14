# Agent Guide — Relay (next16-claude-starter + AI Design Vault kit)

> Before changing performance-, SEO- or scene-related code, read
> `obsidian/meta/optimization-history.md` — what was optimized here, why, and
> what must not be undone.

## Rule zero — read the stack profile first

**`.claude/stack.json` is the single source of truth for this project's paths,
packages and commands.** The vault (`obsidian/`) tells you *how* things are done;
`stack.json` tells you *where* and *with what*. It has been adapted to this
codebase (Next.js 16 App Router, Yarn 1, `src/` layout).

- Never take a path, import or command from an example in the docs — resolve it
  from `stack.json`.
- If reality and `stack.json` disagree, reality wins: fix the profile in the same
  turn and say so. After a framework upgrade or a moved path, re-run `/adapt`.

## This is NOT the Next.js you know

Next 16 has breaking changes — APIs, conventions and file structure may differ
from your training data. **Read the relevant guide in `node_modules/next/dist/docs/`
before writing routing, metadata, data-fetching or proxy code.** Heed deprecation
notices. (`middleware.ts` no longer exists — it is `proxy.ts`.)

## Documentation lives in the vault

All project documentation is the **`obsidian/`** vault — the single source of
truth for how this project is built. Project-specific notes are canonical; the
kit's framework-neutral notes (`motion-system.md`, `text-motion.md`,
`routing-views.md`, `cms.md`, `database.md`) are background.

**Before working, read:**
- `obsidian/README.md` — Map of Content
- `obsidian/workflows/ai-agent-guide.md` — full rules of engagement
- The relevant topic note (e.g. `frontend/animation-system.md` before animation
  work, `workflows/new-page.md` before building a page)
- `DESIGN-MAP.md` — Figma file, frame/node IDs and section → component map

**Commands, skills and agents** live in `.claude/` and are mapped in
`obsidian/workflows/agent-harness.md`. Entry points: `/adapt`, `/new-page`,
`/section`, `/motion`, `/qa`, `/ship`, `/seo`, `/cms`, `/db`, `/migrate-site`.

Notes link each other with `[[wikilinks]]` — follow them to navigate.

## Hard rules (never violate)

1. **All motion is spring-based** — `@react-spring/web` via the components in
   `src/components/animation/springs/`. Text animation uses `spring-text-engine`.
   No CSS keyframes, no second animation library (`framer-motion`, GSAP, …).
   **One exception:** CSS `transition-*` for simple discrete state changes
   (hover/focus colour, opacity, border, small nudges) with token-backed timing —
   `duration-[var(--duration-fast)] ease-entrance`. Everything scroll-driven,
   revealing, staggered or layout-affecting stays a spring. See
   `obsidian/frontend/animation-system.md` and `design-system.md`.
2. **Do not modify** `src/components/animation/springs/` or `src/hooks/animation/`
   (`stack.json → paths.protected`) without explicit sign-off — they are the
   vendored animation engine. One authorised performance refactor has been made
   (ADR-0009 in `decisions-log.md`); they remain protected by default.
3. **Never `mode="manual"`** on `TextEngine` — use `always` / `once` / `forward` /
   `progress`. `TextEngine`'s container is **flex**, so `text-align` alone cannot
   align it — pair `text-center` with `justify-center` (etc.). `overflow` clips to
   the line-height box, so keep leading ≥ 1.1 (`leading-display`); never
   `leading-none` with `overflow`. See `obsidian/frontend/text-engine.md`.
4. **No hardcoded values** — design tokens in `src/app/globals.css` for styles;
   props/hooks for content. No raw hex/px in class names. Tokens follow the strict
   three-tier convention (`--raw-*` primitive → semantic role → `@theme` binding).
   See `obsidian/frontend/design-system.md`.
5. **Routes delegate to views** — `src/app/**/page.tsx` imports only from
   `src/views/`. All UI logic lives in the view.
6. **Server Components by default**; add `"use client"` only at the leaves.
7. **No `any`.** Type everything. `yarn lint` errors on `any` in app code; only
   the protected engine is exempt (ADR-0030).
8. **Navigation and images** — `next/link` `<Link>`, `next/navigation`
   `useRouter`, `next/image`. Never `next/router` (Pages Router).
9. **API & secrets** — external calls run server-side in `src/app/api/**/route.ts`;
   secrets are server-only env vars (never `NEXT_PUBLIC_`), read via `src/env.ts`.
   The browser only calls same-origin `/api/*`. Validate input with `zod`; return
   the `{ data }` / `{ error }` envelope. See `obsidian/backend/api-architecture.md`.
10. **Semantic, SEO-correct HTML** — native elements over `div`s, one `<h1>` and a
    clean heading outline, named landmarks, real `button`/`a`, `alt` text, JSON-LD
    (not microdata), semantic `tag` on animation components. See
    `obsidian/frontend/html-semantics.md`.
11. **Verify before reporting done.** `.claude/scripts/verify.sh` (zero FAILs) +
    `yarn lint` + `yarn build` after any code change, and the `qa-verify` skill
    after any UI change. See `obsidian/workflows/qa-verification.md`.
12. **CMS & database are Payload + Supabase**, added per project — not shipped.
    Use the `payload-cms` / `supabase-db` / `supabase-auth` skills; see
    `obsidian/backend/cms-payload.md`.
13. **3D performance → use the skill.** The page renders a fixed full-viewport
    three.js scene (`src/views/home/stream/`). For performance, jank or
    ship-readiness, invoke **`optimize-3d-scene`** first and follow its order of
    fixes. See `obsidian/workflows/optimize-3d-scene.md`.

## After making changes

Update the vault: dependency changes → `architecture/tech-stack.md` +
`meta/changelog.md`; architectural choices → an ADR in `meta/decisions-log.md`;
new component/hook/util → the relevant catalog note; a changed path, package or
command → **`.claude/stack.json`**. The `vault-librarian` agent can do this pass.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
