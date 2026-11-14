---
tags: [architecture, stable]
updated: 2026-09-26
---

# Tech Stack

Every dependency in `package.json`, what it does, and why it is here.
Package name: `next16-claude-starter` · version `0.1.0` · private.

## Core framework

| Package | Version | Role |
|---------|---------|------|
| `next` | `16.4.6` | App Router framework (16.3.1 → 16.4.6 on 2026-11-14 for security advisories). ⚠️ See warning below. |
| `react` / `react-dom` | `19.2.8` | UI runtime |
| `typescript` | `^5` | Type system — `any` is banned |

> [!warning] This is not the Next.js you may know
> `AGENTS.md` warns: APIs, conventions, and file structure may differ from older
> Next.js knowledge. Always check [[routing]] before writing routing code, and
> heed deprecation notices.

## Styling

| Package | Version | Role |
|---------|---------|------|
| `tailwindcss` | `^4` | Utility CSS — **no `tailwind.config.js`** |
| `@tailwindcss/postcss` | `^4` | PostCSS integration |

Tailwind v4 is configured entirely in `src/app/globals.css` via `@theme inline`.
See [[design-system]].

## Animation (the heart of the starter)

| Package | Version | Role |
|---------|---------|------|
| `@react-spring/web` | `^10.1.2` | Spring physics — drives **all** motion |
| `spring-text-engine` | `^0.1.5` | Scroll-aware spring text animation |

No `framer-motion`, no CSS transitions/keyframes. See [[animation-system]] and
[[text-engine]]. ADR: [[decisions-log]] ADR-0002.

## Scroll & state

| Package | Version | Role |
|---------|---------|------|
| `lenis` | `^1.3.26` | Smooth scrolling |
| `zustand` | `^5.0.15` | Lightweight global state (scroll store) |
| `resize-observer-polyfill` | `^1.5.1` | ResizeObserver fallback for animation hooks |
| `zod` | `^4.6.6` | Schema validation — env (`src/env.ts`) + API payloads. See [[api-architecture]] |

See [[smooth-scroll]] and [[data-flow]].

## 3D

| Package | Version | Role |
|---------|---------|------|
| `three` | `^0.186.1` | WebGL — the page-long particle stream (`src/views/home/stream/stream-scene.ts`). Loaded with a dynamic `import()` after hydration, so it never sits in the first-load bundle. ADR-0024, ADR-0026. |
| `@types/three` (dev) | `^0.186.0` | Types for `three` and `three/addons/*` |

## Misc

No miscellaneous runtime dependencies. Cookie consent is an in-house component
(`src/components/common/Cookie/`) built on Zustand + `@react-spring/web` — the
former `react-cookie-consent` package was removed. See [[components/common]].

## Tooling

| Package | Role |
|---------|------|
| `eslint` `^9` + `eslint-config-next` `16.4.6` | Linting — run `yarn lint` before commits. `no-explicit-any` is ON for app code (ADR-0030) |
| `@types/*` | Type definitions for node/react |

## Scripts

```bash
yarn dev      # next dev — local development
yarn build    # next build — production build
yarn start    # next start — serve production build
yarn lint     # eslint
```

Package manager: **Yarn** (`yarn.lock` is committed).

## Runtime

**Node ≥ 20.19.0**, declared in `package.json` `engines` and pinned for local dev
by `.nvmrc` (24.16.0). Next 16 itself only needs ≥ 20.9, but the ESLint 9
toolchain pulls `eslint-visitor-keys@5`, which requires
`^20.19.0 || ^22.13.0 || >=24` — on Node 20.17 `yarn install` **fails outright**,
which is why the floor is declared rather than left implicit.

## Deliberately held back

Three dependencies are **not** on latest, each for a verified reason (ADR-0022).
Re-test these periodically rather than assuming they are still blocked:

| Package | Held at | Latest | Why |
|---------|---------|--------|-----|
| `typescript` | `^5.9.3` | `7.0.2` | `eslint-config-next` depends on `typescript-eslint@8`, whose peer range is `typescript >=4.8.4 <6.1.0`. TS 7 (the native Go compiler, GA July 2026) would break linting. Revisit when typescript-eslint supports it. |
| `eslint` | `^9.39.4` | `10.8.1` | **Tested and reverted.** ESLint 10 crashes `eslint-plugin-react` (`context.getFilename()` was removed): `TypeError: contextOrFilename.getFilename is not a function`. Three of Next's bundled plugins still declare `eslint ^9` peers. |
| `@types/node` | `^24` | `26.2.0` | Tracks the Node major actually in use (24), not the newest published. |

## Not in the starter — chosen, but added per project

The starter stays dependency-light; these are the **decided** defaults, installed
only when a project needs them (ADR-0020):

| Need | Choice | Playbook |
|------|--------|----------|
| CMS | Payload (in-app, Next-native) | [[cms-payload]] · `/cms` |
| Database | Supabase Postgres | [[database-supabase]] · `/db` |
| File storage | Supabase Storage (S3-compatible) | [[cms-payload]] |
| Auth | Supabase Auth (`@supabase/ssr`) — only with real user accounts | [[database-supabase]] |

> [!note] Payload compatibility — satisfied as of 2026-08-18
> `@payloadcms/next` 3.88 peer-requires `next >=16.2.6 <17`. The starter is on
> `16.4.6`, so it now satisfies that range. Re-check when either side moves.

> [!note] `resolutions` in `package.json`
> `source-map-js ^1.2.2` and `baseline-browser-mapping ^2.11.0` are forced
> (transitive via `next`) to clear DoS advisories. Drop them once `next` ships
> patched ranges itself — check with `yarn audit --groups dependencies`.

Still undecided: payments, i18n, data-fetching libraries, testing. Document here
when adopted and add an ADR to [[decisions-log]].

## Related

[[system-overview]] · [[folder-structure]]
