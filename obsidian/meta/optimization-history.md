---
tags: [meta, optimization]
updated: 2026-10-06
---

# Optimization history — relay

What the optimization pipeline changed in this project, why, and what must not
be undone. Maintained by the optimization pipeline
(`getlayers-pipeline/optimization-pipeline`; full record with every run in its
`obsidian/Projects/relay.md`, decisions D-0xx in its `obsidian/Meta/decisions-log.md`).
Condensed for the next agent who edits this project. Last updated 2026-10-06.
Project-side detail: [[changelog]] (entries from 2026-10-03 on) and
[[decisions-log]] (ADR-0023 iOS URL bar, ADR-0026 page-long stream, ADR-0027
no layout reads in a scrolled frame, ADR-0028 rendering budget / robot path).

## Current state

| | value | when / source |
|---|---|---|
| Live URL | the `getlayers-Relay` Vercel production deploy (follows `main`) | — |
| Status | **optimized** — with the owner's scroll exception (`--accept-scroll`, D-032) | 2026-10-06 |
| Lighthouse production | logged as "mobile 91/96 (P 96), desktop 97/97" — read: mobile perf 96, desktop 97; A11y / BP / SEO 100 | 2026-10-06, after D-036 merge |
| Robot form (D-029 record) | PC 100, mobile 98 | 2026-10-03/04 |
| Scroll, production sweep | desktop **ideal** (0.38 %, max 33.8 ms); mobile **janky** (3.88 %, max 68.2 ms) | 2026-10-06, before D-033 |
| Scroll after D-033 (local) | desktop **ideal** (cold 0.19 %, max 25 ms); mobile smooth 1.52 % | 2026-10-06 |
| Scroll after D-037 (local, phone) | cold 2.41 / 2.57 %, warm 0.22 / 0.50 % — same as main | 2026-10-06 |
| Phone stream fps (fps-probe) | 120 at rest, ~80 touch-scrolling | 2026-10-06 (D-037) |

No hosted record has been taken yet for the D-037 commit (`deb2ff9`).

## Invariants — do not undo

- **Robot form** — `src/proxy.ts` rewrites bot UAs to `src/app/robot-view/page.tsx`;
  `HomeView({ robot })` renders no preloader, no particle stream, no cursor dot;
  `InviewSeen` / footer `Stage` → `robot-inview`; `BreathingDot` loops only when
  motion is on and not robot (a looping spring under `skipAnimation` hangs). D-016.
  Robot PC 99 → 100, mobile 83 → 90 in pass 1.
- **`src/utils/bot-ua.ts` is the author's file** (`isBotClient`) with
  `isBotUserAgent` appended — a scaffold once overwrote it and broke the build.
  `BOT_UA` carries the AI crawlers (GPTBot, ClaudeBot…); the preloader head
  script in `src/app/layout.tsx` builds its regex from `BOT_UA.source` — keep one list.
- **Page at rest under the opaque preloader** — the page is laid out at rest
  under the curtain and sent off-screen only after the backdrop dot-field
  reports its paint (or at hydration). The dot-field is the LCP element. Mobile
  87 → 97 hosted (D-028). `src/views/home/preloader.tsx`, `src/style/sections/preloader.css`.
- **Cookie banner is server-rendered** (under the preloader) — D-028, part of the LCP fix.
- **Dot field is one `<picture>`** (`src/views/home/sections/backdrop/index.tsx`) —
  phones no longer download the hidden desktop image (24 KB gz). D-028.
- **Particle stream loads after the preloader** on phones (its 141 KB three
  chunk was in the LCP window: mobile 58 → 68, TBT 868 → 512). On desktop it is
  built from `load` under the loader in short yielding steps, drawn only after
  the fold — else the build (54–244 ms), `compileAsync` polling and first draw
  land on the first wheel (D-033). `src/views/home/stream/particle-stream.tsx`.
- **`HydrateNear`** (`src/components/common/hydrate-near.tsx`) inside every
  below-hero `<Suspense>`: the block keeps its server HTML and hydrates near
  the viewport (phones / robot / reduced motion), or one per idle callback in
  page order behind the preloader (desktop). Mobile 68 → 83, TBT 512 → 79 (D-026);
  desktop first-scroll freezes 225 ms → 0 frames > 50 ms (D-033).
- **Empty `src/app/loading.tsx` deleted** — it hid streamed copy from crawlers (fleet fix).
- **Scroll held through the preloader and its fold** — Lenis is *stopped*
  while `data-preload` / `data-preload-closing` (`overflow: hidden` does not stop
  Lenis), no other effect may restart it (`isEnableScroll` did), page reset to 0
  as the stage goes, `history.scrollRestoration = "manual"` in the head script.
  Wheel under the loader 1,643 px → 0; reload 504 → 0. D-033.
  `src/layouts/scroll-layout.tsx`, `src/app/layout.tsx`.
