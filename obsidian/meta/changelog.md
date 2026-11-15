---
tags: [meta, changelog]
updated: 2026-10-06
---

# Changelog

Chronological log of notable changes to **this project**. Newest first.
Human-curated — not a mirror of `git log`.

Log a change here when it would surprise someone returning in six months: a new
dependency, a new route or section, a convention bent, a bug whose cause is worth
remembering. Routine commits do not need an entry.

For *why* the conventions are what they are, see [[decisions-log]].

---

## 2026-11-15 — Owner change doc applied (branch `content/thinking-christian`)

Applied the owner's change table section by section. Map and new components:
[[home-sections]]; decision: [[decisions-log]] ADR-0033.

- Nav: five items with a Topics drop-down (`TopicsMenu`), no status pill,
  "THE FRAMEWORK" CTA; wordmark hidden at 768 and below (logo mark only).
- Hero: "THINKING CHRISTIAN" chip (0.219em tracking), Playfair semibold
  headline with "conviction" in italic orange, caps CTAs, note removed; the
  product window is replaced by the Digital Discernment cover (`HeroBook`).
  Playfair now loads 500/600, roman + italic. New tokens `--tracking-eyebrow`.
- Topic tiles are links to the six topic pages (Literature has no link yet).
- "Content service" twice: Patterns (head only) and the Framework (rows
  01–04 with "Explore the Framework" links); new `Story` section between them.
- Statement: new copy; the tick ruler is now a straight line with seven words.
- Body Building head; cards, Listen/Watch/Read and footer left as they were.

Placeholders until the owner sends files: logo, book cover, portrait,
Framework row images. Checked at 1440 / 1024 / 768 / 390; verify 0 FAIL,
lint clean, build green.

---

## 2026-11-14 — Thinking Christian content (work in progress, branch `content/thinking-christian`)

Homepage copy from thinkingchristian.org applied to the existing sections;
brand renamed throughout (nav, footer, `site.ts`, manifest). Decision and
section mapping: [[decisions-log]] ADR-0032.

- Removed sections with no real content: Signals, Proof, the pricing run meter
  (+ `run-meter`, `price-roll`, `swap-text`); their stream waypoints dropped.
- Pricing cards → Listen / Watch / Read. Hero copy column now flows
  (`--hero-copy-extra` pushes the window down at 768 / 390).
- Footer signup form (it collected nothing) → `ContactLink` mailto row.
- `LiveRuns` accepts fixed row labels; `LaneBar` shows non-numeric shares as
  written; static lists keyed by index.

**Known layout issues, not yet fixed:** hero copy runs under the window's first
node at 1440; approval-card message wraps onto its fields and its two buttons
overlap; chart caption + average collide; Scale head wraps onto the cards;
footer Amazon disclosure overlaps the link columns. 1024 / 768 / 390 not yet
checked.

---

## 2026-11-14 — Light re-theme: brand palette and typefaces

The site moves from dark-on-lime to the owner's light brand sheet — paper
`#E4E2DD`, white, ink `#1E1E1E`, stone `#ABA8A3`, orange `#DB4A2B` — with
**Playfair Display Medium** titles, **Cormorant Garamond** subtitles and accent
words, and **Public Sans** body copy. Decision and trade-offs: [[decisions-log]]
ADR-0031. Palette, derived contrast shades and font roles: [[design-system]].

- `globals.css` Tier 1 rebuilt around the brand colours plus five derived
  contrast shades; every Tier 2 role remapped. No class strings changed for colour.
- All ten `src/style/sections/*.css` files re-themed (~140 literals) by rule,
  then hand-tuned; misleading primitive names renamed to match their values.
- 70 SVGs and 11 glow PNGs in `public/assets` recoloured; avatar photos untouched.
  Favicons, app icons, `icon.svg`, `manifest.json`, `browserconfig.xml` and
  `open-graph.png` re-made in the new palette.
- The particle stream prints as ink on paper: canvas `invert` +
  `mix-blend-multiply`, complemented colour roles, brightness/bloom tuned down.
- Signals heatmap mock data moved to stone with the load folded into alpha.
- New `text-subtitle` (22 px) for the Cormorant hero subtitle.

Not re-measured yet: performance (the stream canvas gained a CSS filter — see
[[optimization-history]]) and a full axe contrast sweep through the entrances.

---

## 2026-11-14 — Next 16.4.6, clean audit, stricter lint, contact route and cookie fixes

- **Security.** `next` / `eslint-config-next` 16.3.1 → 16.4.6 (critical RCE via
  SVG in Image Optimization, SSRF, cache poisoning and others). `zod` → `^4.6.6`
  (memory-exhaustion advisory). `resolutions` force patched `source-map-js` and
  `baseline-browser-mapping` (transitive via `next`). `yarn audit --groups
  dependencies`: 0 vulnerabilities. See [[tech-stack]].
- **Lint.** `no-explicit-any`, `ban-ts-comment`, `no-unused-vars` back on for
  app code; the protected engine is exempt; `set-state-in-effect` is a warning.
  `coords.ts` lost its `@ts-nocheck` (typed), dead `ROW_STEP` and value-only
  `FACES` removed. ADR-0030.
- **`/api/contact`.** With no `CONTACT_ENDPOINT` in production it now returns
  `503 not_configured` instead of `{ received: true }` — previously every lead
  was silently dropped (and the log line stripped by `removeConsole`). Dev logs
  the message length only, no personal data.
- **Cookie preferences toggle.** The knob travelled a fixed `20px` inside a
  rem-sized track, so between design frames it stopped short (≈6.6 px at
  1920 wide). Travel is now `1.25rem`; measured insets are equal at 390 / 768 /
  1100 / 1440 / 1920. Hard-coded px in the banner and modal moved to the spacing
  scale, and the row corner to a token (`--raw-radius-10` → `--consent-row-corner`
  → `rounded-consent-row`).
