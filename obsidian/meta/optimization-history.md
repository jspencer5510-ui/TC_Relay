---
tags: [meta, performance, seo, optimization]
updated: 2026-10-06
---

# Optimization history — Stride (banking)

What the optimization pipeline did to this project, why, and what must not be
undone. Maintained by the optimization pipeline
(`getlayers-pipeline/optimization-pipeline`, source
`obsidian/Projects/stride.md`; D-xxx numbers are that workspace's
`obsidian/Meta/decisions-log.md`). Last updated 2026-10-06. The detailed
per-change notes (traces, A/B rounds) are in [[changelog]] from 2026-10-04 on;
ADRs in [[decisions-log]] — not repeated here.

The page: a fintech one-pager — root-layout preloader (counter + bar, slides
up), a hero of two WebGL canvases (gradient backdrop + plasma burst, `lighten`
blend), logo marquee, about, stats, showcase, works, a pinned three.js chain
model, product, contact, a footer with its own heart scene. Repo
`textura-agency/stride`, Vercel project `stride`. Not to be confused with
`stride-nine` (repo `getlayers-stride`, open question #31, resolved).

## Current state

Live: `https://getlayers-stride-xi-ten-uyiobkjhljnadsnbfjk.vercel.app/`
(production = `main`). Status: **optimized** with the owner's scroll exception
(`--accept-scroll`, D-032, 2026-10-06).

| record | date | desktop | mobile |
|---|---|---|---|
| Lighthouse people, production (after pass-3 merge, 3 runs) | 2026-10-06 | P 97, A11y/BP/SEO 100 | P 96 (83/97/96), A11y/BP/SEO 100 |
| Lighthouse robot form (opt deploy of the D-031 code) | 2026-10-04 | 100 / 100 / 100 / 100 | 99 / 100 / 100 / 100 |
| Scroll, hosted (opt deploy of the D-031 code, now `main`) | 2026-10-05 | **ideal** (0 %, max 24 ms) | **smooth** (cold 2.3 %, max 49 ms, nothing > 50 ms) |

Production before the D-031 merge read desktop smooth 0.91 % (67 ms) / mobile
smooth 2.37 %. No hosted scroll record exists yet for the pass-2/pass-3 code;
local checks read mobile ideal on pass-2 and ideal 1 of 3 on pass-3.

## Invariants — do not undo

- **Consent banner server-rendered** (`src/components/common/Cookie/`
  `CookieBanner.tsx`, `LazyCookie.tsx`, `consent-flag.ts`) — it was the mobile
  LCP (render delay 3.6 s); it sits under the preloader, so nothing visible
  changes. With the fonts: mobile 76 → 93, LCP 4.2 → 1.25 s.
- **Fonts are Latin WOFF2 subsets** (Mulish TTFs 3 × 108 KB → 16 KB; the ✓/✕
  glyphs of the dev panels are kept in the subset).
- **Robot form at `/robot-view` (D-016):** `src/proxy.ts` + `src/utils/bot-ua.ts`
  (AI crawlers included) rewrite bots to the static variant; the preloader is
  gated (`data-preloader` + CSS `:has`, layout-effect unmount releasing
  `done`); the hero is a captured still of both canvases; the chain and footer
  scenes never start there; `useRevealCascade` and `HeroTitle` read
  `useRobot()` and start at rest (they run their own ticker clocks, which
  bypassed the global `skipAnimation` — robot A11y was 96). Never `await
  isBot()` in a page.
- **No `src/app/loading.tsx`** — an empty one hides the `<h1>` from no-JS
  crawlers inside a streamed `<div hidden>`.
- **Logo marquee:** wordmarks are CSS-generated content, the marquee is
  `aria-hidden`, one `sr-only` list carries the names (the 1.61:1 wordmarks
  are the design; A11y 92 → 100).
- **Contrast tokens** (`src/app/globals.css`): `--muted-small` `#69707c`
  (4.99:1) for small text such as the "About us" eyebrow — `--muted` stays for
  large display words only; `--card-blue` `#2b72e2` (was `#2f7cf6`, ~8 %
  darker) with that card's copy full white (4.56:1) — no white alpha passes on
  the old blue (max 3.94:1). Applied for D-029; owner was told to look.
- **Footer phone/email `gap-3`** (centres 32 px apart) — target-size audit.
- **Below-fold scenes are built after `load`, one per idle moment**
  (`src/lib/three/after-load.ts`, used by `src/views/chain.tsx`,
  `footer-scene.tsx`) — all six WebGL contexts were built in one ~480 ms
  hydration task. Mobile 84/85/77 → 88/88/87 locally, production 89 → 94.
- **Shader status reads skipped in production + first draws in idle**
  (`src/lib/three/gl-steps.ts`) — three r143's sync `getProgramParameter`
  made each build step wait on the GPU compile (130–840 ms).
- **Phones render the chain, footer heart and both backdrops in one shared
  worker** (`src/lib/three/scene.worker.ts`, `scene-host.ts`; cores are
  DOM-free: `createChainCore`, `createGradientCore`). The **hero burst stays on
  the page thread** on phones. Desktop and phones without OffscreenCanvas use
  the main-thread wrappers.
- **Frame caps** (`src/lib/three/frame-cap.ts`): desktop scenes draw at most
  ~60 fps on 120 Hz panels (12.5 ms; the footer heart's 107–450 ms first draw
  and 120 Hz draws froze the scroll) and the heart draws one warm frame at
  build on desktop; the phone worker is capped at 60 fps (at 120 the footer
  stalled 116–126 ms). There is **no 30 fps phone cap** — the owner saw those
  as choppy elsewhere (D-033); do not add one.
- **Footer heart floats front-on** (`chain-scene.ts` `motion: "float"`, set in
  `src/views/footer-scene.tsx` with `fitWidth: 0.82`): ±12° yaw sway, ±2° roll,
  small bob, a pure function of time in seconds (same on page and worker, any
  refresh rate). It used to spin and showed its inside (owner, D-033). Chain
  spin, momentum and friction are scaled by `dt/16.7 ms` (were per tick → 2×
  at 120 Hz).
- **Gyroscope on phones** (`src/lib/three/device-tilt.ts`, the fleet template;
  used by `plasma-burst-scene.ts`): the hero burst leans ±12° roll / ±7° pitch
  and drifts; off for robots and reduced motion; iOS permission on first tap
  (D-036).
- **Preloader counter hidden on phones** (`hidden md:block` in
  `src/components/common/preloader.tsx`) — it overlapped (owner, D-036).
- **Brand kit + meta** (D-033): `src/assets/brand/mark.svg` → `public/icon.svg`,
  favicons, manifest, `open-graph.jpg` 1200×630; `twitterHandle` deliberately
  undefined; `src/app/favicon.ico` removed.
- `/privacy-policy`; origin fallback in `src/lib/site.ts` (D-019);
  `CONTACT_ENDPOINT || undefined` in `src/env.ts` (an empty value broke the
  build — found here first, then backfilled on 19 projects).

## Owner decisions

- **D-016** robots get a static page · **D-017/D-026/D-028/D-029** A11y/BP/SEO
  100 everywhere, perf ≥ 90 desktop + mobile · **D-031** scroll ideal target.
- **D-022 (2026-09-30)** stride is one of the nine `ready` projects for pass 1.
- **D-029 (2026-10-03)** darker blue cards `#2b72e2` applied by the
  coordinator; listed for the owner to see.
- **D-032 (2026-10-06)** marked optimized with `--accept-scroll` (mobile
  scroll smooth, not ideal).
- **2026-10-06** owner asked that his uncommitted working tree be committed
  (`ef576f0`: `mirror-hall-scene.ts`, `mirror-hall.tsx`, `use-swap-reveal.ts`,
  `.claude/launch.json`). Earlier passes committed by pathspec around them.
- **D-033 (2026-10-06)** favicon + OpenGraph; the footer heart must float with
  its front to the camera, not rotate.
- **D-036 (2026-10-06)** hide the loader numbers on mobile; gyroscope on the
  hero model, without hurting SEO.
- **D-034 #50** phone frame caps are changed only when the owner notices.

## History by pass

- **Baseline (2026-09-30, hosted, `aefaf16`):** PC 97/96/96/100, mobile
  76/92/96/100 (LCP 4.23 s, TBT 305 ms); robot 97/77; scroll ideal/ideal;
  PSI 60/48.
- **Pass 1 (2026-09-30, `f509d1c`):** banner SSR + WOFF2 → mobile 76 → 93;
  marquee + gaps → A11y 100; `--muted-small` → robot A11y; robot form → robot
  100 across; privacy page + origin → BP 100. After: PC 97/100/100/100, mobile
  93/100/100/100; PSI 99/89. Optimized.
- **Fleet (`ed3d312`, `ac83a82`, 2026-10-02/03):** AI crawlers → robot form;
  empty `loading.tsx` deleted.
- **D-029 (`87c23b4`, 2026-10-03):** robot reveal clocks rest; blue card
  contrast; `HomeView` content default (routes import only from views). Robot
  A11y 96 → 100; people mobile read 89 under load.
- **D-029 wave 9 (`35a9871`, 2026-10-04):** scenes after load → hosted mobile
  89 → 94, PC 97; scroll smooth both → blocked on scroll.
- **D-031 (`ca263ad`, 2026-10-05):** frame caps, warm heart frame, gl-steps,
  phone worker. Interleaved prod vs opt: desktop smooth 0.91 % (67 ms) →
  ideal 0 %; mobile smooth 2.37 → 2.3 %; Lighthouse 96/95.
- **D-032 (2026-10-06):** optimized with accepted scroll.
- **D-033 pass-2 (`1d428a8`):** heart float + fitWidth, dt-scaled chain spin,
  brand kit + meta. Local A/B vs main: within noise; scroll ideal both locally.
- **D-036 pass-3 (`028f6fc`):** gyroscope hero, loader counter hidden on
  phones. Production after merge: PC 97, mobile 96, A11y/BP/SEO 100.

## Tried and reverted / didn't help

- Building the hero burst in its own task (a `setTimeout` after the backdrop):
  mobile 72–79 vs main 82–87 — worse, reverted.
- `skipShaderStatusReads()` alone did not clear the after-load stalls (r143
  still fetches uniforms after linking) — the worker move did.
- Phone worker at 120 fps: scroll 3.16/2.87 % vs 1.28 % at 60 — kept the cap.
- The Works backdrops were not the scroll cause (blur off / removed: freezes
  stayed).
- Delayed draws on phones (warm frame) only added load-time work — desktop only.

## Open items / leads

- Mobile scroll is smooth, not ideal: cold drops at "A fintech platform" in
  the first 2–3 s (the hero intro as the preloader leaves, under the first
  flings). Owner exception (D-032).
- Desktop axe-sweep: "Request a demo" sampled mid-fade in 1 of 3 sweeps (the
  hero cascade's opacity fade; pre-existing on main).
- The OG capture shows a faint dark square behind the plasma burst under
  headless GPU — may not appear on real GPUs; owner to see.
- Not verifiable here: the iOS worker path on a real 120 Hz phone, the real
  iOS gyroscope permission sheet. No `ios-toolbar-probe` run recorded.
- `src/lib/three/mirror-hall-scene.ts` (owner's file) raycasts card meshes on
  pointer move — fleet lead "raycast the shape, not the render mesh"; likely
  cheap, measure first.

## How to measure

From `getlayers-pipeline/optimization-pipeline`:

```sh
node tools/measure.mjs stride --hosted          # Lighthouse + scroll, PC + mobile, real host
node tools/measure.mjs stride --url <url>       # when the tree is dirty (--hosted refuses)
node tools/measure.mjs stride --only scroll --video --devices mobile --runs 1   # then tools/watch.mjs
node tools/fps-probe.mjs <url>                  # scene frame rate on a phone profile (caps, worker)
node tools/ios-toolbar-probe.mjs --url <url> --out <dir>   # iOS URL-bar resize behaviour
node tools/axe-sweep.mjs <url> --device both   # A11y sampled through the entrance
```

Compare A/B interleaved against an `origin/main` build — single local runs
are noisy here (mobile LCP is bimodal locally; production LCP ~1.25 s).
