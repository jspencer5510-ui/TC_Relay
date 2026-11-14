# Design map — Relay

**Figma file key:** `WINXFW2nTM7zYwd5dGgm1T`
**Frames** (current — earlier ids 3488:18914 / 3603:2 are superseded):

| Frame | Node | Size | Range | Variant | 1 rem |
|-------|------|------|-------|---------|-------|
| 1440 | `3888:2736` | 1440 × 7361 | > 1200px | (base) | viewport / 90 |
| 1024 | `3888:7141` | 1024 × 7337 | ≤ 1200px | `w1024:` | viewport / 64 |
| 768 | `3832:4407` | 768 × 9874 | ≤ 900px | `w768:` | viewport / 48 |
| 390 | `3893:2` | 390 × 10877 | ≤ 580px | `w390:` | viewport / 24.375 |

In every range 1 rem = 16 design px of the active frame, so design px ÷ 4 is the Tailwind spacing number.
Variants cascade (widest first); breakpoints live in `grid.config.ts` and `globals.css`. Content insets:
80 / 48 / 40 / 20.

Re-fetch from these node IDs rather than from memory. `get_design_context` on a whole section
often returns sparse metadata; call it on the children.

## Figma variables (resolved on `3488:18914`)

| Variable | Value | Token |
|----------|-------|-------|
| color/bg | `#000000` | `--background` |
| color/text | `#ffffff` | `--foreground` |
| color/text-muted | `#9ba0a6` | `--foreground-muted` |
| color/text-dim | `#6e7378` | `--foreground-dim` |
| color/surface-2 | `#131416` | `--surface-raised` |
| color/accent-soft | `#eaff9e` | `--accent-soft` |

Generated code shows stale fallbacks (`#f3f5f9`, `#9ca8bd`) — the variables above win.

## Sections

Node id / height per frame.

| # | Section | 1440 | 1024 | 768 | 390 | Component |
|---|---------|------|------|-----|-----|-----------|
| — | Backdrop (top) | `3888:4242` 1154 | `3888:8647` 1154 | `3832:5914` 1154 | `3893:1508` 1154 | `views/home/sections/backdrop` |
| — | Field texture | `3888:2737` 2400 | `3888:7142` 2400 | `3832:4409` 2400 | `3893:3` 2400 | `views/home/sections/backdrop` |
| 01 | Navigation | `3888:4858` 88 | `3888:9263` 88 | `3832:6530` 64 | `3893:2123` 56 | `views/home/sections/nav` |
| 02 | Hero | `3888:4876` 712 | `3888:9281` 712 | `3832:6548` 976 | `3893:2141` 949 | `views/home/sections/hero` |
| 03 | Integrations | `3888:5781` 354 | `3888:10189` 212 | `3832:7456` 228 | `3893:3056` 216 | `views/home/sections/integrations` |
| 04 | Product | `3888:5813` 1593 | `3888:10220` 1509 | `3832:7487` 2000 | `3893:3087` 1680 | `views/home/sections/product` |
| 05 | Statement | `3888:5969` 548 | `3888:10366` 528 | `3832:7633` 528 | `3893:3266` 371 | `views/home/sections/statement` |
| 06 | Scale | `3888:6445` 758 | `3888:10842` 858 | `3832:8109` 1286 | `3893:3743` 1138 | `views/home/sections/scale` |
| 07 | Signals | `3888:6522` 774 | `3888:10926` 784 | `3832:8181` 1138 | `3893:3826` 1401 | `views/home/sections/signals` |
| 08 | Proof | `3888:6908` 884 | `3888:11313` 816 | `3832:8566` 906 | `3893:4222` 1706 | `views/home/sections/proof` |
| 09 | Pricing | `3888:6967` 878 | `3888:11375` 1120 | `3876:2` 1664 | `3893:4285` 2131 | `views/home/sections/pricing` |
| 10 | Footer | `3888:7053` 772 | `3888:11464` 710 | `3876:92` 1084 | `3893:4376` 1229 | `views/home/sections/footer` |

## Shared pieces

| Piece | Node ID | Component |
|-------|---------|-----------|
| Section badge | `3488:21993` | `components/ui/badge` |
| Section head | `3488:21991` | `components/ui/section-head` |
| Display title (gradient + serif word) | `3488:21933`, `3488:21996` | `components/ui/display-title` |
| Pill CTA | instance `2726:25` | `components/ui/pill-button` |

## Assets

`public/assets/<section>/`, kebab-case, prefixed by section.
