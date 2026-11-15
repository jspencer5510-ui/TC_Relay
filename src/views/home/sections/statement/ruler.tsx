"use client";

import {
  animated,
  easings,
  useSpring,
  type SpringValue,
} from "@react-spring/web";
import Image from "next/image";
import { useEffect, useState } from "react";

import { useFrame } from "@/hooks/use-frame";

import { StatementType } from "./plate";
import { POP, TIMELINE, useStatementSeen, WAVE } from "./use-statement-seen";

/**
 * Label boxes: 1440 3888:6437–6442 (80 wide), 1024 3888:10834–10839 (80),
 * 768 3832:8101–8106 (44), 390 3893:3735–3740 (44; 13:00 and 19:00 hidden).
 * First left-, last right-aligned, rest centred.
 */
const HOUR_POSITIONS = [
  /* seven slots spaced evenly along the line (1280 / 928 / 688 wide);
     the centre slot is the "now" label */
  "left-20 w-36 text-left w1024:left-12 w1024:w-24 w768:left-10 w768:w-20",
  "left-55.25 w-36 text-center w1024:left-38.75 w1024:w-24 w768:left-30.5 w768:w-20",
  "left-108.75 w-36 text-center w1024:left-77.25 w1024:w-24 w768:left-57.25 w768:w-20",
  "left-215.25 w-36 text-center w1024:left-154.75 w1024:w-24 w768:left-114.75 w768:w-20",
  "left-268.75 w-36 text-center w1024:left-193.25 w1024:w-24 w768:left-141.5 w768:w-20",
  "left-304 w-36 text-right w1024:left-220 w1024:w-24 w768:left-162 w768:w-20",
] as const;
/** Label slots along the line, as ruler fractions (for the reveal). */
const LABEL_P = [0, 1 / 6, 2 / 6, 4 / 6, 5 / 6, 1] as const;

/** Ruler length per frame (design px): 3888:6313, 3888:10710, 3855:2, 3893:3611. */
const RULER_WIDTH = { 1440: 1280, 1024: 928, 768: 688, 390: 350 } as const;

/** Tick slots every width/120; slot 60 is the gap under "now". */
const SLOTS = 121;
const NOW_SLOT = 60;

const NOW_P = NOW_SLOT / (SLOTS - 1);

/** The line sits at 75% ink (the old ticks' wave peak, 3488:22136). */
const TICK_PEAK = 0.75;
/** Wave head runs from just before the first tick to just past the last. */
const WAVE_FROM = -0.12;
const WAVE_TO = 1.12;
/** Half-width of the wave crest and of the reveal edge, in ruler fractions. */
const CREST = 0.06;
const EDGE = 0.03;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** Smooth crest: 1 at the wave head, 0 at ±CREST. */
const crest = (wave: number, p: number) => {
  const d = Math.abs(wave - p) / CREST;
  return d >= 1 ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * d);
};

export interface RulerProps {
  caption: string;
  now: string;
  hours: readonly string[];
}

/**
 * Run ruler 3488:22136. One spring (`wave`, 0 → 1 along the ruler) drives
 * every tick, label and the "now" flash. First pass = entrance: ticks appear
 * left → right behind the crest, hour labels with them, "now" flashes as the
 * crest crosses it. Then, while the plate is on screen, the same crest runs
 * again every few seconds: ticks rise and darken as it passes, "now" pulses.
 * Between passes the ruler rests exactly at Figma.
 */
