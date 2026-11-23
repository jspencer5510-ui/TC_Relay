"use client";

// Stats bento section — a blue collaboration card, a light-grey commitment/quote
// card, and a right column with a lime data-points card over a dark reach card.
// Inset 120px from the screen edges (page-gutter token). Cards do a soft staggered reveal
// (opacity + blur + slight rise) on scroll, driven by the shared ticker via
// useRevealCascade (react-spring self-springs don't run here — see ADR-0015). Copy from props.
import Image from "next/image";
import { animated } from "@react-spring/web";
import { useRevealCascade } from "@/components/common/use-reveal-cascade";

export interface StatsContent {
  label: string;
  brand: string;
  collab: { value: string; desc: string };
  commitment: { eyebrow: string; value: string; quote: string };
  data: { label: string; value: string; desc: string };
  reach: { label: string; value: string };
}

export interface StatsProps {
  content: StatsContent;
}

const CARD_RISE = 24; // px cards rise from
const CARD_BLUR = 12; // px soft start blur

/* Microphone — the host card (was a bar chart). The template's stock avatar
   stack is gone: on this site it would read as endorsements nobody gave. */
const MicIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <rect x="9" y="3" width="6" height="11" rx="3" />
    <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
  </svg>
);

// Numbers share the block heading's display scale (see about.tsx `.lead`).
const STAT_NUM =
  "font-display font-medium lining-nums leading-none tracking-tight text-[2rem] sm:text-[2.5rem] lg:text-[4rem]";

export const Stats = ({ content }: StatsProps) => {
  const { brand, collab, commitment, data, reach } = content;
  const { p, rootRef, localProg } = useRevealCascade<HTMLDivElement>(4);
  const cardStyle = (i: number) => ({
    opacity: p.to((v) => localProg(v, i)),
    transform: p.to((v) => `translateY(${CARD_RISE * (1 - localProg(v, i))}px)`),
    filter: p.to((v) => `blur(${CARD_BLUR * (1 - localProg(v, i))}px)`),
  });
  return (
    <section
      aria-label={content.label}
      className="bg-hero-page px-6 pb-32 md:px-12 lg:px-page-gutter"
    >
      <div ref={rootRef} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Collaboration — blue */}
        <animated.article
          style={cardStyle(0)}
          className="relative flex min-h-[32rem] flex-col justify-end overflow-hidden rounded-3xl bg-card-accent p-7 text-ink [will-change:transform,opacity]"
        >
          <Image
            src="/assets/images/2nd/james-spencer.jpg"
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover object-top"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-ink/25"
            aria-hidden="true"
          />
          <span className="absolute left-7 top-7 font-display text-2xl italic text-ink">
            {brand}
          </span>
          <span className="absolute right-7 top-7 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-card-accent">
            <MicIcon />
          </span>
          <div className="relative rounded-2xl bg-white p-6 text-ink">
            <div className={STAT_NUM}>{collab.value}</div>
            <p className="mt-3 max-w-xs text-base leading-relaxed text-ink/60">
              {collab.desc}
            </p>
          </div>
        </animated.article>

        {/* Commitment — grey with quote */}
        <animated.article
          style={cardStyle(1)}
          className="flex min-h-[32rem] flex-col rounded-3xl bg-card-gray p-8 text-ink [will-change:transform,opacity]"
        >
          <p className="text-base leading-relaxed text-ink/55">
            {commitment.eyebrow}
          </p>
          <div className={`mt-4 ${STAT_NUM}`}>{commitment.value}</div>
          <div className="mt-auto">
            <blockquote className="max-w-md font-serif text-3xl italic leading-snug text-ink/80">
              &ldquo;{commitment.quote}&rdquo;
            </blockquote>
          </div>
        </animated.article>

        {/* Right column — lime data + dark reach */}
        <div className="flex flex-col gap-6">
          <animated.article
            style={cardStyle(2)}
            className="flex flex-1 flex-col rounded-3xl bg-card-accent p-8 text-white [will-change:transform,opacity]"
          >
            <p className="text-sm text-white">{data.label}</p>
            <div className={`mt-4 ${STAT_NUM}`}>{data.value}</div>
            <p className="mt-auto max-w-xs text-base leading-relaxed text-white">
              {data.desc}
            </p>
          </animated.article>
          <animated.article
            style={cardStyle(3)}
            className="flex items-center justify-between rounded-3xl bg-card-dark px-8 py-10 text-white [will-change:transform,opacity]"
          >
            <span className="text-lg text-white/55">{reach.label}</span>
            <span className={STAT_NUM}>{reach.value}</span>
          </animated.article>
        </div>
      </div>
    </section>
  );
};
