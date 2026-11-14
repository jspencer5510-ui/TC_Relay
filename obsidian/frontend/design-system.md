---
tags: [frontend, design-system, stable]
updated: 2026-07-17
---

# Design System — Tailwind v4

Styling uses **Tailwind CSS v4**, configured entirely in CSS. There is **no
`tailwind.config.js`**. ADR: [[decisions-log]] ADR-0004.

## Where config lives

`src/app/globals.css` is the single config file. Extra CSS layers can be split
into `src/style/index.css` and imported.

The import is scoped: `@import "tailwindcss" source("../")` limits class
detection to `src/`. Without it Tailwind v4 auto-scans the whole repo, so class
*patterns* written in documentation — `duration-[var(--duration-*)]` in the vault
and in `.claude/` — are parsed as real candidates and emit CSS build warnings.
Documentation is not a source of utilities.

## Token naming convention

> [!important] This convention is **strict and portable by design**
> It is intended to be identical in every project built from this starter, so an
> agent or developer moving between them can predict a token's name without
> reading the file. Deviating in one project defeats the point. ADR: [[decisions-log]] ADR-0015.

Tokens are organised in **three tiers**. Each tier may only reference the tier
below it, and **no tier may be skipped** — semantic tokens are what make a
re-theme or a rebrand a one-line change instead of a find-and-replace.

| Tier | Grammar | Lives in | Example | Usable in markup? |
|------|---------|----------|---------|-------------------|
| **1 — Primitive** | `--raw-<category>-<name>[-<shade>]` | `:root` | `--raw-color-neutral-950` | ❌ never |
| **2 — Semantic** | `--<role>[-<variant>][-<state>]` | `:root` | `--background`, `--action-primary-hover` | ❌ only via its Tier-2 binding |
| **3 — Component** | `--<tw-namespace>-<component>[-<property>]` | `@theme inline` | `--radius-button` | ✅ `rounded-button` |

Plus the **theme binding**, which is what actually creates the utilities:

```css
@theme inline {
  --color-background: var(--background);   /* --<tw-namespace>-<role>: var(--<role>) */
}
```

### The rules

1. **Only Tier 1 contains literals.** A hex, px, or ms value anywhere else is a bug.
2. **Tier 2 names describe purpose, never appearance.** `--action-primary`, not
   `--blue`. `--surface-raised`, not `--grey-light`. If renaming the colour would
   force renaming the token, the name is wrong.
3. **Tier 2 is the themeable layer.** Dark mode and any runtime theming override
   Tier 2 tokens — never Tier 1, never a `@theme` entry.
4. **Every `@theme inline` entry is exactly `--<namespace>-<role>: var(--<role>)`.**
   No literals, no `calc()`, no skipping to `var(--raw-*)`.
5. **kebab-case, singular, unabbreviated.** `--raw-color-neutral-950`, not
   `--raw-clr-neutrals-950`. State goes last: `--action-primary-hover`.
6. **Tier 3 is rare.** Per ADR-0012 a repeated pattern is a React component, not a
   token set. Reach for a component token only when the same value must be shared
   across components that cannot import each other.

### Why Tier 2 is separate from `@theme`

`@theme inline` **inlines** each `var()` into the generated utility. That is what
makes overriding the Tier 2 token in a `prefers-color-scheme` block cascade into
every `bg-background` on the page. Binding a literal — or a `var(--raw-*)` —
directly in `@theme` freezes the value at build time and silently breaks theming.
The indirection is load-bearing, not ceremony.

### Namespaces that generate utilities

A token only becomes a utility if its prefix is a Tailwind namespace. Verified
against `tailwindcss` v4.3.3 (the installed version):

| Namespace | Generated utilities |
|-----------|--------------------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, … |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, … |
| `--radius-*` | `rounded-*` |
| `--leading-*` | `leading-*` |
| `--tracking-*` | `tracking-*` |
| `--text-*` | `text-*` (size) |
| `--font-*` | `font-*` |
| `--ease-*` | `ease-*` |
| `--shadow-*` / `--blur-*` / `--animate-*` | `shadow-*` / `blur-*` / `animate-*` |
| `--breakpoint-*` / `--container-*` | `sm:` … / `max-w-*` |

> [!warning] There is **no `--duration-*` namespace** in Tailwind v4
> `--duration-fast` in `@theme` generates nothing and is not even emitted — a
> `duration-fast` class silently does nothing. Durations therefore stay **Tier 2
> only** and are consumed as `duration-[var(--duration-fast)]`. (Guides that list
> `--duration-*` alongside `--ease-*` are wrong for v4; `--ease-*` *is* real.)

If a value's prefix is not in that table, it is not a utility — either pick the
right namespace or use it via `var()` in an arbitrary value.

> [!important] The token rule
> **Never** hardcode hex values, pixel spacing, or named colours in `className` or
> inline styles. If a value doesn't exist as a token, **add it to `globals.css`
> first** — as a Tier 1 primitive plus the Tier 2 semantic token that names its
> purpose — with a comment noting where it came from (e.g. a Figma frame).

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

**Light, brand palette** (owner brand sheet, 2026-11-14 — [[decisions-log]] ADR-0031).
The site was dark-on-lime; it is now ink on paper with one orange accent. There is
no `prefers-color-scheme` override — the design is light-only.