- **Bar chart cubes / caps / glow drawn inline** (`product/chart-card.tsx`,
  `chart-shapes.tsx`, `style/sections/product.css`) — 13 lazy SVG images built
  SVG documents mid-scroll; header frame 108/117 → 66/67 ms. D-031. (The old
  SVG files are unused but left in place.)
- **`transitions/logo-open.tsx` writes CSS vars / clip-path / opacity only on
  change**, not on every scroll event — header frame 91–92 → 65–67 ms. D-031.
- **No phone frame cap on the stream** — `FRAME_GAP.phone = 20` ms drew 40 fps
  at rest / 34 scrolling; now `NO_GAP` → 120 / 80, scroll unchanged. Paid for by
  the low tier (DPR 1.2, 45 % particles, 60 % strands, half-size bloom). Fleet
  rule: no fixed phone cap (D-033/D-037).
- **Stream canvas on stable-viewport** (`src/utils/stable-viewport.ts`): `lvh`
  at first paint, then a px height measured once, re-measured on touch only on
  a width change (rotation re-sizes). The scene maps document px through the
  canvas height, so any height change re-placed the whole stream. px, not rem.
  `ios-toolbar-probe` FAIL → PASS. D-037.
- **Phone layout scaled to a 16 px edge**: at ≤ 580 px `html` font-size =
  `min(calc((100vw − 32px) / 21.875), 18.194286px)`; `@utility mx-page` centres
  `<main>` and the header bar; body `overflow-x: clip`; `--spacing-page-edge` /
  `px-page-edge` on the menu so its logo / ✕ sit exactly on the header's. D-036.
  `src/app/globals.css`, `sections/nav/nav-menu.tsx`.
- **Full-screen phone menu** (`sections/nav/nav-menu.tsx`): portalled sheet,
  circle clip-path, scroll lock, Esc, focus trap, unmounted when closed,
  reduced motion = fade. D-033.
- **Contrast tokens**: `--foreground-dim` → `--raw-color-neutral-480` #797e85
  (4.43 → ~4.8:1); footer eyebrow on lime → `--raw-footer-color-ink-a62`
  (3.53 → ~5:1); social chips named `GitHub (gh)` (label in name). Robot A11y 96 → 100.
- **Hero bloom `object-cover`** — percentage-cropped image was stretched; mobile BP 96 → 100.
- **Site origin**: `siteConfig.url` falls back to `VERCEL_PROJECT_PRODUCTION_URL`
  (`src/lib/site.ts`, D-019) — never localhost.
- `robot-text.tsx` casts the tag through `ComponentType` and lays out as a
  wrapping flex row (template follow-ups, robot form only).

## Owner decisions

- **D-016** (2026-09-29) robots get a static page: no preloader, no animation, same content.
- **D-017 / D-026 / D-028 / D-029** A11y / BP / SEO 100 on every device (people
  and robot); performance ≥ 90 desktop and mobile; never cut a mobile scene
  without asking; nav links to unbuilt pages become `#`.
- **D-027 / D-034** pass branches are merged to `main` when they close.
- **D-031** (2026-10-05) scroll round: 0 frames > 50 ms aimed on both devices.
- **D-032** (2026-10-06) marked optimized with `--accept-scroll` (mobile scroll short of ideal).
- **D-033** (2026-10-06) owner: loader landed a few sections down; first desktop
  scroll froze; phone menu must be proper full-screen.
- **D-036** (2026-10-06) owner: mobile side padding 1rem; header and menu padding match.
  Open for the owner: the type is slightly larger at 414–430 (+13.7 % at 430);
  the alternative (16 px only at 390) is one number — the cap.
- **D-037** (2026-10-06) owner: background scene low fps while scrolling on
  mobile; it changes height on iOS scroll-direction change.
- **#50 / D-034**: iOS toolbar and phone-cap fixes only where the owner notices.

## History by pass

