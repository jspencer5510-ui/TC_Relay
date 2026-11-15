"use client";

import { animated, useSpring } from "@react-spring/web";
import { useEffect } from "react";

import { SPRING } from "@/lib/motion";

import { useLoopReady } from "./stage";
import { useLoopGate } from "./use-loop-gate";

/** SPRING ~20% quicker: tension ×1.5, friction ×√1.5 keeps its damping. */
const SPRING_FAST = {
  tension: SPRING.tension * 1.5,
  friction: SPRING.friction * 1.22,
} as const;

/** How far the chevrons step forward, px (viewBox = CSS px here). */
const STRIDE = 26;
/** Pause after the loop unlocks / comes back on screen before the first step. */
const LEAD = 320;
/** How long the chevrons hold forward before stepping back. */
const HOLD = 720;
/** Rest at the Figma position between steps. */
const REST = 2080;

/** The back chevron trails the front one by this share of the step. */
const LAG = 0.3;
const lead = (p: number) => Math.min(1, p / (1 - LAG));

/**
 * Panel glyph 3488:22873 — "Шаг вперёд", looping while the brand panel is on
 * screen. The SVG box scales with the frame's glyph (3888:7061 145 × 156,
 * 3888:11472 148 × 160 — kept at 300; 3876:100 138 × 150 → 285;
 * 3954:698 111 × 120 → 228), so the stride scales with it:
 * both chevrons step right (front one leading, both brightening a
 * touch), hold, spring back to the Figma resting state, rest, repeat.
 * One spring drives both. It waits for the footer entrance to settle
 * (`useLoopReady`), so it is the last thing to move; off screen it snaps to
 * rest and stops, and a return starts the cycle from its beginning.
 * Reduced motion keeps it static. Geometry is the owner's mark (tc-mark.svg).
 */
/** The owner's mark, in its source units (2000-px artboard). */
const MARK_BARS = [
  [524, 780, 127, 474],
  [688, 649, 128, 737],
  [853, 502, 127, 999],
  [1018, 502, 127, 999],
  [1184, 649, 127, 737],
  [1349, 780, 128, 474],
] as const;
const MARK_BRIDGES = [
  "M813 1234C817 1246 823 1251 834 1251C845 1251 851 1246 855 1234L855 1306C851 1294 845 1289 834 1289C823 1289 817 1294 813 1306Z",
  "M1144 747C1148 760 1154 766 1164 766C1174 766 1180 760 1184 747L1184 815C1180 802 1174 796 1164 796C1154 796 1148 802 1144 815Z",
] as const;
/** 998-unit-tall mark → 150 px, the old chevrons' height. */
const MARK_SCALE = 150 / 998;
/** Bar i brightens as the step passes it (0 → 5, left → right). */
const barWave = (p: number, i: number) => {
  const d = Math.abs(p * 1.4 - 0.2 - i / 5);
  return d >= 0.35 ? 0 : 1 - d / 0.35;
};

export const PanelGlyph = () => {
  const { ref, inView, reduced } = useLoopGate<SVGSVGElement>();
  const ready = useLoopReady();
  const [{ p }, api] = useSpring(() => ({ p: 0, config: SPRING_FAST }));

  useEffect(() => {
    if (!ready || !inView || reduced) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = setTimeout(resolve, ms);
      });
    const run = async () => {
      await wait(LEAD);
      while (alive) {
        await api.start({ p: 1 });
        if (!alive) return;
        await wait(HOLD);
        if (!alive) return;
        await api.start({ p: 0 });
        if (!alive) return;
        await wait(REST);
      }
    };
    void run();
    return () => {
      alive = false;
      clearTimeout(timer);
      api.stop();
      api.set({ p: 0 });
    };
  }, [ready, inView, reduced, api]);

  return (
    <svg
      ref={ref}
      aria-hidden="true"
      width={300}
      height={300}
      viewBox="0 0 300 300"
      fill="none"
      overflow="visible"
      className="absolute -top-10 left-74.75 block size-75 max-w-none w1024:-top-12 w1024:left-58.75 w768:-top-11 w768:left-119.25 w768:size-71.25 w768:[clip-path:inset(calc(var(--spacing)*17)_calc(var(--spacing)*24.5)_calc(var(--spacing)*16.75)_calc(var(--spacing)*12.25))] w390:-top-8.75 w390:[clip-path:inset(calc(var(--spacing)*13.75)_calc(var(--spacing)*19.25)_calc(var(--spacing)*13.25)_calc(var(--spacing)*10))] w390:left-44.75 w390:size-57"
    >
      {/* Thinking Christian mark (owner logo) in place of the two chevrons:
          the mark steps forward as the chevrons did, and its bars brighten
          left → right with the step. Geometry: public/assets/brand/tc-mark.svg. */}
      <defs>
        <mask id="panel-glyph-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="2000" height="2000">
          <rect width="2000" height="2000" fill="white" />
          <rect x="902" y="872" width="196" height="49" rx="20" fill="black" />
        </mask>
      </defs>
      <animated.g
        style={{ transform: p.to((v) => `translateX(${STRIDE * lead(v)}px)`) }}
      >
        <g transform={`translate(124 150) scale(${MARK_SCALE}) translate(-1000 -1001)`}>
          <g mask="url(#panel-glyph-cut)" fill="white">
            {MARK_BARS.map(([x, y, w, h], i) => (
              <animated.rect
                key={x}
                x={x}
                y={y}
                width={w}
                height={h}
                rx={28}
                fillOpacity={p.to((v) => 0.06 + 0.05 * barWave(v, i))}
              />
            ))}
            {MARK_BRIDGES.map((d) => (
              <path key={d} d={d} fillOpacity={0.06} />
            ))}
          </g>
        </g>
      </animated.g>
    </svg>
  );
};