- **Kit.** `verify.sh` accepts the Tailwind v4 `duration-(--token)` shorthand.

---

## 2026-11-14 — AI Design Vault kit merged in and adapted to this project

The framework-neutral AI Design Vault kit (`textura-agency/ai-design-vault`) was
merged over this project's own harness and fitted with `/adapt`.
`.claude/stack.json` now records the real paths, bindings and commands
([[stack-profile]]). New: `/adapt`, `/motion`, `/data`, `detect-stack.sh`, the
`stack-adapt` / `motion-system` / generic CMS-DB-auth skills, and hook scripts
under `.claude/scripts/hooks/`. Kept from the project: the Payload/Supabase
skills and rules and `/db`. This vault's notes won every overlap with the kit's.
The path-scoped rules in `.claude/rules/` were narrowed to `src/` paths.
Dependencies are unchanged — installed from the existing `yarn.lock`. Baseline
after merge: `verify.sh` 0 FAIL / 6 WARN, `yarn lint` clean, `yarn build` green.
Decision record: [[decisions-log]] ADR-0029.

---

## 2026-10-06 — owner review 3 (pipeline D-037): the stream draws every frame on phones and keeps its size through iOS's URL bar

Owner: "when u scroll on mobile background scene feels very little fps, it also
changes it height when u change scroll direction on IOS".

