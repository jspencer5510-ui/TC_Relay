"use client";

// Shared per-item reveal cascade used by <AnimatedHeading>, the About heading, and the
// bento card reveals. Drives one react-spring value `p` 0→1 from the shared ticker
// (react-spring's own self-running springs don't progress in this project — see
// [[decisions-log]] ADR-0015). `localProg(p, i)` gives item `i`'s eased 0→1 progress
// within the staggered timeline. Reduced motion jumps straight to revealed.
//
// Trigger: by default it starts when the observed `rootRef` element scrolls into view.
// Pass `{ startWhen }` (a boolean) to instead start when that flag becomes true — used by
// the hero, which is on-screen behind the preloader rather than scroll-triggered.
//
// The robot form (D-016) is at rest from the server HTML on: `p` starts at 1 and
// the clock never runs. The clock writes `immediate: true` every tick, so the
// robot form's global `skipAnimation` never reached it — the hero's stats,
// insight and CTAs played their 1.4 s fade there, and Lighthouse sampled
// "Request a demo" mid-fade at 1.2:1 (robot A11y 96, desktop and mobile).
import { useEffect, useMemo, useRef } from "react";
import { useSpring, type SpringValue } from "@react-spring/web";
import { useRobot } from "@/components/common/robot-view";
import { subscribeToTicker } from "@/lib/animation/ticker";

const DURATION = 1400; // ms for the whole cascade
const SPREAD = 0.55; // fraction of the timeline over which item starts are staggered
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

export interface RevealCascade<T extends HTMLElement = HTMLElement> {
  p: SpringValue<number>;
  rootRef: React.RefObject<T | null>;
  localProg: (v: number, i: number) => number;
}

export interface RevealCascadeOptions {
  /** When provided, the cascade starts once this flag is true (instead of on scroll-in). */
  startWhen?: boolean;
}

export function useRevealCascade<T extends HTMLElement = HTMLElement>(
  total: number,
  options?: RevealCascadeOptions,
): RevealCascade<T> {
  const rootRef = useRef<T>(null);
  const startedRef = useRef(false);
  const robot = useRobot();
  const [{ p }, api] = useSpring(() => ({ p: robot ? 1 : 0 }));
  const gated = options?.startWhen !== undefined;
  const startWhen = options?.startWhen;

  useEffect(() => {
    if (robot) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let unsubscribe = () => {};
    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      if (reduce) {
        api.start({ p: 1, immediate: true });
        return;
      }
      let t0: number | null = null;
      let done = false;
      unsubscribe = subscribeToTicker(
        (time) => {
          if (done) return;
          if (t0 === null) t0 = time;
          const t = Math.min((time - t0) / DURATION, 1);
          api.start({ p: t, immediate: true });
          if (t >= 1) {
            done = true;
            unsubscribe();
          }
        },
        () => 0,
      );
    };

    // Flag-gated: start once startWhen turns true.
    if (gated) {
      if (startWhen) start();
      return () => unsubscribe();
    }

    // Default: start when the element scrolls into view.
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          start();
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      unsubscribe();
    };
  }, [api, gated, startWhen, robot]);

  const span = 1 - SPREAD;
  const localProg = useMemo(
    () => (v: number, i: number) => {
      const s = total > 1 ? (i / (total - 1)) * SPREAD : 0;
      return easeOutQuart(
        span <= 0 ? 1 : Math.min(Math.max((v - s) / span, 0), 1),
      );
    },
    [total, span],
  );

  return { p, rootRef, localProg };
}
