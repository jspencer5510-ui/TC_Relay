---
tags: [frontend, components, catalog]
updated: 2026-11-15
---

# Home sections — Thinking Christian page

Order and content of `src/views/home/index.tsx`, per the owner's change doc
(2026-11-14). Decision: [[decisions-log]] ADR-0033. Copy lives in
`src/data/mocks/home/*.ts`; links point at `https://www.thinkingchristian.org`.

| # | Section (`id`) | Component | Content |
|---|---|---|---|
| 01 | Nav | `sections/nav` + `topics-menu.tsx` | Podcast · Topics ▾ · Questions · Articles · About · THE FRAMEWORK |
| 02 | Hero (`hero`) | `sections/hero` + `feature-window.tsx` | eyebrow (plain orange tracked caps, no pill), headline (Playfair semibold, last word italic orange), subhead, two CTAs (stacked at 1024), Featured panel (3 items) |
| 03 | Topics (`integrations`) | `sections/integrations` | six linked topic tiles |
| 04 | Patterns (`product`) | `sections/product` (no rows) | "God doesn't live in our world. We live in His." |
| 05 | Story (`story`) | `sections/story` | eyebrow, heading, three paragraphs, two CTAs, portrait |
| 06 | Framework (`framework`) | `sections/product` (rows 01–04) | four practices, each with "Explore the Framework" |
| 07 | Statement (`statement`) | `sections/statement` | "Unsettling conventions, one topic at a time" + line of seven words |
| 08 | Body Building (`scale`) | `sections/scale` | head per doc; cards unchanged (owner will revise) |
| 09 | Listen / Watch / Read (`pricing`) | `sections/pricing` | unchanged |
| 10 | Footer | `sections/footer` + `contact-link.tsx` | unchanged |

## Components added

- **`TopicsMenu`** (`nav/topics-menu.tsx`) — native `<details>` drop-down; no
  client JS, keyboard and screen-reader accessible; opens on click/tap.
- **`FeatureWindow`** (`hero/feature-window.tsx`, client) — the Relay product
  window's glass box (same place, size and ring at every frame; held still —
  no cursor tilt, parallax or grid wave, owner 2026-11-18) as a three-item showcase: image, kind, title, one line,
  CTA. Arrows + dots in the top bar, ←/→ inside, touch swipe; spring
  cross-fade; no autoplay. Content: `heroMock.feature.items` — edit there.
  `image: null` shows an orange typeset stand-in; `fit: "contain"` for book
  covers, `"cover"` for promo art. Replaced `HeroBook` and the workflow canvas
  (`product-window`, `live-runs`, `window-node` deleted; `flow-live` and
  `hero-tilt` deleted with the tilt). ADR-0034, ADR-0035.
- **`Story`** (`story/index.tsx`) — text + portrait section in normal flow
  (owner-edited copy, no fixed coordinates). Monogram stand-in until
  `storyMock.photo` is set.
- **`Product`** now takes `id`, `head`, optional `rows` (each `kind:
  trace | approval | chart` plus copy and an optional `cta`) and the shared
  row graphics — one component for both "content service" sections.
- **`FeatureRow`** — optional `cta` text link under the body.
- **`Wordmark`** (`components/ui/wordmark.tsx`) — "Thinking" + italic orange
  "Christian" as live Playfair text; paired with `assets/brand/tc-mark.svg`
  in the nav and footer.
- **`ContactLink`** (`footer/contact-link.tsx`) — mailto row that replaced the
  starter's non-functional signup form.

## Brand assets

`public/assets/brand/` — `tc-mark.svg` (bare orange mark), `tc-tile-orange.svg`
(white mark on orange), `tc-tile-white.svg` (orange mark on white). Vector,
measured from the owner's artwork; tile corner 6.125%.

## Waiting on the owner

Measured slot sizes (CSS px; the page scales up to 1920, so export ≈ 2× the
1920 size):

| Asset | Ratio | 1440 → 1920 | 390 | Export |
|---|---|---|---|---|
| Book cover (`heroMock.book.cover`) | 2 : 3 | 350×525 → 467×700 | 225×338 | 1000×1500 |
| Portrait (`storyMock.photo`) | 4 : 5 | 460×575 → 613×767 | 358×448 | 1280×1600 |
| Featured panel images | 2 : 1 (16 : 10 at 1024) | 602×301 → 802×401 | 312×156 | 1600×800 — keep text/faces in the middle 80 % |
| Framework row images | ≈ 2.3 : 1 | 760×328 → 1013×437 | 358 wide | 2000×864 |
| Body Building card art (×2) | ≈ 1.7 : 1 | 566×336 → 755×448 | 317×257 | 1600×950 |

Crop safe zones (measured 2026-11-19; the boxes change shape per width and
images fill them with `object-cover`): Framework rows are 2.3:1 at desktop,
≈1.65:1 at 1024/768 and 1.2–1.4:1 at 390 — keep text/faces in the **centre
1040×864** of a 2000×864 image. Body Building art is 1.7:1 at desktop, 1.5:1 at
1024, 2:1 at 768 and 1.2:1 at 390 — keep the subject in the **centre 1170×790**
of a 1600×950 image. Both slots currently show the template's animated
graphics; supplying an image replaces them.

Portrait framing: the 4:5 frame has no slack, so the photo itself needs
~10 % headroom above the head and ~60 px of background either side (the rounded
corners trim). The current portrait is cropped tight at the top and sides; a
reshoot/recrop at 1280×1600 is pending from the owner (2026-11-18).


- Images for Framework rows 01–04 (rows show placeholder graphics)
- Featured items 02–03 images (1600×800) and confirmation of the three Featured CTA URLs (`/digitaldiscernment`, `/podcast`, `/framework` — unverified; thinkingchristian.org is unreachable from the build container)

## Related

[[component-conventions]] · [[design-system]] · [[routing]]
