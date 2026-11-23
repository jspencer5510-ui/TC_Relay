"use client";

// WebGL backdrop for the site footer: the hero "mesh gradient" (same blue as the
// hero/chain, a different seed → different blob pattern) with a chrome heart model
// that flies in with parallax and floats, front to the camera. The heart
// reuses the chain's scene factory, so it inherits the exact same chrome material;
// its vertical position is driven off the footer's scroll position (flies from the
// top edge down to centre as the footer scrolls fully into view); it never turns
// (`motion: "float"` — a slow bob and ±12° sway; it used to spin a full turn, and
// side-on its open shell showed the inside — owner review). Two stacked canvases behind the footer
// content, decorative (aria-hidden). See ADR-0014.
import { useEffect, useRef } from "react";
import { subscribeToTicker } from "@/lib/animation/ticker";
import { type GradientBackgroundHandle } from "@/lib/three/gradient-background-scene";
import {
  defaultChainMaterial,
  type ChainSceneHandle,
} from "@/lib/three/chain-scene";
import { useRobot } from "@/components/common/robot-view";
import { runAfterLoad } from "@/lib/three/after-load";
import { mountChainScene, mountGradientBackground } from "@/lib/three/scene-host";

// Same blue palette as the hero/chain; a new seed → a different blob pattern.
/* Thinking Christian palette: brand orange field, pale-orange glow. */
const BASE = "#db4a2b";
const LIGHT = "#f7e4de";
const SEED = 7.2;
const MODEL_URL = "/assets/heart.glb";

// Absolute document offset of an element (walks offsetParent).
const absoluteTop = (el: HTMLElement) => {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
};

export const FooterScene = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const robot = useRobot();
  const bgRef = useRef<HTMLCanvasElement>(null);
  const modelRef = useRef<HTMLCanvasElement>(null);
  const fallRef = useRef(0.5); // heart progress: 0 = above, .5 = centre

  useEffect(() => {
    const bg = bgRef.current;
    const model = modelRef.current;
    // The robot form (D-016) builds no WebGL: the section's CSS backdrop stands.
    if (!bg || !model || robot) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let bgHandle: GradientBackgroundHandle | undefined;
    let modelHandle: ChainSceneHandle | undefined;
    // Built after `load`, one scene per idle moment (see after-load.ts) — the
    // footer is the last screen; its two contexts and the heart's environment
    // were part of one ~480 ms hydration task on phones.
    // On phones both render in a worker (lib/three/scene-host, D-031).
    const cancelBuild = runAfterLoad([
      () => {
        try {
          bgHandle = mountGradientBackground(bg, {
            base: BASE,
            light: LIGHT,
            seed: SEED,
          });
        } catch {
          /* no WebGL — the footer's solid fallback background shows */
        }
      },
      () => {
        try {
          modelHandle = mountChainScene(model, {
            url: MODEL_URL,
            progress: () => fallRef.current,
            reducedMotion,
            material: defaultChainMaterial,
            // no turn: seen side-on the heart's open shell showed its inside
            // (owner review) — it floats, front to the camera
            motion: "float",
            fitWidth: 0.82, // a phone's narrow canvas: the whole heart in view
          });
        } catch {
          /* no WebGL — the gradient backdrop stays */
        }
      },
    ]);

    let absTop = wrapRef.current ? absoluteTop(wrapRef.current) : 0;
    const measure = () => {
      if (wrapRef.current) absTop = absoluteTop(wrapRef.current);
    };
    window.addEventListener("resize", measure);

    const unsubscribe = subscribeToTicker(
      () => {
        const vh = window.innerHeight || 1;
        const y = window.scrollY;
        // Fly in with parallax: 0 (above the frame) as the footer's top edge enters
        // from the bottom → .5 (centred) once the footer has scrolled fully into view.
        const enter = Math.min(Math.max((y - (absTop - vh)) / vh, 0), 1);
        fallRef.current = 0.5 * enter;
      },
      () => 0,
    );

    return () => {
      cancelBuild();
      unsubscribe();
      window.removeEventListener("resize", measure);
      modelHandle?.dispose();
      bgHandle?.dispose();
    };
  }, [robot]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
    >
      <canvas ref={bgRef} className="absolute inset-0 block h-full w-full" />
      <canvas ref={modelRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
};
