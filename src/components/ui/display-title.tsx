"use client";

import { InviewSeen } from "@/components/ui/inview-seen";
import { SPRING_SOFT } from "@/lib/motion";
import type { Tags } from "@/types/springs";

export interface TitleParts {
  /** Copy before the serif word, including its trailing space. */
  before: string;
  /** The italic Cormorant Garamond word. */
  accent: string;
  /** Copy after the serif word (often just "."). */
  after: string;
}

export interface DisplayTitleProps extends TitleParts {
  tag?: Tags;
  /** Size / leading of the sans runs. */
  className?: string;
  /** Size of the serif run. */
  accentClassName?: string;
  /** Typeface of the accent word: Cormorant (default) or Playfair. */
  accentFamily?: "serif" | "display";
  /** ms before the focus-in starts. */
  delay?: number;
}

/**
 * Playfair Display Medium title with an ink vertical gradient and one solid
 * Cormorant Garamond italic word (Hero 3488:21933, section heads 3488:21996).
 * The serif run sits on the same baseline with `leading-none`, so its larger
 * size does not grow the line box past Figma's line height.
 *
 * Motion (brief, shared.title "Фокусировка"): the title comes out of a blur
 * while a soft mask sweeps left → right, so letters resolve in reading order.
 * Done on the whole element rather than split letters — splitting would break
 * the gradient, which is clipped to the text of this one box.
 */
export const DisplayTitle = ({
  tag = "h2",
  before,
  accent,
  after,
  className = "",
  accentClassName = "",
  accentFamily = "serif",
  delay = 0,
}: DisplayTitleProps) => (
  <InviewSeen
    tag={tag}
    mode="once"
    from={{ opacity: 0, filter: "blur(10px)", "--reveal": "0%" }}
    to={{ opacity: 1, filter: "blur(0px)", "--reveal": "140%" }}
    config={SPRING_SOFT}
    delayIn={delay}
    style={{
      maskImage:
        "linear-gradient(90deg, black calc(var(--reveal) - 40%), transparent var(--reveal))",
      WebkitMaskImage:
        "linear-gradient(90deg, black calc(var(--reveal) - 40%), transparent var(--reveal))",
    }}
    className={`bg-linear-to-b/srgb from-title-gradient-from to-title-gradient-to bg-clip-text font-display font-medium tracking-title text-transparent ${className}`}
  >
    {before}
    <span
      className={`${accentFamily === "display" ? "font-display" : "font-serif font-medium"} leading-none text-title-accent italic ${accentClassName}`}
    >
      {accent}
    </span>
    {after}
  </InviewSeen>
);
