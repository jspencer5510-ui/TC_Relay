"use client";

// Feature hook for <MirrorHall>'s focus caption: replays a 0→1 value every time the
// focused card changes, so the outgoing title can fade/blur out while the incoming one
// settles. Driven from the shared ticker rather than a self-running spring — those
// don't progress in this project (see [[decisions-log]] ADR-0015). Reduced motion
// swaps instantly.
import { useEffect, useRef, useState } from "react";
import { useSpring, type SpringValue } from "@react-spring/web";
import { subscribeToTicker } from "@/lib/animation/ticker";

const DURATION = 500; // ms per swap
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export interface SwapReveal {
  /** 0 at the moment of the swap → 1 once the new value has settled. */
  swap: SpringValue<number>;
  /** The key that was focused before this one (−1 until the first swap). */
  previous: number;
}

export function useSwapReveal(key: number): SwapReveal {
  const [{ swap }, api] = useSpring(() => ({ swap: 1 }));
  const mountedRef = useRef(false);
  // Remember the outgoing key so the caller can style both the incoming and the
  // outgoing item from one value. React's "derive state from a change during render"
  // pattern — a ref can't be read here, and an effect would land a frame late.
  const [seen, setSeen] = useState({ key, previous: -1 });
  if (seen.key !== key) setSeen({ key, previous: seen.key });

  useEffect(() => {
    // The first key is the initial state, not a swap — it starts fully revealed.
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      api.start({ swap: 1, immediate: true });
      return;
    }
    let t0: number | null = null;
    let done = false;
    let unsubscribe = () => {};
    api.start({ swap: 0, immediate: true });
    unsubscribe = subscribeToTicker(
      (time) => {
        if (done) return;
        if (t0 === null) t0 = time;
        const t = Math.min((time - t0) / DURATION, 1);
        api.start({ swap: easeOutCubic(t), immediate: true });
        if (t >= 1) {
          done = true;
          unsubscribe();
        }
      },
      () => 0,
    );
    return () => {
      done = true;
      unsubscribe();
    };
  }, [key, api]);

  return { swap, previous: seen.previous };
}
