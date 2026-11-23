---
tags: [frontend, design-system, stable]
updated: 2026-07-04
---

# Design System — Tailwind v4

Styling uses **Tailwind CSS v4**, configured entirely in CSS. There is **no
`tailwind.config.js`**. ADR: [[decisions-log]] ADR-0004.

## Where config lives

`src/app/globals.css` is the single config file:

```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-onest);
}
```

Extra CSS layers can be split into `src/style/index.css` and imported.

## Design tokens

All colours, spacing, font sizes, radii, and shadows are **tokens** declared under
`:root` (raw values) and `@theme inline` (Tailwind bindings).

Once a token is in `@theme`, it becomes a utility automatically:

| Token | Generated utilities |
|-------|--------------------|
| `--color-brand` | `bg-brand`, `text-brand`, `border-brand` |
| `--radius-card` | `rounded-card` |
| `--spacing-section` | `pt-section`, `mt-section`, … |

> [!important] The token rule
> **Never** hardcode hex values, pixel spacing, or named colours in `className` or
> inline styles. If a value doesn't exist as a token, **add it to `globals.css`
> first** — with a comment noting where it came from (e.g. a Figma frame).

## CSS layers

Every custom style goes inside a layer — never outside one:

```css
@layer base {        /* element resets & defaults: h1, p, a … */ }
@layer components {  /* pseudo-elements & 3rd-party overrides only — see below */ }
@layer utilities {   /* single-purpose helpers: .scrollbar-none … */ }
```

## Where a style goes (ADR-0012)

`globals.css` is **not** a place to park component styles — it holds tokens and
base resets and stays a few hundred lines forever. Follow this order; the first
match wins:

| Situation | Goes where |
|-----------|-----------|
| One-off styling | Tailwind utilities in `className` — nothing in CSS |
| Repeated pattern with markup / structure / props | a **React component** in `components/ui/` |
| Repeated *pure-utility* combo, no structure | a Tailwind v4 `@utility` |
| Pseudo-elements, 3rd-party DOM overrides, complex selectors | `@layer components` — the genuine exceptions |
| A new colour / spacing / radius value | a **token** in `:root` + `@theme` |

> [!important] The default answer to "this looks repeated" is a **React
> component**, not a CSS class. An eyebrow label with a `::before` dot is an
> `<Eyebrow>` component — not a `.label-eyebrow` global class. `@layer
> components` is for what utilities and components genuinely *cannot* express.

There are **no CSS Modules** in this project — utilities + components cover
every case (motion is spring-based, so there are no keyframes to co-locate).

## Current theme state

The starter ships a **minimal** theme: `background` / `foreground` and the Onest
font, with a dark-mode override via `@media (prefers-color-scheme: dark)`. The
`@layer base/components/utilities` blocks are empty — fill them per project.

Home-hero tokens have been added for the **full-bleed symmetric gradient** backdrop:
`--hero-base` (near-black), `--hero-stage` (`#1246e2` blue), `--hero-glow`
(`#2ad4ff` cyan). They feed the `@utility hero-gradient` (two cyan side glows rising
into a blue bottom-centre pool over a dark base — now a no-WebGL fallback behind the
shader backdrop). The dev controls panel tints `--hero-stage`/`--hero-glow` live.
Note: the WebGL hero's *scene* colours are artwork constants baked into the scene
factory, **not** tokens — see [[decisions-log]] ADR-0014.

Brand palette (ADR-0017) — `--raw-*` primitives in `globals.css` (paper #E4E2DD,
orange #DB4A2B, orange-600 #C8462A, orange-50 #F7E4DE, stone #ABA8A3, ink #1E1E1E,
ink-500 #5D5C5A, white) with role tokens on top:
`--hero-page` (white — the card gap when the hero shrinks, and section backgrounds),
`--logo` (stone — topic marquee), `--accent` / `--accent-soft` (About icon chips),
`--accent-text` (small orange text, 4.81:1 on white), `--muted` (stone — large
de-emphasised heading words), `--muted-small` (ink-500), `--card-accent` /
`--card-gray` / `--card-dark` (stats cards), `--ink` (dark buttons, text, rules),
`--paper`, the **footer** set `--footer` (ink fallback behind the orange WebGL
gradient), `--footer-fg` (white), `--footer-muted` (stone), and the **preloader**
bar `--preloader-from` (paper) / `--preloader-to` (orange); plus
`--spacing-page-gutter` (`120px` → `px-page-gutter`). Bound in `@theme` →
`bg-accent`, `bg-accent-soft`, `text-accent-text`, `bg-card-accent`/`-gray`/`-dark`,
`bg-ink`/`text-ink`, `bg-paper`, `text-logo`, `text-muted`, `bg-footer`,
`text-footer-fg`, `text-footer-muted`, `from-preloader-from` / `to-preloader-to`.
Note: the contact form is inked with `--ink` / `bg-hero-page`. The site is
light-only since ADR-0017 (the dark-scheme override was removed).

## Typography

Thinking Christian brand type (ADR-0017), all via `next/font/google` in
`src/app/layout.tsx`, variables on `<body>`:

| Role | Face | Utility |
|---|---|---|
| Paragraphs, UI | **Public Sans** (`--font-public-sans`) | `font-sans` (body default) |
| Display headings, stat numbers | **Playfair Display** Medium 500 (`--font-playfair-display`) | `font-display font-medium` (`lining-nums` on numbers) |
| Italic quote / accent | **Cormorant Garamond** (`--font-cormorant-garamond`) | `font-serif italic` |

Display headings use `leading-[1.05]`–`[1.1]`: Playfair's tall ascenders clip at the
template's 0.95. Only 400/500 are loaded for the serifs.

## Buttons

One shared button shape across the site (the hero primary is the reference), applied
as inline utilities:

- **Base:** `rounded-full px-6 py-3 text-sm font-medium` — normal case (no `uppercase`),
  no tracking overrides, no icon/arrow.
- **Filled:** add a solid fill + contrasting text — `bg-black text-white hover:bg-black/90`
  on light sections; the hero's on-dark primary is `bg-white text-black`.
- **Outline:** same base but `border` + transparent fill, inheriting/among the section's
  text colour (e.g. `border-black/30 text-black hover:bg-black hover:text-hero-page`;
  on dark sections `border-white/25` / `border-footer-fg/40`).

**Exceptions:** the fixed header pill (`site-nav`) keeps its own `h-11` sizing; the hero
secondary "Learn more" is a plain underlined text link, not a pill.

## Styling rules

- Use utilities in JSX `className`; keep class strings short and readable.
- Extract a repeated pattern to a **React component** — not a `@layer
  components` class. See *Where a style goes* above (ADR-0012).
- Mobile-first responsive: `sm:` / `md:` / `lg:` / `xl:` prefixes.
- Dark mode: `dark:` prefix or token overrides in a `prefers-color-scheme` block.
- No inline `style` except for dynamic values (e.g. spring-animated values).

## Related

[[component-conventions]] · [[animation-system]] · [[new-page]]
