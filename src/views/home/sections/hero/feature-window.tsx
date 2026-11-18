"use client";

import { animated, useTransition } from "@react-spring/web";
import Image from "next/image";
import {
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type PointerEvent,
} from "react";

import { PillButton } from "@/components/ui/pill-button";
import { Reveal } from "@/components/ui/reveal";
import type { HeroContent } from "@/data/mocks/home/hero";
import { SPRING } from "@/lib/motion";

import { LOAD } from "./timeline";

type FeatureWindowProps = HeroContent["feature"];

const REDUCE = "(prefers-reduced-motion: reduce)";
/** A horizontal drag this far (px) on a touch screen changes the slide. */
const SWIPE = 40;

/** The window box per frame — the Relay product window's (3542:24365, 3699:3,
    3834:893, 3957:695). Shared by the glass and its gradient ring. */
const BOX =
  "absolute top-11 left-190 h-156 w-170 rounded-l-hero-window w1024:top-6.75 w1024:left-127 w1024:h-164.75 w1024:w-129 w768:top-88.5 w768:left-31.5 w768:h-147.5 w768:rounded-r-hero-window w390:top-105.5 w390:left-5 w390:h-128.75 w390:w-87.5";

const pad = (n: number) => String(n).padStart(2, "0");

/** Round 32 glass button in the window's top bar. */
const Arrow = ({
  dir,
  label,
  onClick,
}: {
  dir: "prev" | "next";
  label: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    aria-label={label}
    onClick={onClick}
    className="flex size-8 cursor-pointer items-center justify-center rounded-full border border-hero-zoom-border bg-hero-zoom-fill text-foreground-muted transition-colors duration-(--motion-fast) ease-entrance hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent"
  >
    <svg aria-hidden viewBox="0 0 16 16" className={`size-4 ${dir === "prev" ? "rotate-180" : ""}`}>
      <path
        d="M6 3.5 10.5 8 6 12.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </button>
);

/**
 * Featured panel (owner, 2026-11-18; ADR-0034) — the Relay hero's glass
 * product window kept as a box at the same place and size at every frame, its
 * workflow canvas replaced by a three-item showcase: image, kind, title, one
 * line, CTA. Arrows and dots in the top bar, ←/→ when focus is inside, a
 * horizontal swipe on touch. Slides cross-fade with a 24px slide on a spring;
 * reduced motion swaps them instantly. No autoplay — it moves only when asked.
 * The box itself stays still (owner, 2026-11-18): no cursor tilt, no
 * parallax layers, no grid-wave entrance — only the content fade on load and
 * the slide change.
 */
export const FeatureWindow = ({ label, items }: FeatureWindowProps) => {
  const [[index, dir], setState] = useState<[number, 1 | -1]>([0, 1]);
  const count = items.length;
  const regionId = useId();
  const start = useRef<{ x: number; y: number } | null>(null);

  const reduce = useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCE);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );

  const go = (to: number, d: 1 | -1) =>
    setState([(to + count) % count, d]);
  const next = () => go(index + 1, 1);
  const prev = () => go(index - 1, -1);

  const slides = useTransition(index, {
    key: index,
    from: { o: 0, x: 24 * dir },
    enter: { o: 1, x: 0 },
    leave: { o: 0, x: -24 * dir },
    config: SPRING,
    immediate: reduce,
    initial: null,
  });

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  // touch swipe — mouse users have the arrows; `touch-pan-y` keeps the page scrolling
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const s = start.current;
    start.current = null;
    if (!s) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(e.clientY - s.y)) {
      if (dx < 0) next();
      else prev();
    }
  };

  const current = items[index];

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="pointer-events-auto"
      >
        <div
          className={`${BOX} overflow-clip border border-transparent [background:var(--hero-window-surface)] backdrop-blur-hero-window`}
        >
          <Image
            src="/assets/hero/hero-canvas-grid.svg"
            alt=""
            width={680}
            height={624}
            className="absolute -top-px -left-px h-156 w-170 max-w-none opacity-60 w1024:h-164.75 w1024:w-129 w768:-top-9 w768:h-147.5 w390:-top-18.25 w390:w-87.5"
          />

          <Reveal
            variant="fade"
            delay={LOAD.chrome}
            className="relative flex size-full flex-col px-9.75 pb-6 w1024:px-5.75 w1024:pb-5.75 w390:px-4.75 w390:pb-4.75"
          >
            {/* Top bar — the window's title / meta / controls row */}
            <div className="flex h-21.75 shrink-0 items-center gap-4 border-b border-hero-rule w1024:h-15.75 w390:gap-3">
              <p className="text-body leading-body whitespace-nowrap text-foreground-muted">
                {label}
              </p>
              <span aria-hidden className="h-3.5 w-px bg-hero-bar-divider w390:hidden" />
              <p className="font-sans tabular-nums text-label leading-label whitespace-nowrap text-hero-ink w390:hidden">
                {pad(index + 1)} / {pad(count)}
              </p>
              <div className="ml-auto flex items-center gap-3 w390:gap-2">
                <ul className="flex items-center gap-1.5" aria-label="Choose a featured item">
                  {items.map((item, i) => (
                    <li key={item.title}>
                      <button
                        type="button"
                        aria-label={`${item.kind}: ${item.title}`}
                        aria-current={i === index ? "true" : undefined}
                        aria-controls={regionId}
                        onClick={() => go(i, i >= index ? 1 : -1)}
                        className="flex h-8 cursor-pointer items-center px-0.5"
                      >
                        <span
                          className={`block h-1 w-6 origin-left rounded-full transition-[scale,background-color] duration-(--motion-fast) ease-entrance ${i === index ? "bg-accent" : "scale-x-50 bg-hero-bar-divider"}`}
                        />
                      </button>
                    </li>
                  ))}
                </ul>
                <Arrow dir="prev" label="Previous featured item" onClick={prev} />
                <Arrow dir="next" label="Next featured item" onClick={next} />
              </div>
            </div>

            {/* Slides — stacked in one grid cell so the leaving and entering ones overlap */}
            <div
              id={regionId}
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
              onPointerCancel={() => (start.current = null)}
              className="relative grid min-h-0 flex-1 touch-pan-y pt-4.25 w1024:pt-5 w390:pt-4"
            >
              {slides((style, i) => {
                const item = items[i];
                return (
                  <animated.article
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}`}
                    aria-hidden={i !== index}
                    inert={i !== index}
                    className="col-start-1 row-start-1 flex min-h-0 flex-col items-start [&>*]:shrink-0"
                    style={{
                      opacity: style.o,
                      transform: style.x.to((x) => (x === 0 ? "none" : `translate3d(${x}px,0,0)`)),
                    }}
                  >
                    <div className="w-full">
                      <div className={`relative aspect-2/1 w-full overflow-clip rounded-hero-node border border-hero-zoom-border w1024:aspect-16/10 w768:aspect-2/1 ${item.fit === "contain" ? "bg-background" : "bg-surface-raised"}`}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt=""
                            fill
                            sizes="(max-width: 580px) 340px, (max-width: 1200px) 500px, 820px"
                            className={item.fit === "contain" ? "object-contain p-4" : "object-cover"}
                            priority={i === 0}
                          />
                        ) : (
                          <span className="flex size-full items-end bg-accent p-6 text-on-accent w390:p-4">
                            <span className="font-display text-section-title leading-section-title font-medium">
                              {item.title}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="mt-5 text-label leading-label font-semibold tracking-eyebrow text-accent uppercase w390:mt-4">
                      {item.kind}
                    </p>
                    <h2 className="mt-1.5 font-display text-subtitle leading-lead font-medium text-foreground">
                      {item.title}
                    </h2>
                    <p className="mt-1.5 line-clamp-2 text-body leading-body text-foreground-muted w390:line-clamp-3">
                      {item.text}
                    </p>
                    <PillButton
                      href={item.cta.href}
                      className="mt-5 uppercase tracking-badge w390:mt-auto w390:w-full w390:justify-center"
                    >
                      {item.cta.label}
                    </PillButton>
                  </animated.article>
                );
              })}
            </div>
          </Reveal>
        </div>

        {/* The window's gradient stroke, on its own ring over the glass. */}
        <span
          aria-hidden
          className={`${BOX} pointer-events-none border border-transparent [background:var(--hero-window-ring)_border-box] [mask:var(--hero-window-ring-mask)]`}
        />
        <span className="sr-only" aria-live="polite">
          {`${current.kind}: ${current.title}, ${index + 1} of ${count}`}
        </span>
      </div>
    </div>
  );
};
