---
tags: [architecture, stable, decision]
updated: 2026-08-18
---

# The Stack Profile

`.claude/stack.json` is **this project's shape**, in machine-readable form. It is
the single source of truth for paths, packages and commands, and it is what makes
one kit work in any framework. ADR: [[decisions-log]] ADR-0007.

> [!important] The habit that matters
> **Resolve every path and package name from `stack.json`.** The vault's examples
> are illustrations — `src/app/page.tsx` in a note does not mean this project has
> one. Reading a path out of documentation is the single most common way an agent
> writes a file into the wrong place here.

## What reads it

| Reader | Uses |
|---|---|
| `.claude/scripts/verify.sh` | every path, extension, binding, capability and convention — it decides which checks run |
| `.claude/scripts/hooks/*` | `adapted`, `framework.name` — the session-start guidance |
| Skills | `commands.*`, `paths.*`, `bindings.*` instead of naming a framework |
| Rules | their `paths:` frontmatter is retargeted from it by `/adapt` |
| You | before writing any file |

## The field groups

Full schema with descriptions: `.claude/stack.schema.json`.

| Group | What it answers |
|---|---|
| `framework` | which framework, which version, **which render model** |
| `language`, `packageManager` | is `any` checkable; which command prefix |
| `paths` | where routes, views, components, styles, assets, server code, env and protected zones live |
| `extensions` | which file types are source (`.tsx`, `.vue`, `.svelte`, `.astro`…) |
| `bindings` | the concrete package or API for motion, text motion, scroll, styling, image, link, router, metadata, validation, and the public env prefix |
| `capabilities` | what the framework can do — SSR, server components, file routing, API routes, image optimisation, islands |
| `conventions` | which kit conventions are on; switching one off needs an ADR |
| `commands` | verbatim shell commands, package manager included |
| `notes` | anything the fields cannot express |

### `renderModel` deserves attention

It changes what is true about the project more than the framework name does:

| Value | Consequences |
|---|---|
| `server-components` / `ssr` | secrets are safe server-side; content reaches crawlers; server-first rule applies |
| `ssg` | same crawlability, no runtime server — data is fetched at build time |
| `islands` | content is server-rendered, but each interactive island is a separate hydration root — motion state does not cross them for free |
| `spa` | **no server, no secrets, no crawlable content without prerendering.** Half the SEO skill's findings collapse into this one |

## Keeping it true

A profile that lies is worse than no profile: `verify.sh` skips checks silently
and agents write files into paths that no longer exist. So:

- Moved a directory, added a package, renamed a script → **update the profile in
  the same turn.** The `Stop` hook asks; the `vault-librarian` agent can do it.
- After a framework upgrade or migration → **re-run `/adapt`.** Majors rename
  APIs (a middleware file, a metadata export, an env prefix); the profile is
  where that gets corrected once.
- `verify.sh` prints its profile header on every run — if that header surprises
  you, fix the profile before trusting the result.

## Resolved profile

Adapted 2026-11-14 by `/adapt`. Evidence: `package.json` (`next@16.3.1`,
`react@19.2.8`), `yarn.lock` (Yarn 1), `next.config.ts`, `src/app/` App Router
tree, `src/proxy.ts`, and the imports counted in `src/`.

**Framework:** `nextjs` · Next.js 16.4.6, App Router · `server-components`
**Language / package manager:** ts · yarn (1.22, `--frozen-lockfile`)

| Path | Value |
|---|---|
| source | `src` |
| routes | `src/app` |
| views | `src/views` (already existed) |
| components | `src/components` |
| styles | `src/app/globals.css` (+ `src/style/sections/*.css`) |
| assets / static root | `public/assets` / `public` |
| server | `src/app/api` |
| env | `src/env.ts` |
| protected | `src/components/animation/springs/**`, `src/hooks/animation/**` |

| Binding | Value |
|---|---|
| styling | `tailwind-v4` |
| motion | `@react-spring/web` |
| text motion | `spring-text-engine` |
| smooth scroll | `lenis` |
| image / link / router | `next/image` / `next/link` / `next/navigation` |
| metadata | `next-metadata` |
| validation | `zod` (state: `zustand`) |
| public env prefix | `NEXT_PUBLIC_` |

**Commands:** `yarn install --frozen-lockfile` · `yarn dev` · `yarn build` ·
`yarn start` · `yarn lint` · typecheck — none (`yarn build` type-checks) · test — none

**Conventions switched off:** none.

**Judgement calls made during adaptation:**
- The kit was merged into an existing project that already carried an earlier,
  hard-coded version of the same harness. See [[decisions-log]] ADR-0029 for
  which side won each overlap.
- `src/style/index.css` is a commented-out legacy entry; `globals.css` is the
  real token file.
- Lint was tightened after adaptation (ADR-0030): `no-explicit-any` and
  friends are on for app code, off for the protected engine only.
- `verify.sh`'s transition check now accepts the Tailwind v4 shorthand
  `duration-(--token)` as well as `duration-[var(--token)]`.

## Related

[[adapt-stack]] · [[folder-structure]] · [[tech-stack]] · [[system-overview]]
