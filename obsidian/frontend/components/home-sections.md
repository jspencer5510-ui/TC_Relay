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
| 02 | Hero (`hero`) | `sections/hero` + `hero-book.tsx` | chip, headline (Playfair semibold, last word italic orange), subhead, two CTAs, Digital Discernment cover |
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
- **`HeroBook`** (`hero/hero-book.tsx`) — book cover in the old product-window
  slot, linking to the book page. Typeset stand-in until `heroMock.book.cover`
  is set to an image under `public/`.
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
| Framework row images | ≈ 2.3 : 1 | 760×328 → 1013×437 | 358 wide | 2000×864 |


- Digital Discernment cover → `heroMock.book.cover`
- Portrait → `storyMock.photo`
- Images for Framework rows 01–04 (rows show placeholder graphics)

## Related

[[component-conventions]] · [[design-system]] · [[routing]]