**Low fps — a phone frame cap.** `ParticleStream` subscribed to the ticker with
`FRAME_GAP.phone = 20` ms: a `t - last <= 20` throttle draws every 2nd frame at
60 Hz (30 fps) and every 3rd at 120 Hz (40 fps). Removed (`NO_GAP`): the stream
now draws on every display frame everywhere; the phone already pays with the
low tier (DPR 1.2, 45 % of the particles, 60 % of the strands, half-size bloom).
Motion is time-based (`now / 1000`, dt-damped parallax), so its speed is
unchanged. `tools/fps-probe.mjs` (390×844, 4× CPU, 120 Hz panel), main → this:
at rest 40.0 → 120.0 fps; touch-scrolling 34.4–34.7 → 79.5–82.8 fps (= the
page's rAF rate while scrolling, 84 → 80).

**Height change — the canvas followed the viewport height.** The canvas was
`h-lvh`, and `StreamScene` maps document px to the screen through the canvas
height (`uView.y`, `uPx = unit / (height / 2)`), so any height change rescaled
and re-placed the whole stream (and `setSize` reallocated the buffer). The
canvas now takes `utils/stable-viewport.ts` (the pipeline's stable-viewport
template): `lvh` at first paint, then a CSS-px height measured once and, on a
touch device, re-measured only when the width changes (rotation); the loop
also re-sizes when that locked height settles after a rotation. The box is px,
never rem, so the phones' root-font scaling (D-036) does not reach it. Desktop
windows still follow every resize. `tools/ios-toolbar-probe.mjs` (heights
844 → 760 → 844 → 760 → 844 → 700 → 844, scoped to the stream canvas): main
FAIL (buffer 468×1012 → 468×912/840 and 4 attribute writes per step, the stream
visibly rescaled) → PASS (0 writes, box unchanged, rotation re-sizes).

Phone scroll test (×2 each arm, interleaved): cold 2.41 / 2.57 % dropped vs
main 2.35 / 2.80 %, warm 0.22 / 0.50 % vs 0.60 / 0.62 % — unchanged while the
stream draws 2–3× the frames. Lighthouse local: mobile 87 (main 86), desktop
97 (97), A11y/BP/SEO 100. `resize-check.mjs`: every scenario lands as a fresh
load.

Files: `src/views/home/stream/particle-stream.tsx`, new
`src/utils/stable-viewport.ts`.

---

## 2026-10-06 — owner review 2 (pipeline D-036): a 16 px page edge on phones; header and menu match

**"On mobile make paddings left and right 1rem — now a bit too much; same in the
header; paddings inside the menu and the header should match."** The 390 frame
is Figma-exact absolute layout (content 350 wide at a 20 inset), and its rem was
capped at 16 px above 390 — so the edge was 20 px at 390 and 40 px at 430.
- `globals.css`: at ≤ 580 px the root font-size puts the frame's **content**
  between 16 px edges — `min(calc((100vw − 32px) / 21.875), 18.194286px)`
  (21.875 = 350 / 16) — the frame renders 2.3 % larger at 390 and grows with the
  phone up to 430, then centres. Desktop/tablet frames untouched.
- `@utility mx-page` (centres the column even when it is wider than its
  parent, where `mx-auto` would pin it left) on `<main>` and the header bar.
- `--spacing-page-edge` (inset + half the viewport beyond the column): the
  full-screen menu's bar, links and footer row use `px-page-edge`, so the menu's
  logo and ✕ sit exactly where the header's logo and burger are.
Measured: logo/burger/h1 edges 16.0 px at 360, 390, 430 (header and open menu
identical); 600 px and 1440 px unchanged (25 / 80 px); scrollWidth = innerWidth
at 360–430.

## 2026-10-06 — owner review (pipeline D-033): the loader always opens on the hero, a quiet first scroll on PC, a full-screen phone menu

Owner: "during loader for some reason website always scrolls a few sections
down and appears down, on pc the first scroll there are so many freezes, it
should be smooth; on mobile make mobile menu proper full screen".

- **The loader landed sections down.** `html[data-preload]` set
  `overflow: hidden`, which stops the browser but not Lenis — it scrolls the
  window itself. A wheel/trackpad flick under the stage ran the page ~1,640 px
  down (measured) into the room `<main>` takes while it waits off-screen, and
  the fold uncovered that. A reload after scrolling also restored ~500 px
  before hydration. Now: `history.scrollRestoration = "manual"` in the head
  script (home, preloader runs); `ScrollLayout` stops Lenis while
  `data-preload` **or** `data-preload-closing` is set (the isEnableScroll
  effect no longer restarts it under the stage) and, when the stage is gone,
  puts the page at 0 before scrolling comes back; `preloader.css` keeps
  `overflow: hidden` through the fold, so the fold always uncovers the hero.
  Verified (probe: scrollY every frame): wheel during the loader 1,643 → 0,
  reload after scrolling 504 → 0 (desktop) / 2,817 → 0 (390 touch), touch
  swipe during the loader → 0; scrolling works the moment the fold is done.
- **PC first scroll.** Profiled an owner-like scroll (wheel from the moment the
  loader lets go): the particle stream was built after the fold — exactly on
  the first scroll (scene construction 54–244 ms, the first draw's uniform
  reads 58 ms, `compileAsync` polling 43–218 ms) — and the first wheel opened
  every `HydrateNear` gate within 1.5 viewports at once (25–60 ms each).
  `particle-stream.tsx`: on a desktop (full tier, fine pointer) the stream
  builds from `load`, under the loader, in short steps (an extra yield before
  sizing; `prewarm` draws the stream's programs and the composer in separate
  tasks); it still renders/reveals only once the loader is gone. Phones keep
  the late build. `hydrate-near.tsx`: on a desktop behind the preloader the
  blocks hydrate one per idle callback in page order from load; phones, the
  robot form and reduced motion keep the approach gate. Effect: no
  script-attributed long frame in the first seconds of scroll (was the stream
  build + compile); scroll test desktop, interleaved with origin/main
  (2 rounds × 2 runs): fix 0 / 1.08 / 0 / 0.93 % dropped, max ≤ 26 ms, no frame
  > 50 ms (ideal in the 2nd round); main 0.38 / 2.66 (one 225 ms freeze) /
  0.19 / 0 %. Mobile unchanged within noise (both smooth/janky 1.6–4.9 %).
  Final tree (`runs/relay/2026-10-06T03-53-02-check.json`): desktop **ideal**
  (cold 0.19 % / max 25 ms), mobile smooth (1.52 %, max 60 ms); Lighthouse
  (`…03-10-47-check.json`) mobile 91 / desktop 97, A11y/BP/SEO 100.
- **Full-screen phone menu.** `nav-menu.tsx` rewritten: a page-black sheet
  portalled to `<body>` (`z-90`, over the stream and the cookie banner), opening
  as a circle out of the menu button (clip-path on the page spring, exit on a
  quicker one), its own bar with the brand and the button morphing to a cross
  in the same place, the four links in large type (`--type-menu-link`,
  `clamp(2.5rem, 11vw, 3.5rem)`) rising out of a mask 50 ms apart with their
  mono code and note, the status pill and the "Start free" CTA at the bottom.
  Scroll locked through the scroll store, Escape closes, focus moves to the
  close button, is trapped, and returns to the toggle; a link closes and glides
  Lenis to its section; reduced motion = a fade; unmounted when closed. The old
  card's radius tokens (`--raw-radius-nav-menu*`) removed; `Nav` passes
  brand/status/cta.

Files: `app/layout.tsx`, `layouts/scroll-layout.tsx`,
`style/sections/preloader.css`, `views/home/preloader.tsx` (comment),
`components/common/hydrate-near.tsx`, `views/home/stream/particle-stream.tsx`,
`views/home/stream/stream-scene.ts`, `views/home/sections/nav/{index,nav-menu}.tsx`,
`app/globals.css`.

---

## 2026-10-05 — `LogoOpen` writes its styles only when they change (pipeline D-031, round f) — uncommitted

Blamed by: the pipeline's Fleet Fixes list ("CSS custom properties written per
frame"): `views/home/transitions/logo-open.tsx` ran on every scroll event of the
whole page and, every time, rewrote the plate's `--pop` / `--grow` / `--shift` /
`--flying`, its `clip-path` and the Scale runtime tile's `opacity` — a restyle
of the Statement subtree on every scrolled frame, screens away from it too.

- `src/views/home/transitions/logo-open.tsx`: each write goes through a
  last-value cache (`changed()` / `set()` / `setStyle()`), `f.hidden` only on a
  change. Same values, same order — the transition is untouched (screenshots of
  the iris at four scroll positions, main vs this tree: identical).
- Measured with the chart change below (local, interleaved vs an origin/main
  build, load 5–10): **mobile** 2 rounds × 3 runs — cold janky/smooth both
  builds (this tree 2.68 % / 3.99 % dropped, main 3.67 % / 4.23 %), the frame at
  "Most of a process is glue." 65–67 ms 3/3 (main 91–92 ms 3/3), **warm ideal
  both rounds** (0.32 % / 1.0 %; main smooth 1.08 % / 1.41 %); **desktop** ideal
  (0.38 %, nothing over 50 ms; main smooth, 74 ms 1/3).
- Lighthouse (local, 3 runs, vs main): mobile 87 vs 86 (local runs ~10 under
  the host), desktop 98 vs 97, A11y/BP/SEO 100.
- **Not at the bar — mobile cold.** Ruled out by injected CSS on this build
  (3 runs each): #proof's reveals at rest, the slab's backdrop blur off,
  `content-visibility` visible (worse: 184 ms), the stat visuals hidden, the
  two blooms hidden — #proof's cold drops (8–13 %) stayed every time. A trace
  of the cold pass (4× CPU, no network throttle: 2.1–3.6 % dropped) names two
  other costs: React's scheduler (`performWorkUntilDeadline`) 38–60 ms at
  y≈317 / 988 / 2740 / 4130 — the sections hydrating on approach
  (`HydrateNear`, 150 % look-ahead) — and the particle stream's build at the
  first scroll (`GetProgramiv` 72 ms, `GetShaderiv` 34 ms, in a timer). Leads:
  smaller hydration units per section; the stream's composer passes prewarmed
  or the stream in a worker (stride's `scene-host`, D-031 f).

## 2026-10-05 — The bar chart's cubes and caps inlined as markup (pipeline D-031) — uncommitted

Blamed by: the hosted record's reproducible phone frame at "Most of a process
is glue." (76 ms gpu/raster, 5/5) and the 2026-10-03 investigation below: the
chart's thirteen lazy SVG `<img>`s (six cube bodies, six caps, the glow)
arrived mid-scroll and each built an SVG document in the frame that revealed
the card.

- `src/views/home/sections/product/chart-shapes.tsx` (new): `ChartCube`,
  `ChartCap`, `ChartCapGlow` — the Figma group exports drawn inline, path for
  path (the cube body is parameterised by its height; gradient/filter ids from
  `useId`). `chart-card.tsx` renders them instead of `next/image`. The colours
  are new section tokens in `src/style/sections/product.css`
  (`--raw-product-color-cube-*`, `--raw-product-color-cap` → `--product-cube-*`,
  `--product-cap-dim`, `--product-cap-accent` = the lime accent). The files in
  `public/assets/product/product-cube-*.svg`, `product-cap-*.svg` are now
  unreferenced (left in place).
- Look: screenshots of the chart at rest, main vs this tree, PSNR 54.6 dB
  (desktop) / 54.4 dB (phone) — identical to the eye.
- Measured (local, interleaved vs an origin/main build, mobile, 2 rounds × 3
  runs, load 9–29): the frame at "Most of a process is glue." 108 ms 3/3 and
  117 ms 3/3 → 66 ms 1/3 and 67 ms 2/3; requests during the cold pass 43 → 30.
  The page stays mobile janky locally on both builds (other frames: #proof
  67–100 ms gpu, `article.flex` 57–74 ms) — not at the bar. Lighthouse (3 runs):
  mobile 88 → 92, desktop 96 → 95 (noise), A11y/BP/SEO 100.
- Leads left: #proof's gpu frames; the GPU present waits around the frosted
  slab on a 3× phone.

## 2026-10-03 — Scroll pass: the phone frame at "Most of a process is glue." (investigated; no code change)

Blamed by: the hosted record — phone scroll smooth, one **76 ms gpu/raster
frame 5/5** when the Product head reaches mid-screen (63 % dropped over
0.5 s). Reproduced locally: 84–108 ms, every run (y≈960–1040 on a 390 × 844 phone).

- **What it is not** (the pipeline's scroll test with injected CSS, 2 runs
  each, same build): the head's own reveals at rest (blur/mask/opacity off:
  still 75–117 ms); the head's reveals pre-promoted (`will-change`: 60 ms);
  the frosted slab's `backdrop-filter` off (72–102 ms); `content-visibility`
  off on `#product` (108 ms); the Product block's `ScrollBlur` wrapper at
  rest (108 ms); the Integrations wrapper pinned to opacity 1 (83 ms); every
  canvas hidden (91 ms); **the whole `#product` hidden** (93 ms). So the
  section label only names what sits mid-screen — the cost is not in that header.
- **What a trace shows** (phone emulation, 4× CPU, through y≈1500): no single
  task over 25 ms; the long frames are the GPU process blocked in
  `SwapBuffers` / `WaitForCommandsToBeScheduled` (~25–50 ms — fill), a
  `HydrateNear` block hydrating (~66 ms React task), and **lazy SVG images
  arriving mid-scroll**: each SVG `<img>` builds an isolated SVG document on
  the main thread when its bytes land (`IsolatedSVGDocumentHost`, up to
  ~20 ms). The Product chart's five `product-cube-*.svg` landed together
  right before the freeze in every run; the phone's cold pass fetched 43
  images in all.
- **Tried, measured, reverted — a `WarmImages` client leaf** switching the
  page's `loading="lazy"` images to eager, 3 per idle callback, nearest first:
  - from `load`: mid-scroll fetches 43 → 0 and the frame 108 → 66 ms, but
    Lighthouse's window stretched with the network and took in the particle
    stream's build (mobile TBT 70 → 149 ms), and it audited the footer glow
    images it never loads otherwise (BP 100 → 96, `image-aspect-ratio`:
    `footer-aurora-blue.png` 1420 × 800 drawn 503 × 800 on phones — a real,
    pre-existing stretch that only loads below the fold);
  - from the first gesture (Lighthouse flat: 97–98 / 88–89, BP 100): the frame
    84 → 59 ms (3/3 vs 3/3, interleaved) but cold drops 1.96 → 3.23 %, warm
    0.30 → 0.86 % — the images now decode during the first flings. Not a
    measured win for the verdict, so reverted (brief: revert what didn't
    measurably help).
- **Leads:** (1) the five cubes and the chart caps inlined as SVG markup or a
  single sprite (no per-image SVG document — ~25 ms of the frame); (2) the
  remaining GPU swap wait — the nav's and the integration tiles' backdrop
  blurs plus the slab composite at DPR 3 (not removable one at a time above);
  (3) the `footer-aurora-blue.png` stretch on phones (owner's call — it is the
  design as shipped).

## 2026-10-03 — D-028 round: mobile LCP (pipeline agent, local; not committed)

- **Consent banner server-rendered** (`tools/scaffold-consent.mjs`): no longer
  `dynamic({ ssr: false })`; it paints with the page under the preloader
  (z-50 < the preloader's z-60, so nothing visible changes), returning
  visitors hide it before paint (`consent-flag.ts`, `html[data-consent]`).
- **AI crawlers get the robot form**: `BOT_UA` (`src/utils/bot-ua.ts`) now
  lists GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Claude-User,
  Claude-SearchBot, anthropic-ai, PerplexityBot, Perplexity-User, CCBot,
  Bytespider, Amazonbot, meta-externalagent, cohere-ai, MistralAI-User, YouBot,
  Diffbot — like the rest of the fleet. The root layout's preloader head script
  now builds its regex from `BOT_UA.source` (it had its own copy of the list).
- **Page served at rest under the preloader**: `<main>` used to wait
  `translateY(200vh)` from the first paint, so the LCP (the backdrop dot field)
  was first painted at the fold, ~4 s in on a phone. Now the page paints once
  in place under the opaque black stage and is sent off-screen by
  `html[data-preload-away]` (`preloader.css`) — set by the head script once a
  `largest-contentful-paint` entry for an image in `<main>` is reported, or by
  the Preloader's layout effect at hydration at the latest, before any
  entrance's effect can see the page. The fold and every entrance are
  unchanged (frame-by-frame compare, 1440 + 390).
- **Dot field as art direction** (`sections/backdrop`): one `<picture>` with a
  `(max-width: 900px)` source instead of two `priority` images, so a phone no
  longer downloads the 1440 field (24 KB) it hides.
- Tried and reverted: `experimental.inlineCss` (no gain locally; it moved the
  script requests earlier).

Measured locally (interleaved A/B, `measure.mjs --url`, mobile, 1 run each):
base 81–82 (LCP 4.5–4.6 s) → 84–86 (LCP 3.9–4.2 s, one run 94 / 2.4 s); desktop
96–97 → 97–98. TBT unchanged (~70 ms). Locally the scripts arrive before the
first paint, so Lighthouse's simulation still bills them to the LCP; the
hosted record decides.

---

## Baseline — built from `next16-claude-starter` v0.1.0

What the starter ships, so the first project entry has something to diff against:

| Area | What is there |
|------|---------------|
| Framework | Next.js 16 App Router · React 19 · TypeScript · Yarn · Node ≥ 20.19 |
| Styling | Tailwind v4, CSS-only config, three-tier design tokens ([[design-system]]) |
| Motion | Vendored spring engine + `spring-text-engine`, shared rAF ticker, reduced-motion ([[animation-system]]) |
| Layout | Adaptive scaling grid — root font-size tracks the viewport ([[design-system]]) |
| Scroll | Lenis smooth scroll + Zustand scroll store ([[smooth-scroll]]) |
| Server | `app/api` route handlers, zod-validated env, `{ data }`/`{ error }` envelope ([[api-architecture]]) |
| SEO | Metadata generator, `robots.ts`, `sitemap.ts`, JSON-LD ([[seo-metadata]]) |
| Agent harness | 8 commands, 7 path-scoped rules, 11 skills, 4 subagents, `verify.sh` ([[agent-harness]]) |
| Not included | CMS, database, auth, payments, i18n, tests — added per project ([[backend/README]]) |

The home view (`src/views/home.tsx`, route `/`) ships empty on purpose — start
there ([[new-page]]).

<!-- Log this project's changes below, newest first, under a `## YYYY-MM-DD` heading. -->

## 2026-09-26

**Performance pass: a scrolled frame reads no layout, offscreen sections are
skipped, the phone tier gets a budget.** Measured on the production build with
a Playwright scroll harness (1440×900 desktop; 390×844 iPhone emulation with
4× CPU throttling), scrolling the whole page in gestures:

| | before | after |
|---|---|---|
| mobile scroll fps · p95 · p99 frame | 46–54 · 33 ms · 50 ms | 59.5 · 16.8 ms · 16.8 ms |
| mobile frames over 33 ms / worst | 77–85 / 1066 ms | 6 / 33 ms |
| mobile GPU time over the scroll (trace) | 3.9 s | 0.9 s |
| desktop long tasks before first scroll | 665 ms (worst 609) | 0 |
| composited layers desktop / mobile | 145 / 128 | 90 / 57 |
| IntersectionObservers | 452 | ~30 |
| Lighthouse mobile / desktop performance | 59 / 95 | 54–58 / 86–95 (see below) |

The Lighthouse line needs reading with care: before, a lab run saw the
preloader (a black stage, a lime ring, the cookie text as LCP) — not the page.
Now a crawler or lab UA opens the page itself (ADR-0028), so Lighthouse
measures the real hero for the first time: mobile TBT 1250 → 820–1120 ms
(hydration, now split per block), but its *simulated* LCP is 5.4 s against an
observed 2.4 s in its own trace — the 768 dot-field backdrop, loaded at 72 ms,
is first reported painted at 2.5 s, after hydration; the same page in the
Playwright harness (Lighthouse UA, 4× CPU) reports it at 0.35 s, 1.3 s on
slow 4G. Not resolved in this pass. Desktop swings 86–95 between identical
runs on this machine. Field LCP for a real visitor is the preloader's first
frame either way.

What changed, in the order of effect:
- **Scroll-driven code reads no layout per frame** (ADR-0027). `ScrollBlur`
  no longer wraps `SpringTrigger` (whose loop read `getBoundingClientRect`
  every frame for every block on screen — the single largest JS cost, 825 ms
  of a 12 s scroll); it measures its wrapper once, again on layout change, and
  derives progress from `readScrollY()` (`src/lib/scroll-y.ts` — Lenis's own
  number, never `window.scrollY`, which is a layout read). The stream's ticker
  reads the same. `LogoOpen` runs in the scroll event itself (layout is clean
  there), all reads before all writes, its per-resize measurements cached.
  `HeroTilt` writes the pointer straight into its springs instead of React
  state. `useSeen` uses one shared observer + one scroll listener for every
  reveal; `useProofSeen` shares its bottom-of-page listener.
- **Offscreen sections are skipped** (ADR-0028): `[content-visibility:auto]`
  on every section root below the hero (all carry explicit heights, so the
  page height and the stream's anchors are unchanged). Their style, layout,
  paint, layers and pending-reveal 3D transforms cost nothing until they are
  near.
- **Glass only where it shows** (ADR-0028): the cards on the Product → Proof
  frosted slab (`feature-row`, `scale/card`, `signals/widget`) drop their own
  `backdrop-blur-card` — the slab already frosts the stream under them, the
  second blur was invisible, and each was a compositor layer re-blurred every
  frame the stream moved. Pricing cards, the hero window and chips, the
  Integrations tiles and the nav keep theirs. **Visual change to review:**
  those cards are a touch less soft on the inside; screenshots at nine scroll
  offsets diff under 2% of pixels against the previous build.
- **Phone tier budget for the stream** (ADR-0028, skill §5–§6, §11, §13): on a
  coarse pointer the scene renders every other frame (`FRAME_GAP`), the low
  tier's bloom mip chain starts at half the frame (`BLOOM_SCALE`), the pointer
  listener is never attached without a fine pointer, and the canvas is `h-lvh`
  with resizes ignored unless the canvas size or tier actually changed — a
  phone's URL bar no longer re-allocates the framebuffer.
- **Scene built in steps, compiled in parallel** (skill §3): `prewarm()` is
  async — `renderer.compileAsync` (KHR_parallel_shader_compile) for the two
  stream programs and, through a throwaway scene of quads, every pass
  material (bloom high-pass, blurs, composite, blend; output; copy), then the
  first frame. `bakeCurve`'s sliding min/mean no longer allocates a window
  per sample. Chunk load, geometry, compile and first frame each hand the
  main thread back in between. The 609 ms task during the preloader is gone.
- **Each block below the hero hydrates in its own task**: a `<Suspense>`
  per block in `views/home/index.tsx` (no fallback, the HTML is complete),
  so the first screen hydrates first and the rest yields between blocks
  instead of one ~1 s hydration task on a throttled phone (ADR-0028).
- **No scene, no preloader for a crawler or a lab run** (skill §1,
  ADR-0028): `src/utils/bot-ua.ts` (the `isBot()` list, read client-side so
  the route stays static) gates the `three` import; the root layout's head
  script skips `data-preload` for the same list. Lighthouse and Googlebot
  see the page at once; content is identical.

**SEO / a11y / assets.** Hero bloom is a 1400×1020 WebP (66 KB, from a
2800×2040 160 KB PNG) served through `next/image` with per-frame `sizes` —
the PNG was `unoptimized`, flagged for aspect ratio, format and size. The
first-screen images (the three backdrop layers, the hero bloom) carry
`fetchPriority="high"` and `decoding="sync"`: with the preloader gone for a
lab run, the 768 dot field is the LCP element, and async-decoded it was not
painted until hydration had freed the main thread (observed LCP 2.4 s on a
localhost lab run, from a 0.1 s FCP). `--raw-color-neutral-500` (color/text-dim) lifted from
`#6e7378` to `#747980` — 4.23:1 → 4.62:1 on the page black (the pricing
labels failed contrast). The tier card's hidden cross-fade look is `inert` as
well as `aria-hidden` (its link was focusable). The cookie banner's
privacy-policy `Link` no longer prefetches a route that does not exist
(console 404 on every load). **Open:** `/privacy-policy` still has no page.

**Scroll no longer "sticks" past the footer.** Lenis measures the page's
scroll limit itself and re-measures only when the `<html>` box resizes. The
preloader holds `<main>` off-screen (`html[data-preload] main`, two viewports
down), which adds overflow without changing any element's box — so Lenis kept
a limit ~1800 px past the real end: wheeling on past the footer pushed its
target into that surplus (nothing moved), and the first scrolls back up were
spent coming out of it. `ScrollController` now calls `lenis.resize()` whenever
`data-preload` / `data-preload-closing` change (a `MutationObserver` on
`<html>`) and once fonts have settled. Verified with a wheel-driven repro:
limit 9077 → 7277 (the real value) after the preloader, target clamped at
7277 under further wheel input.

**Cursor: a lime ring that glides after the native cursor.** Client call. The
system cursor is never hidden any more (`cursor: none` rule removed; no
`has-cursor` class); the 8 px dot is a 28 px ring on a soft spring
(`FOLLOW` 210/24) that trails the pointer, opens to 44 px over anything
interactive, squeezes on press and still steps aside over
`[data-cursor="none"]`. Position goes straight into the spring from the event
— a move never re-renders.

**Preloader close is one continuous motion; the stream waits for it.** The
close used to be a spring fold (slow tail) handing over at `TAKE_OFF` to a
separate timed shrink (slow start) — a visible pause and a jolt. It is now a
single timed value `c` (`CLOSE` 1000ms `easeInOutQuad`): the mask's larger
half-extent shrinks at one eased speed from half the screen to zero, so it
closes width-first into a square, keeps going through the tile and cuts the
dark tile down with it; its corner rounds up as it squares. `foldBox` is no
longer used by the preloader, the `fly` phase is gone, and the flood hands
over at 97%. The preloader now marks its close with `html[data-preload-closing]`;
the particle stream (`usePreloaderGone`) neither renders nor starts its
entrance until both preload flags are gone — its bloom was sharing the GPU
with the fold.

**Hero window without an entrance; preloader mask cuts the tile; no tuning
panel.** The product window's wrapper is no longer a fading `Reveal` and
`FrameDraw` (the stroke draw-in) is removed: an opacity fade on the wrapper
suppressed the window's glass (`backdrop-filter`) until it ended, so the
frosted window is now there the moment the preloader lifts; only its contents
play the load sequence. Preloader close: instead of scaling, the lime mask
keeps folding past the tile — its rounded square shrinks from the take-off
size to zero (`FLY` 480ms `easeInOutCubic`), first thinning the lime rim, then
clipping the dark tile down with it. The stream's on-site tuning panel
(`stream/stream-panel.tsx`) is removed with `StreamTune` / `TUNE_DEFAULTS` /
`tune()`; the look lives only in `CONFIG` (ADR-0025 superseded).

**Preloader tile: stays black, shrinks fast, always leaves.** After the fold
the tile no longer cross-fades back to the lime logo — it stays the dark
Statement mark — and scales to zero over 320ms (`FLY`: duration +
`easeOutCubic`, fast from the first frame; the fold spring is a touch brisker,
`TAKE_OFF` .03). The overlay is now removed on the spring's `onRest` as well:
a spring settling just short of the 0.995 check left a tiny tile stuck on the
page.

**Statement → Scale logo: one logo at a time, no stalls.** The logo's flight
into Scale's runtime tile left while the plate was still folding, so the
folded plate (with its own Mark) and the flying copy showed as two logos. The
flight (`LogoOpen`) now starts only when the fold is complete and runs over a
fixed stretch of scroll (`FLIGHT` 300 design px) instead of "until the tile is
mid-screen", which could jump. The fold's two stages run linearly
(`fold(..., curve)`, new optional argument) under the one overall ease — the
per-stage ease stalled at the square. The pinned hold is 240 (was 420; wrapper
height `+15rem`), and the overlay logo never scales above 1, so it sits
exactly over the plate's own Mark.

**Earlier entrances, stronger hero tilt, preloader tile shrinks, no blur.**
Reveal timing: `TEXT_MARGIN` is now `0 0 5% 0` (starts just before an element
scrolls in, was −8%) and `VIEW_MARGIN` `−12%` (was −35%). The footer timeline
is compressed (CUE steps roughly halved, `BOTTOM_AFTER` 1900 → 350ms,
`LOOP_AFTER` 2240 → 1200, `BOTTOM_MARGIN` −15% → +5%) — its links used to
wait almost two seconds on screen. `ScrollBlur` no longer blurs at all
(enter fades from .6 and drifts; leave fades), and Pricing is no longer
wrapped in it. Hero cursor tilt: `TILT.deg` 3 → 12, parallax depths
4/8/12 → 10/22/34. The float shadows behind the hero window's tool buttons,
zoom and wait chips are removed. The backdrop's lime base line and the glow
above it are removed, as are the Integrations blooms (clipped at the section's
bottom they drew a hard glowing edge). Preloader: after the fold the tile
scales to zero about its centre instead of flying into the nav logo, which
stays visible throughout (`data-preload-target` removed).

**Stream polish; no leave-blur; Pricing cards no longer pop in.** Filament
pulses are now placed per fragment from the arc length (`vA`) with a gaussian
shape (`pulseSharp`) and a CPU-wrapped shift (`uPulseShift`) — per vertex they
hopped from vertex to vertex. More blue: `altShare` .45 of the motes,
`altStrands` .32 of the strands. The spine is sampled twice as densely
(`SAMPLES` 2048) and strands have 1400 segments; the turn-held width uses a
soft min (`turnHold` .5) — the hard `min` kinked the outer strands where it
took over. The whole form sits 200px right at 1440 (`SHIFT` = 200/1440 of the
column, so it scales per frame); the hero swing reaches further left (x ≈ .36
after the shift) and the approach to the tile gap (now between gmail and
webhooks) is one round arc; the Pricing turn is a broad symmetric arc.
`ScrollBlur` `leave` no longer blurs (fade + drift only) — content no longer
goes soft under the header. Pricing's run meter, tier cards and featured
marks are no longer wrapped in `Reveal` — the cards are simply there and only
their contents animate in.

**Wider, fewer bends; side exit; second hue; 1.5× section rhythm.** The
stream's path (`stream/stream-path.ts`) now swings wider — the hero turn sits
further left of the window (x .34 at 1440) — and turns far less often: after
the tile gap, one bend per block pair (left in Product, right across Scale,
left in Proof, right into Pricing), each swinging past the page column's edge
(x −.06 / 1.06). It ends by sweeping back across Pricing and out through the
left edge (x −.45) above the footer, fading before the footer's cards. A
second hue is woven in: `--stream-alt` (`--raw-color-sky-400` #52c8ff) on
`CONFIG.altShare` (32%) of the motes and strands. Sections are spaced 1.5×
the frames' gaps: `h-section-gap` spacers between every block from
Integrations down (`--section-gap`: 72 / 64 / 56 / 48 at 1440 / 1024 / 768 /
390), not in Figma.

**Stream shape, clearer glass, glass cards, instant cursor.** The tile-gap S
folded its strands over each other (a hairpin tighter than the stream's
width): the Integrations waypoints now enter and leave the gap nearly
vertically, and the scene bakes each sample's turn radius (measured over
±6 samples, held to the tightest within ±14, smoothed twice over ±24) into
the spine texture — `widthAt()` keeps the radius under `turnHold` × that, so
no bend can fold it. Stronger squeeze / release: `spread` 8 at the pinches,
`spreadEnds` 190 between, every bend pinches fully, plus a swell travelling
down the stream (`breath` ±35%, 900px wavelength). The Product → Proof slab is
clearer (`--raw-color-ink-glass` .22, frost 12px). Product visuals, Scale
cards, Signals widgets and the Pricing board / tiers are now glass: new
`--card-glass` / `--card-frost` (`bg-card-glass`, `backdrop-blur-card`) —
`--product-card`, `--signals-widget`, `--pricing-card` point at it, Scale's
card gradient is translucent. `CursorDot` follows the pointer with
`immediate: true` (no trailing spring), at the client's request.

**The particle stream runs under the whole page; Product → Proof on glass.**
The stream moved out of the hero into `src/views/home/stream/`
(`particle-stream.tsx`, `stream-scene.ts`, `stream-path.ts`,
`stream-panel.tsx`) and is mounted once in the home view, right after the
backdrop. Its canvas is now fixed and viewport-sized; the stream is laid out
in document coordinates and mapped through `scrollY` in the shaders, so it
scrolls with the page and only the visible stretch is drawn. The scroll
morph (`rest` / `dive`) is gone: `stream-path.ts` holds one path of waypoints
anchored to sections (`x` = share of the page column, `y` = share of the
section — Statement anchors to its sticky layer's wrapper), resolved against
the live layout whenever `<main>` changes size. The hero keeps its drawn
sweep (per frame), then the client's S through the Integrations tile gap, then
one wide bend per block, alternating sides, out under the footer. Pinches now
come from waypoints (`pinch`, spread over `pinchReach`); flow, pulses, filament
waves and the entrance are in px, so the look holds on any page length. Bokeh
and dust ride the spine. Particles 36k / strands of 768 segments on the full
tier. Colour roles moved to page tokens `--stream-*` in `globals.css`; the
hero's `--hero-stream-*`, `--hero-stream-mask` and `--hero-stream-box` are
removed, and `useHeroPointer` is no longer exported (the stream reads the
pointer itself). **Glass slab:** Product, Statement, Scale, Signals and Proof
now sit in one wrapper with a full-bleed frosted layer behind them
(`--glass-slab`, `--glass-slab-edge`, `--glass-slab-frost`). ADR-0026.

**Hero stream — the dive is now the client's S, and the flow never climbs.**
`dive` no longer plunges straight down-left: after the turn left of the window
the tail swings back right, crosses the Integrations tile row through the gap
between two tiles (notion / gmail at 1440) and curls down-left under the
block. The canvas now reaches the Integrations section's bottom edge
(`--hero-stream-box`: 85.375 / 73.375 / 59.625rem + half the hero extra) with
an 8rem bottom fade. Scrolling also carries the flow forward
(`StreamScene.setScroll`, `CONFIG.scrollFlow` = 1.25 px along the curve per px
scrolled, either direction; `uScrollU` / `uScrollPulse`), so particles and
pulses keep running down the screen while the page moves up — before, the
slow time-based flow read as climbing during a scroll.

**Hero stream — smoother, and it dives under Integrations on scroll.** The
client's tuned values are now the CONFIG defaults (bloom 0.68 / 0.57 / 0.07,
size 2.1, brightness 0.79). Each frame's path is two 7-point shapes in
`hero/stream-paths.ts` — `rest` (the drawn sweep, fewer points so the spine
is one smooth curve) and `dive` — and `StreamScene.setBend()` blends between
them: scroll progress (`scrollY` ÷ 70% of the hero's height) is damped in the
render loop (`CONFIG.bendDamp`) and the curve re-bakes only while the blend
moves. Diving, the tail bends left and slides down under the Integrations
tiles; free bokeh fades out with it (`uBend`). The canvas's bottom edge is
now the tiles' bottom edge (`--hero-stream-box`, which adds half of
`--hero-extra` so it tracks the viewport height), and the mask fades the last
4.5rem, so the stream disappears under the cards instead of running into the
Product section. The pinch glow is taken from `rest` and held while diving.
Reduced motion: no loop, the still frame is redrawn on scroll.

**Hero stream — reshaped, flows down, glass window, tuning panel.** The
stream now follows the client's drawn line: in from the top right (through
the nav area), down-left across the window, turning just left of it, out
bottom right toward the camera — particles travel top → bottom. The pinch
glow is no longer a CONFIG number: the scene finds it as the path's leftmost
point when it bakes the curve. The canvas box bleeds well past the frame on
every side (1440: x 380…1900, y −300…1040 in frame px) and fades on all four
edges, so the stream never meets a hard edge on wide viewports. Stream radius,
wobble and drift are now design px (`uPx`), and point size follows the
adaptive grid's rem, so the look holds across boxes and breakpoints.
**Glass:** the product window, its node cards, branch labels and the wait chip
are frosted glass (`--hero-window-surface`, `--hero-node`, `--hero-label`,
`--hero-wait-chip` → translucent fills + `backdrop-blur-hero-window` /
`-card`), so the stream reads through them; the window's gradient stroke
moved to its own masked ring (`--hero-window-ring*`) above the glass.
**Panel:** `hero/stream-panel.tsx` — live sliders for bloom strength /
radius / threshold, particle size and brightness; persisted in
`localStorage`, "copy" yields CONFIG lines. Shown in development and in
production with `?tune`. ADR-0025.

**Hero — lime 3D particle stream behind the product window.** A new three.js
scene (`hero/stream-scene.ts`, authored through GetLayers Scene Lab after
`sea-sparkle`) draws a ribbon of glowing filaments with sparks and bokeh that
pinches under the window's bottom-left corner and rises up its left edge,
with UnrealBloom. `hero/particle-stream.tsx` mounts it: three.js loads on
demand, the scene prewarms, then draws itself in along its curve at
`LOAD.stream` (416 ms) once the hero is seen; it renders through the shared
ticker only while on screen and the tab is visible, follows the tilt pointer
(`useHeroPointer`, newly exported from `hero-tilt.tsx`) with a small camera
parallax, and shows one still frame under reduced motion. Per-frame paths in
`hero/stream-paths.ts` (1440 / 1024 / 768); hidden at 390, where the window
spans the width. Colours come from new `--hero-stream-*` tokens in
`style/sections/hero.css` (main = `--accent`, core = `--accent-soft`), plus
`--hero-stream-mask` (left/bottom fade; every side at 768). New dependency
`three` — see [[tech-stack]]; reasoning in [[decisions-log]] ADR-0024.

## 2026-09-08

**`optimize-3d-scene` skill — resize no longer switched off on touch.** §13 of
the skill (and `patterns.md` §5 / §14) told agents to attach *no* `resize`
listener on the mobile tier, to dodge the iOS URL bar. That also removed the
only path that could react to a breakpoint drag, a rotation or DevTools
emulation being turned off, so a scene loaded as a phone kept its phone
framebuffer, frame budget, parked pointer and hidden desktop passes on a desktop
viewport and rendered skewed. The skill now listens on every tier, ignores
height-only changes on a coarse pointer, and re-reads the tier on a width
change or a pointer-media-query flip, with a `retune()` that re-applies DPR,
budget, visibility, draw range and pointer binding without compiling a program.
§2 and §11 of `SKILL.md` and the [[optimize-3d-scene]] workflow note were
updated to match; §14 gained a tier-switch round-trip check. Reasoning in
[[decisions-log]] ADR-0023. Measured on the project that surfaced it: phone
390×844 / 3 draws ↔ desktop 2160×1350 / 4 draws, program count unchanged.
