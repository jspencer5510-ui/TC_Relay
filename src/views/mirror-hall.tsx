"use client";

// 📖 Docs: obsidian/meta/decisions-log.md ADR-0018 · frontend/animation-system.md
//
// "Mirror Hall" — the portfolio section. A client leaf that mounts the WebGL rotunda
// (lib/three/mirror-hall-scene.ts) and renders the DOM HUD above it: an editorial
// masthead, a live caption tracking whichever card is front-and-centre, a hairline
// frame, and a drag hint that retires after the first drag.
//
// The HUD is DOM, so its motion follows ADR-0002 — every animated value is a
// react-spring value driven from the shared ticker (react-spring's own self-running
// springs don't progress in this project, ADR-0015). The source spec used CSS
// keyframes and transitions for the same effects; those are banned here.
import { useCallback, useEffect, useRef, useState } from "react";
import { animated } from "@react-spring/web";
import { AnimatedHeading } from "@/components/common/animated-heading";
import { useRevealCascade } from "@/components/common/use-reveal-cascade";
import { useSwapReveal } from "@/views/use-swap-reveal";
import {
  createMirrorHall,
  type MirrorHallHandle,
} from "@/lib/three/mirror-hall-scene";

export interface MirrorHallItem {
  /** Card title — shown on the 3D label and in the focus caption. */
  name: string;
  /** Card texture (absolute URL or public path). */
  image: string;
}

export interface MirrorHallContent {
  /** Ties the section to its heading for assistive tech. */
  labelId: string;
  kicker: string;
  /** Emphasised tail of the kicker (rendered in the accent colour). */
  kickerAccent: string;
  heading: string;
  tagline: string;
  hint: string;
  /** Accessible name for the canvas artwork. */
  sceneLabel: string;
  items: MirrorHallItem[];
}

export interface MirrorHallProps {
  content: MirrorHallContent;
}

const pad = (n: number) => String(n).padStart(2, "0");

const DOT_W = 0.3; // rem — inactive progress dot
const DOT_W_ON = 1.4; // rem — active dot, bloomed into a capsule

