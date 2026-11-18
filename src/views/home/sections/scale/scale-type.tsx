"use client";

import type { RefObject } from "react";

import { InviewSeen } from "@/components/ui/inview-seen";
import { TYPE_WIPE } from "@/components/ui/type-text";

const PER = 30;

/**
 * The shared TypeText, but started by `trigger` being seen instead of the
 * label itself. The art's bottom lines (caption, footnote) sit ~140 px above
 * the fold at a normal landing — below the VIEW_MARGIN line — so on their own
 * they showed a bare caret with no text. They now type once the art above
 * them is on screen. Same wipe as `@/components/ui/type-text`.
 */
export const ScaleType = ({
  children,
  trigger,
  delay = 0,
}: {
  children: string;
  trigger: RefObject<HTMLElement | null>;
  delay?: number;
}) => (
  <InviewSeen
    tag="span"
    mode="once"
    trigger={trigger as RefObject<HTMLElement>}
    className="relative inline-block"
    from={{ "--typed": 0 }}
    to={{ "--typed": 1 }}
    config={{ duration: children.length * PER }}
    delayIn={delay}
    style={{ clipPath: TYPE_WIPE }}
  >
    {children}
  </InviewSeen>
);
