"use client";

import { InviewSeen } from "@/components/ui/inview-seen";
import type { Tags } from "@/types/springs";

export interface TypeTextProps {
  children: string;
  tag?: Tags;
  className?: string;
  /** ms before typing starts. */
  delay?: number;
  /** ms per character. */
  per?: number;
}

/**
 * Label that writes itself in from the left (motion brief, shared.mono; the
 * caret block was dropped at the designer's request).
 *
 * The labels are set in Public Sans since the brand-font pass (2026-11-18) —
 * proportional, so the old whole-character `1ch` clip no longer fits. A spring
 * runs `--typed` 0 → 1 and the clip wipes the label open left to right. The
 * copy stays one intact text node — nothing is split, so screen readers and
 * search see the plain label.
 */
/** The wipe every typed label shares: `--typed` 0 → 1 opens it left to right. */
export const TYPE_WIPE = "inset(0 calc((1 - var(--typed)) * 100%) 0 0)";

export const TypeText = ({
  children,
  tag = "span",
  className = "",
  delay = 0,
  per = 30,
}: TypeTextProps) => (
  <InviewSeen
    tag={tag}
    mode="once"
    className={`relative inline-block ${className}`}
    from={{ "--typed": 0 }}
    to={{ "--typed": 1 }}
    config={{ duration: children.length * per }}
    delayIn={delay}
    style={{ clipPath: TYPE_WIPE }}
  >
    {children}
  </InviewSeen>
);
