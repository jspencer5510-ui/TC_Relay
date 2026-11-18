"use client";

import { animated, useSprings } from "@react-spring/web";

import { SPRING, SPRING_SOFT } from "@/lib/motion";

import { StatementType } from "./plate";
import { TIMELINE, useStatementSeen } from "./use-statement-seen";

export interface StatementTitleProps {
  lead: string;
  accent: string;
  tail: string;
  /** Line under the heading (owner, 2026-11-15: moved up from the ruler). */
  caption?: string;
}

/**
 * Dark-ink title: sans words rise one by one, the serif accent lands last
 * with a -16° slant that straightens. Words are inline-blocks separated by
 * the original spaces, so the resting layout is the plain heading.
 */
export const StatementTitle = ({ lead, accent, tail, caption }: StatementTitleProps) => {
  const { seen, reduced } = useStatementSeen();
  const leadWords = lead.split(" ");
  const tailWords = tail.trim().split(" ");
  const count = leadWords.length + tailWords.length + 1;
  const accentIndex = count - 1;

  const [springs] = useSprings(
    count,
    (i) => {
      const isAccent = i === accentIndex;
      const hidden = {
        opacity: 0,
        y: isAccent ? 28 : 22,
        skewX: isAccent ? -16 : 0,
      };
      return {
        from: hidden,
        to: seen ? { opacity: 1, y: 0, skewX: 0 } : hidden,
        delay: reduced ? 0 : TIMELINE.title + i * TIMELINE.titleStep,
        config: isAccent ? SPRING_SOFT : SPRING,
        immediate: reduced || !seen,
      };
    },
    [seen, reduced],
  );

  const word = (text: string, i: number, className = "") => (
    <animated.span
      key={`${text}-${i}`}
      className={`inline-block ${className}`}
      style={springs[i]}
    >
      {text}
    </animated.span>
  );

  return (
    <div className="absolute top-27 left-20 flex w-320 flex-col items-center gap-3 w1024:top-21 w1024:left-12 w1024:w-232 w768:top-19 w768:left-10 w768:w-172 w390:top-12 w390:left-5 w390:w-87.5 w390:gap-2">
    <h2
      id="statement-title"
      className="w-full text-center font-display text-section-title leading-statement-title font-medium tracking-title text-on-accent"
    >
      <span className="block">
        {leadWords.map((w, i) => [i > 0 && " ", word(w, i)])}
      </span>
      <span className="block">
        {word(
          accent,
          accentIndex,
          "origin-bottom-left font-serif text-section-title-accent font-medium italic",
        )}
        {tailWords.map((w, i) => [" ", word(w, leadWords.length + i)])}
      </span>
    </h2>
    {caption && (
      <p className="flex justify-center font-sans tabular-nums text-label leading-label text-statement-ink-caption">
        <StatementType delay={TIMELINE.caption}>{caption}</StatementType>
      </p>
    )}
    </div>
  );
};
