"use client";

// About heading section. The eyebrow reveals via <Inview>; the statement headline uses
// the shared per-letter reveal cascade (like every other heading — see [[decisions-log]]
// ADR-0015 / <AnimatedHeading>). This one has inline icon chips, so it's assembled by
// hand: text animates letter-by-letter (rise + soft blur + fade) while each round chip
// scales up out of a blur + fade — both sharing one staggered, scroll-triggered timeline.
// Copy comes from props (no hardcoded content).
import { animated } from "@react-spring/web";
import { Inview } from "@/components/common/robot-inview";
import { useRevealCascade } from "@/components/common/use-reveal-cascade";

export interface AboutContent {
  eyebrow: string;
  /** Heading fragments in order; `muted` greys the second phrase. */
  lead: string;
  mutedLead: string;
}

export interface AboutProps {
  content: AboutContent;
  labelId: string;
}

const RISE = 16; // px letters rise from
const BLUR = 8; // px start blur
const CHIP_MIN_SCALE = 0.3; // chips scale up from this

const Chip = ({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) => (
  <span
    className={`mx-[0.15em] inline-flex h-[0.82em] w-[0.82em] translate-y-[0.08em] items-center justify-center rounded-full text-white ${className}`}
  >
    {children}
  </span>
);

/* Chip icons (Thinking Christian): an open book beside "Reading the Bible…",
   a question mark beside "questioning the assumptions…" (were a bar chart and
   a lightning bolt). */
const BookIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[0.55em] w-[0.55em]" fill="currentColor" aria-hidden="true">
    <path d="M3 5.5c2.9-1 5.9-.8 8.25.8v13c-2.35-1.4-5.35-1.6-8.25-.6zM20.99 5.5v13.2c-2.9-1-5.9-.8-8.24.6v-13c2.35-1.6 5.34-1.8 8.24-.8z" />
  </svg>
);

const QuestionIcon = () => (
  <svg viewBox="0 0 24 24" className="h-[0.55em] w-[0.55em]" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
    <path d="M8.5 8.5a3.5 3.5 0 1 1 5.2 3.06c-1.08.6-1.7 1.4-1.7 2.44v.5" />
    <path d="M12 19h.01" />
  </svg>
);

const letterCount = (s: string) => [...s].filter((c) => c !== " ").length;

export const About = ({ content, labelId }: AboutProps) => {
  const { lead, mutedLead } = content;
  const leadLen = letterCount(lead);
  const mutedLen = letterCount(mutedLead);
  // Timeline items, in order: lead letters · chip1 · mutedLead letters · chip2.
  const total = leadLen + 1 + mutedLen + 1;
  const { p, rootRef, localProg } = useRevealCascade<HTMLHeadingElement>(total);

  // Render a text run as animated letters (word-preserving) from global index `from`.
  const runLetters = (text: string, from: number) => {
    const words = text.split(" ");
    const nodes: React.ReactNode[] = [];
    let i = from;
    words.forEach((word, wi) => {
      nodes.push(
        <span key={`w${from}-${wi}`} aria-hidden="true" className="inline-block">
          {[...word].map((ch, ci) => {
            const idx = i;
            i += 1;
            return (
              <animated.span
                key={ci}
                className="inline-block [will-change:transform,opacity]"
                style={{
                  opacity: p.to((v) => localProg(v, idx)),
                  transform: p.to(
                    (v) => `translateY(${RISE * (1 - localProg(v, idx))}px)`,
                  ),
                  filter: p.to((v) => `blur(${BLUR * (1 - localProg(v, idx))}px)`),
                }}
              >
                {ch}
              </animated.span>
            );
          })}
        </span>,
      );
      if (wi < words.length - 1) {
        nodes.push(
          <span key={`s${from}-${wi}`} aria-hidden="true">
            {" "}
          </span>,
        );
      }
    });
    return { nodes, next: i };
  };

  // A chip scales up out of blur + fade at its timeline slot.
  const chip = (
    idx: number,
    className: string,
    icon: React.ReactNode,
  ) => (
    <animated.span
      aria-hidden="true"
      className="inline-block [will-change:transform,opacity]"
      style={{
        opacity: p.to((v) => localProg(v, idx)),
        transform: p.to(
          (v) => `scale(${CHIP_MIN_SCALE + (1 - CHIP_MIN_SCALE) * localProg(v, idx)})`,
        ),
        filter: p.to((v) => `blur(${BLUR * (1 - localProg(v, idx))}px)`),
      }}
    >
      <Chip className={className}>{icon}</Chip>
    </animated.span>
  );

  const leadRun = runLetters(lead, 0);
  const chip1Idx = leadRun.next; // = leadLen
  const mutedRun = runLetters(mutedLead, chip1Idx + 1);
  const chip2Idx = mutedRun.next; // = total - 1

  return (
    <section
      aria-labelledby={labelId}
      className="bg-hero-page px-6 pb-32 pt-16 text-center"
    >
      <Inview
        tag="p"
        innerTag="span"
        mode="once"
        from={{ opacity: 0, y: 12 }}
        to={{ opacity: 1, y: 0 }}
        config={{ tension: 260, friction: 30 }}
        className="mb-6 block text-xs font-semibold uppercase tracking-[0.35em] text-accent-text"
      >
        {content.eyebrow}
      </Inview>

      <h2
        ref={rootRef}
        id={labelId}
        aria-label={`${lead} ${mutedLead}`}
        className="mx-auto block max-w-4xl text-[2rem] font-display font-medium leading-[1.05] tracking-tight text-ink sm:text-[2.5rem] lg:text-[4rem]"
      >
        {leadRun.nodes}
        {chip(chip1Idx, "bg-accent text-white", <BookIcon />)}{" "}
        <span className="text-muted">
          {mutedRun.nodes}
          {chip(chip2Idx, "bg-accent-soft text-ink", <QuestionIcon />)}
        </span>
      </h2>
    </section>
  );
};