| pass | date · commit | change | blamed by | before → after |
|---|---|---|---|---|
| 1 | 2026-09-29 · `ce63b89` | robot path (D-016) | D-016 | robot PC 99 → 100, mobile 83 → 90 |
| 1 | | hero bloom `object-cover` | `image-aspect-ratio` | mobile BP 96 → 100 |
| 1 | | `bot-ua.ts` restored + extended | build error | green |
| 1 | | D-019 origin fallback | fleet | canonical = host |
| 1 | | contrast tokens + label in name | robot at-rest A11y | 96 → 100 |
| 1 | 2026-09-30 · `f0a379d`, `7184574` | robot-text typing / flex row | template | — |
| D-026 | 2026-10-01 · `1861058` | delete `app/loading.tsx` | — | mobile 57 → 58 |
| D-026 | | stream fetched after the preloader | three chunk in LCP window | 58 → 68, TBT 868 → 512 |
| D-026 | | `HydrateNear` per block | hydration TBT | 68 → 83, TBT 512 → 79; hosted PC 98 / mob 87 |
| D-028 | 2026-10-03 · `a19ce0a` | page at rest under preloader, banner SSR, AI crawlers in `BOT_UA`, dot-field `<picture>` | LCP = dot-field at ~4.5 s | hosted mobile 87 → **97**, PC 98; axe-sweep 0 |
| D-028 | `10bbe2f` | scroll-wave experiments documented (all reverted) | — | — |
| D-031 | 2026-10-05 · `4c057f9` | chart shapes inline; logo-open writes on change | lazy SVGs, per-scroll restyle | prod-vs-opt: mobile 5.02 % → 3.24 %, desktop ideal; LH 98/96 |
| D-033 | 2026-10-06 · `8751b89` (pass-2) | scroll held through loader; desktop stream pre-built; idle hydration; full-screen menu | owner | wheel under loader 1,643 → 0 px; desktop 0 frames > 50 ms; local mobile 91 / desktop 97 |
| D-036 | 2026-10-06 · `ca41a6e` (pass-3) | 16 px phone edge via root scaling; menu padding = header | owner | edges 16.0 px at 360/390/430; prod mobile 96 / desktop 97 |
| D-037 | 2026-10-06 · `deb2ff9` (pass-4) | no phone frame cap; stable-viewport canvas | owner, fps-probe, ios-toolbar-probe | 40 → 120 fps rest, 34 → 80 scrolling; probe FAIL → PASS; local mobile 87 vs main 86 |

## Tried and reverted / didn't help

- `inlineCss` (Next experimental) — flat, reverted (D-028).
- Prefetching the chart SVG images on idle from load — freeze 108 → 66 ms but
  TBT 70 → 149 and BP 96 (the stretched footer image got audited). Reverted.
- Prefetching them from the first gesture — freeze 59 ms but cold dropped
  1.96 → 3.23 %. Reverted.
- Ruled out by injected CSS as the cause of the phone frames: the header
  reveals, slab blur, `content-visibility`, fade wrappers, canvases, the whole
  `#product` block; for `#proof`: reveals, slab blur, stat visuals, blooms.

## Open items / leads

- **Mobile scroll not ideal** (accepted, D-032): a 67–109 ms gpu/raster frame at
  `#proof` / `header.flex` (present waits around the frosted slab on a 3×
  phone; sections hydrating on approach 38–60 ms; the stream's shader build at
  the first scroll ~72 ms). Leads: smaller hydration units; the stream in a
  worker; pre-promote the header's blur layer; the nav/tile/slab blurs on 3× phones.
- `footer-aurora-blue.png` is stretched on phones — a shipped defect, owner's call.
- Below-fold client code: a 53 KB chunk across ~48 client components — split it.
- `use-seen.ts:78` reads layout per element on mount + `scrollHeight` in
  `atBottom` (37 ms at 4×); `count-up.tsx` first `toLocaleString` initialises Intl (~30 ms).
- Not verified on a real iPhone: held `overflow: hidden` under native touch,
  the stable canvas height, 120 Hz feel. Hosted record after D-037 still to take.

## How to measure

```sh
cd getlayers-pipeline/optimization-pipeline
node tools/measure.mjs relay --hosted             # Lighthouse + scroll, PC + mobile, production
node tools/measure.mjs relay --hosted --as-bot    # the robot form (kept apart from people records)
node tools/measure.mjs relay --only scroll --devices mobile --runs 1 --no-build   # iterate on a freeze
node tools/fps-probe.mjs <url>                    # phone stream fps, rest + touch scroll (120 Hz panel)
node tools/ios-toolbar-probe.mjs --url <url> --out <dir> --sel canvas.mix-blend-screen
node tools/resize-check.mjs relay --out <dir>     # live resize = fresh load
node tools/axe-sweep.mjs <url> --device both      # contrast sampled through the entrance
```

Scope `ios-toolbar-probe` with `--sel canvas.mix-blend-screen`: unscoped, its
rotation step picks the statement dot-field canvas and reports a false "✖ rotate".

The pipeline's scroll test waits for Lenis to unlock; an owner's "first scroll"
straight after the loader is a different moment — probe it explicitly.