| Brand colour | Tier 1 | Semantic roles it feeds |
|---|---|---|
| `#E4E2DD` paper | `--raw-color-paper` | `--background` (page) |
| `#FFFFFF` white | `--raw-color-white` | `--surface-raised`, `--surface-badge`, `--on-accent`; glass is white at 40–85 % |
| `#1E1E1E` ink | `--raw-color-ink` | `--foreground`, title gradient top; borders are ink at 8–18 % |
| `#ABA8A3` stone | `--raw-color-stone` | hairlines, dots, idle markers, the stream's second hue |
| `#DB4A2B` brand orange | `--raw-color-rust-500` | `--title-accent` (large serif word), `--accent-marker`, logo, stream |

**Derived for contrast — not in the brand sheet, keep them:**

| Tier 1 | Value | Why |
|---|---|---|
| `--raw-color-rust-600` | `#C8462A` | `--accent`: CTA fills and small accent text. White on it 4.81:1, it on white 4.81:1. The brand `#DB4A2B` gives 4.18:1 — fails AA for 16 px labels. |
| `--raw-color-ink-500` | `#5D5C5A` | `--foreground-muted` — 5.16:1 on paper. Stone on paper is 1.83:1, unusable for text. |
| `--raw-color-ink-450` | `#646360` | `--foreground-dim` — 4.64:1 on paper; also icon/“failed” grey (6:1 on white). |
| `--raw-color-ink-700` | `#3A3A39` | display-title gradient, lower stop |
| `--raw-color-rust-50` | `#F7E4DE` | `--accent-soft`, pale accent wash |

Known soft spot: the nav link hover (`hover:text-accent`) is 3.72:1 on paper —
transient state, under the 4.5 bar; switch it to a darker shade if an audit flags it.

**Section token files** (`src/style/sections/*.css`) were converted by rule
(lime → orange; white overlays → ink overlays; dark glass → white glass; dark
solids → white; lime↔white / lime↔black ramps → orange↔ink / orange↔white) and
then hand-tuned (text on the orange panels is white; product cubes are
white/paper/stone). Their comments still cite the original dark Figma values.

**The particle stream** renders additively on black as before; the canvas is CSS
`invert` + `mix-blend-multiply`, and `particle-stream.tsx` feeds the scene the
**complement** of each `--stream-*` token, so it prints in the token's own colour.
Brightness and bloom are tuned down for paper (see `getlayers.json`).

## Typography

| Role | Typeface | Binding | Used by |
|---|---|---|---|
| Titles, h1/h2 | **Playfair Display Medium** (500) | `--font-playfair-display` → `--font-display` → `font-display` | `DisplayTitle`, statement title, footer CTA title, error / 404 |
| Subtitles, the italic accent word | **Cormorant Garamond** (400/500, roman + italic) | `--font-cormorant-garamond` → `--font-serif` → `font-serif` | accent word in every display title; hero subtitle (`text-subtitle`, 22 px — its small x-height reads like ~18 px sans) |
| Paragraphs, UI | **Public Sans** (variable) | `--font-public-sans` → `--font-sans`; `body` default | everything else |
| Data labels | Fragment Mono (kept from the template) | `--font-fragment-mono` → `--font-mono` | timestamps, chips, run ids |

All four load through `next/font/google` in `src/app/layout.tsx` (self-hosted at
build, no runtime request to Google).

## Motion: springs first, CSS for trivial state

Hard rule #1 stands — **all real motion is spring-based** ([[animation-system]]).
There is one narrow exception, added because wiring a spring for a colour fade on
hover costs a client component and a hook for no benefit. ADR: [[decisions-log]] ADR-0014.

**CSS transitions are allowed only for simple, discrete state changes:**

| Allowed (CSS) | Not allowed (use a spring) |
|---------------|---------------------------|
| `hover:` / `focus-visible:` / `active:` colour, `opacity`, `border-color`, underline | anything scroll-driven |
| Small decorative nudges (an arrow shifting a few px on hover) | enter/reveal animations → `<Inview>` |
| | text animation → [[text-engine]] |
| | layout/size changes, orchestrated or staggered sequences |
| | anything that must be interruptible or physical |

Conditions — all three, or it is a spring:

1. **Token-backed timing.** Duration and easing come from tokens — never raw
   values: `transition-colors duration-[var(--duration-fast)] ease-entrance`.
2. **`transition-*` only.** `@keyframes` remain **banned** outright — an
   animation long enough to need keyframes is long enough to deserve a spring.
3. **Utilities only.** The transition lives in `className`, not in a CSS file.

```tsx
<a className="text-foreground/70 transition-colors duration-[var(--duration-fast)]
              ease-entrance hover:text-foreground">
  Contact
</a>
```

If you are reaching past this list, you want `<Hover>` — see
[[components/animation-springs]].

## Styling rules

- Use utilities in JSX `className`; keep class strings short and readable.
- Extract a repeated pattern to a **React component** — not a `@layer
  components` class. See *Where a style goes* above (ADR-0012).
- Mobile-first responsive: `sm:` / `md:` / `lg:` / `xl:` prefixes.
- Dark mode: `dark:` prefix or token overrides in a `prefers-color-scheme` block.
- No inline `style` except for dynamic values (e.g. spring-animated values).
- Motion is spring-based; CSS `transition-*` only for the narrow hover/focus case
  above — never `@keyframes`.

## Related

[[component-conventions]] · [[animation-system]] · [[new-page]]