export const Ruler = ({ caption, now, hours }: RulerProps) => {
  const { seen, inView, reduced } = useStatementSeen();
  const frame = useFrame();
  const span = RULER_WIDTH[frame] + 2;
  /** false until the entrance pass has finished. */
  const [shown, setShown] = useState(false);
  /* Fully off screen: the next visit replays the entrance pass. */
  if (!seen && shown) setShown(false);

  const [{ wave }, api] = useSpring(() => ({ wave: WAVE_FROM }));

  const pop = useSpring({
    from: { scale: 0 },
    to: { scale: seen ? 1 : 0 },
    delay: reduced ? 0 : TIMELINE.nowPop,
    config: POP,
    immediate: reduced || !seen,
  });

  useEffect(() => {
    if (!seen) {
      api.stop();
      api.set({ wave: WAVE_FROM });
      return;
    }
    if (reduced) {
      api.set({ wave: WAVE_TO });
      setShown(true);
      return;
    }
    if (!shown) {
      const id = setTimeout(() => {
        api.start({
          from: { wave: WAVE_FROM },
          to: { wave: WAVE_TO },
          config: { duration: WAVE.pass, easing: easings.linear },
          onRest: () => setShown(true),
        });
      }, TIMELINE.wave);
      return () => clearTimeout(id);
    }
    if (!inView) return;
    let id: ReturnType<typeof setTimeout>;
    const pass = () => {
      api.start({
        from: { wave: WAVE_FROM },
        to: { wave: WAVE_TO },
        config: { duration: WAVE.pass, easing: easings.easeInOutSine },
        onRest: ({ finished }) => {
          if (finished) id = setTimeout(pass, WAVE.hold);
        },
      });
    };
    id = setTimeout(pass, WAVE.hold);
    return () => {
      clearTimeout(id);
      api.stop();
      api.set({ wave: WAVE_TO });
    };
  }, [seen, shown, inView, reduced, api]);

  const reveal = (w: number, p: number) =>
    shown ? 1 : clamp01((w - p + EDGE) / EDGE);


  /** Ring leaves "now" as the crest crosses it; the dot bumps under the crest. */
  const ringT = (w: SpringValue<number>) => w.to((v) => (v - NOW_P) / 0.22);
  const ring = {
    scale: ringT(wave).to((t) => 1 + 2.2 * clamp01(t)),
    opacity: ringT(wave).to((t) => (t > 0 && t < 1 ? 0.6 * (1 - t) : 0)),
  };
  const bump = { scale: wave.to((w) => 1 + 0.6 * crest(w, NOW_P)) };

  return (
    <>
      <p className="absolute top-112 left-20 h-5 font-mono text-label leading-label whitespace-nowrap text-statement-ink-caption w1024:top-101.5 w1024:left-12 w768:top-99.5 w768:left-10 w390:top-[calc(var(--spacing)*61.25)] w390:left-5 w390:h-10 w390:w-19.75 w390:whitespace-normal">
        <StatementType delay={TIMELINE.caption}>{caption}</StatementType>
      </p>
      <svg
        aria-hidden="true"
        width={span}
        height="18"
        viewBox={`0 0 ${span} 18`}
        fill="none"
        className="absolute top-121 left-19.75 h-4.5 w-320.5 max-w-none overflow-visible text-on-accent w1024:top-112 w1024:left-11.75 w1024:w-232.5 w768:top-110.5 w768:left-9.75 w768:w-172.5 w390:top-[calc(var(--spacing)*75.25)] w390:left-4.75 w390:w-88"
      >
        {/* doc 2026-11-14: a straight line instead of the tick ruler,
            drawn left → right by the same wave */}
        <animated.path
          d={`M0 17H${span}`}
          stroke="currentColor"
          strokeWidth={1}
          style={{
            transform: wave.to((w) => `scaleX(${clamp01((w - WAVE_FROM) / (1 - WAVE_FROM))})`),
            transformBox: "fill-box",
            transformOrigin: "left",
            opacity: TICK_PEAK,
          }}
        />
      </svg>
      {/* "now" appears with its dot, once the stem has landed — not before */}
      <animated.p
        style={{
          opacity: pop.scale.to((s) => Math.min(1, Math.max(0, s))),
          y: pop.scale.to((s) => (1 - Math.min(1, s)) * 6),
        }}
        className="absolute top-127 left-156 w-48 text-center font-mono text-label leading-label text-on-accent w1024:top-119 w1024:left-110 w1024:w-36 w1024:text-hero-note w1024:leading-hero-note w768:top-117 w768:left-84 w768:w-24 w390:top-[calc(var(--spacing)*82.75)] w390:left-5 w390:w-87.5 w390:text-label w390:leading-label"
      >
        {now}
      </animated.p>
      <animated.span
        aria-hidden="true"
        style={pop}
        className="absolute top-123.25 left-178.75 size-2.5 w1024:top-110.25 w1024:left-126.75 w768:top-109.75 w768:left-95 w390:top-74.5 w390:left-47.5 w390:size-[calc(var(--spacing)*2.75)]"
      >
        <animated.span
          style={ring}
          className="absolute inset-0 rounded-full border border-statement-flash"
        />
        <animated.span style={bump} className="block size-full">
          <Image
            src="/assets/statement/statement-now-node.svg"
            alt=""
            width={10}
            height={10}
            className="block size-full"
          />
        </animated.span>
      </animated.span>
      <ul aria-hidden="true">
        {hours.map((hour, i) => (
          <animated.li
            key={hour}
            style={{
              opacity: wave.to((w) => reveal(w, LABEL_P[i] ?? 1)),
            }}
            className={`absolute top-127 font-mono text-label leading-label text-statement-ink-muted w1024:top-119 w1024:text-hero-note w1024:leading-hero-note w768:top-117 w390:hidden ${HOUR_POSITIONS[i]}`}
          >
            {hour}
          </animated.li>
        ))}
      </ul>
    </>
  );
};
