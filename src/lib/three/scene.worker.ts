// 📖 Docs: optimization D-031 — stride mobile scroll · lib/three/scene-host.ts
//
// Renders the below-the-fold scenes (the chain, the footer heart and their
// gradient backdrops) on OffscreenCanvases, off the page's main thread, on
// phones. Their set-up — WebGL contexts, the PMREM environment, three r143's
// synchronous program-link reads — was 130–840 ms of main-thread frames in the
// first seconds of a phone's scroll (traced 2026-10-05). The page posts sizes,
// visibility and each frame's fall progress + scroll position; a scene that
// fails to start posts `{ type: "error", id }` and the CSS backdrop stands.

import {
  createChainCore,
  type ChainCore,
  type ChainMaterialConfig,
} from "./chain-scene";
import {
  createGradientCore,
  type GradientBackgroundColors,
  type GradientCore,
} from "./gradient-background-scene";
import { WORKER_FRAME_MS } from "./frame-cap";

interface Size {
  width: number;
  height: number;
  pixelRatio: number;
}

export type SceneWorkerMessage =
  | ({
      type: "gradient";
      id: number;
      canvas?: OffscreenCanvas;
      colors: GradientBackgroundColors;
    } & Size)
  | ({
      type: "chain";
      id: number;
      canvas?: OffscreenCanvas;
      url: string;
      dracoPath: string;
      reducedMotion: boolean;
      material: ChainMaterialConfig;
      spinDirection: number;
      scrollSpin: boolean;
      spinAccel?: number;
      maxSpin?: number;
      motion?: "spin" | "float";
      fitWidth?: number;
      progress: number;
      scrollY: number;
    } & Size)
  | ({ type: "resize"; id: number } & Size)
  | { type: "run"; id: number; on: boolean }
  | { type: "state"; id: number; progress: number; scrollY: number }
  | { type: "material"; id: number; material: ChainMaterialConfig }
  | { type: "colors"; id: number; colors: GradientBackgroundColors }
  | { type: "dispose"; id: number };

// A dedicated worker has requestAnimationFrame in current Chromium; where it
// doesn't, a 60 Hz timer stands in.
const frameApi = self as unknown as {
  requestAnimationFrame?: (callback: (time: number) => void) => number;
  cancelAnimationFrame?: (handle: number) => void;
};
const requestFrame = (callback: (time: number) => void): number =>
  frameApi.requestAnimationFrame
    ? frameApi.requestAnimationFrame(callback)
    : (setTimeout(() => callback(performance.now()), 16) as unknown as number);
const cancelFrame = (handle: number) =>
  frameApi.cancelAnimationFrame
    ? frameApi.cancelAnimationFrame(handle)
    : clearTimeout(handle);

/** Canvases are transferred once and kept, so a remount can draw on them again. */
const canvases = new Map<number, OffscreenCanvas>();
const gradients = new Map<number, GradientCore>();
const chains = new Map<
  number,
  { core: ChainCore; state: { progress: number; scrollY: number } }
>();

const fail = (id: number) => self.postMessage({ type: "error", id });

self.onmessage = (event: MessageEvent<SceneWorkerMessage>) => {
  const m = event.data;
  if ((m.type === "gradient" || m.type === "chain") && m.canvas)
    canvases.set(m.id, m.canvas);
  switch (m.type) {
    case "gradient": {
      const canvas = canvases.get(m.id);
      if (!canvas) return fail(m.id);
      try {
        gradients.set(m.id, createGradientCore({ ...m, canvas }));
      } catch {
        fail(m.id);
      }
      return;
    }
    case "chain": {
      const canvas = canvases.get(m.id);
      if (!canvas) return fail(m.id);
      const state = { progress: m.progress, scrollY: m.scrollY };
      try {
        const core = createChainCore({
          ...m,
          canvas,
          progress: () => state.progress,
          scrollY: () => state.scrollY,
          frameMs: WORKER_FRAME_MS, // at most 60 fps (lib/three/frame-cap)
          warmDraw: true, // off the page's thread, the warm-up draw costs the page nothing
          requestFrame,
          cancelFrame,
        });
        chains.set(m.id, { core, state });
      } catch {
        fail(m.id);
      }
      return;
    }
    case "resize":
      gradients.get(m.id)?.resize(m.width, m.height);
      chains.get(m.id)?.core.resize(m.width, m.height, m.pixelRatio, WORKER_FRAME_MS);
      return;
    case "run":
      chains.get(m.id)?.core.setRunning(m.on);
      return;
    case "state": {
      const chain = chains.get(m.id);
      if (!chain) return;
      chain.state.progress = m.progress;
      chain.state.scrollY = m.scrollY;
      return;
    }
    case "material":
      chains.get(m.id)?.core.update(m.material);
      return;
    case "colors":
      gradients.get(m.id)?.update(m.colors);
      return;
    case "dispose":
      gradients.get(m.id)?.dispose();
      gradients.delete(m.id);
      chains.get(m.id)?.core.dispose();
      chains.delete(m.id);
      return;
  }
};