export const MirrorHall = ({ content }: MirrorHallProps) => {
  const { labelId, kicker, kickerAccent, heading, tagline, hint, sceneLabel, items } =
    content;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelLayerRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState(0);
  const [nudged, setNudged] = useState(false);

  // Intro reveal — kicker, tagline, focus caption, hint, staggered as the section
  // scrolls in. The heading runs its own per-letter cascade via <AnimatedHeading>.
  const { p, rootRef, localProg } = useRevealCascade<HTMLElement>(4);
  // Caption swap — replays 0→1 whenever a different card reaches the front.
  const { swap, previous: prevFocus } = useSwapReveal(focus);

  const handleFocus = useCallback((index: number) => setFocus(index), []);
  const handleFirstDrag = useCallback(() => setNudged(true), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const labelLayer = labelLayerRef.current;
    if (!canvas || !labelLayer) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let handle: MirrorHallHandle | null = null;
    try {
      handle = createMirrorHall(canvas, {
        cards: items.map((item) => ({ image: item.image, title: item.name })),
        reducedMotion,
        labelLayer,
        onFocusChange: handleFocus,
        onFirstDrag: handleFirstDrag,
      });
    } catch {
      // No WebGL / context creation failed — the black stage and its HUD stay,
      // and the card list below is still readable.
    }
    return () => handle?.dispose();
  }, [items, handleFocus, handleFirstDrag]);

  const dotWidth = (i: number) =>
    swap.to((v) => {
      if (i === focus) return `${DOT_W + (DOT_W_ON - DOT_W) * v}rem`;
      if (i === prevFocus) return `${DOT_W_ON - (DOT_W_ON - DOT_W) * v}rem`;
      return `${DOT_W}rem`;
    });

  return (
    <section
      ref={rootRef}
      aria-labelledby={labelId}
      className="relative h-lvh w-full overflow-hidden bg-mh-void text-mh-fg"
    >
      <canvas
        ref={canvasRef}
        role="img"
        aria-label={sceneLabel}
        // touch-pan-y (not `none`): a horizontal drag spins the ring while a vertical
        // swipe still scrolls the page past the section.
        className="absolute inset-0 block h-full w-full touch-pan-y"
      />
      {/* CSS3D card labels — real DOM in 3D perspective, injected by the scene.
          Hidden from assistive tech; the same titles are listed below. */}
      <div
        ref={labelLayerRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
      />

      {/* HUD — never intercepts the pointer, so the canvas stays draggable. */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div
          aria-hidden="true"
          className="mirror-hall-vignette absolute inset-0"
        />
        <animated.div
          aria-hidden="true"
          className="absolute inset-4 rounded-sm border border-mh-hairline/10 sm:inset-6"
          style={{ opacity: p.to((v) => localProg(v, 0)) }}
        >
          <span className="absolute -left-px -top-px block size-2 border-l border-t border-mh-hairline/50" />
          <span className="absolute -bottom-px -right-px block size-2 border-b border-r border-mh-hairline/50" />
        </animated.div>

        <header className="absolute inset-x-0 top-12 mx-auto w-[92%] text-center lg:top-16">
          <animated.p
            className="mb-4 text-[0.625rem] uppercase tracking-[0.42em] text-mh-muted/55"
            style={{
              opacity: p.to((v) => localProg(v, 0)),
              transform: p.to((v) => `translateY(${(1 - localProg(v, 0)) * -0.75}rem)`),
            }}
          >
            {kicker} <b className="font-semibold text-mh-accent">{kickerAccent}</b>
          </animated.p>
          <AnimatedHeading
            as="h2"
            id={labelId}
            className="text-[2rem] font-light leading-none tracking-wide text-mh-fg sm:text-[3rem] lg:text-[4.125rem]"
          >
            {heading}
          </AnimatedHeading>
          <animated.p
            className="mx-auto mt-4 max-w-2xl text-sm font-light tracking-wide text-mh-muted/60"
            style={{ opacity: p.to((v) => localProg(v, 1)) }}
          >
            {tagline}
          </animated.p>
        </header>

        {/* Focus caption — mirrors the card at front-and-centre. */}
        <animated.div
          className="absolute inset-x-0 bottom-8 mx-auto flex w-[92%] flex-col items-center gap-3 lg:bottom-16"
          style={{
            opacity: p.to((v) => localProg(v, 2)),
            transform: p.to((v) => `translateY(${(1 - localProg(v, 2)) * 0.875}rem)`),
          }}
        >
          <p className="flex items-baseline gap-1.5 text-xs tabular-nums tracking-[0.16em]">
            <animated.span
              className="text-sm font-medium text-mh-accent"
              style={{ opacity: swap.to((v) => 0.35 + 0.65 * v) }}
            >
              {pad(focus + 1)}
            </animated.span>
            <span className="text-mh-muted/35">/</span>
            <span className="text-mh-muted/50">{pad(items.length)}</span>
          </p>
          <animated.p
            className="text-xl font-light uppercase tracking-[0.12em] text-mh-fg sm:text-2xl lg:text-[2.125rem]"
            style={{
              opacity: swap,
              transform: swap.to((v) => `translateY(${(1 - v) * 0.5625}rem)`),
              filter: swap.to((v) => `blur(${(1 - v) * 5}px)`),
            }}
          >
            {items[focus].name}
          </animated.p>
          <p aria-hidden="true" className="mt-0.5 flex items-center gap-2">
            {items.map((item, i) => (
              <animated.span
                key={item.name}
                className={`block h-1 rounded-full ${
                  i === focus
                    ? "bg-mh-accent shadow-[0_0_0.75rem_var(--mh-accent)]"
                    : "bg-mh-hairline/25"
                }`}
                style={{ width: dotWidth(i) }}
              />
            ))}
          </p>
        </animated.div>

        {/* Drag hint — retires for good after the first drag. */}
        <animated.p
          className="absolute bottom-8 right-8 hidden items-center gap-2 text-[0.625rem] uppercase tracking-[0.26em] text-mh-muted/50 sm:flex lg:bottom-16 lg:right-14"
          style={{ opacity: p.to((v) => (nudged ? 0 : localProg(v, 3))) }}
        >
          <span aria-hidden="true" className="block h-px w-6 bg-mh-muted/40" />
          {hint}
        </animated.p>
      </div>

      {/* The rotunda is a canvas and its 3D labels are hidden, so the portfolio
          itself is listed here for assistive tech and crawlers. */}
      <ul className="sr-only">
        {items.map((item) => (
          <li key={item.name}>{item.name}</li>
        ))}
      </ul>
    </section>
  );
};
