// 📖 Docs: optimization D-031 — stride mobile scroll · lib/three/scene.worker.ts
//
// Mounts the chain / footer-heart scenes and their gradient backdrops. On a
// phone they render in one shared worker on OffscreenCanvases, so their set-up
// never lands on the page's thread while someone scrolls; elsewhere (desktop,
// or no OffscreenCanvas) they render here, exactly as before. The handles are
// the same either way.
import { isPhone } from "./frame-cap";
import { subscribeToTicker } from "@/lib/animation/ticker";
import {
  createChainScene,
  type ChainSceneHandle,
  type ChainSceneOptions,
} from "./chain-scene";
import {
  createGradientBackground,
  type GradientBackgroundColors,
  type GradientBackgroundHandle,
} from "./gradient-background-scene";
import type { SceneWorkerMessage } from "./scene.worker";

let worker: Worker | null = null;
let nextId = 1;

const sceneWorker = (): Worker => {
  if (!worker) {
    worker = new Worker(new URL("./scene.worker.ts", import.meta.url), {
      type: "module",
    });
  }
  return worker;
};

/** Phones, where a worker can draw. Decided once per mount. */
const offThread = (canvas: HTMLCanvasElement): boolean =>
  isPhone() &&
  typeof Worker !== "undefined" &&
  typeof OffscreenCanvas !== "undefined" &&
  "transferControlToOffscreen" in canvas;

const sizeOf = (canvas: HTMLCanvasElement) => {
  const r = (canvas.parentElement ?? canvas).getBoundingClientRect();
  return {
    width: Math.max(1, r.width),
    height: Math.max(1, r.height),
    pixelRatio: Math.min(window.devicePixelRatio, 2),
  };
};

/**
 * The worker side of one canvas: its id, the transfer, and resize forwarding.
 * The first message waits a task, so a mount that is undone at once (React's
 * StrictMode double effect) never transfers the canvas.
 */
const workerScene = (
  canvas: HTMLCanvasElement,
  init: (id: number, size: ReturnType<typeof sizeOf>) => SceneWorkerMessage,
) => {
  const id = nextId++;
  const post = (message: SceneWorkerMessage, transfer: Transferable[] = []) =>
    sceneWorker().postMessage(message, transfer);
  let started = false;
  let size = sizeOf(canvas);
  const ro = new ResizeObserver(() => {
    const next = sizeOf(canvas);
    if (
      next.width === size.width &&
      next.height === size.height &&
      next.pixelRatio === size.pixelRatio
    )
      return;
    size = next;
    if (started) post({ type: "resize", id, ...size });
  });
  const start = window.setTimeout(() => {
    started = true;
    size = sizeOf(canvas);
    const offscreen = canvas.transferControlToOffscreen();
    post({ ...init(id, size), canvas: offscreen } as SceneWorkerMessage, [
      offscreen,
    ]);
    ro.observe(canvas.parentElement ?? canvas);
  }, 0);
  return {
    id,
    post: (message: SceneWorkerMessage) => {
      if (started) post(message);
    },
    dispose: () => {
      window.clearTimeout(start);
      ro.disconnect();
      if (started) post({ type: "dispose", id });
    },
  };
};

export function mountGradientBackground(
  canvas: HTMLCanvasElement,
  colors: GradientBackgroundColors,
): GradientBackgroundHandle {
  if (!offThread(canvas)) return createGradientBackground(canvas, colors);
  const scene = workerScene(canvas, (id, size) => ({
    type: "gradient",
    id,
    colors,
    ...size,
  }));
  return {
    update: (next) =>
      scene.post({ type: "colors", id: scene.id, colors: next }),
    dispose: scene.dispose,
  };
}

export function mountChainScene(
  canvas: HTMLCanvasElement,
  options: ChainSceneOptions & {
    material: NonNullable<ChainSceneOptions["material"]>;
  },
): ChainSceneHandle {
  if (!offThread(canvas)) return createChainScene(canvas, options);
  const { progress, ...rest } = options;
  const scene = workerScene(canvas, (id, size) => ({
    type: "chain",
    id,
    ...rest,
    url: new URL(options.url, window.location.href).href,
    dracoPath: new URL("/draco/", window.location.href).href,
    spinDirection: options.spinDirection ?? 1,
    scrollSpin: options.scrollSpin ?? true,
    progress: progress(),
    scrollY: window.scrollY,
    ...size,
  }));

  // While the section is near (the same margin the main-thread scene uses),
  // run the worker's loop and post this frame's fall progress + scroll, only
  // when either has changed.
  let stopTicker: (() => void) | null = null;
  let lastProgress = Number.NaN;
  let lastScroll = Number.NaN;
  const io = new IntersectionObserver(
    ([entry]) => {
      const on = entry.isIntersecting;
      scene.post({ type: "run", id: scene.id, on });
      if (on && !stopTicker) {
        stopTicker = subscribeToTicker(
          () => {
            const p = progress();
            const y = window.scrollY;
            if (p === lastProgress && y === lastScroll) return;
            lastProgress = p;
            lastScroll = y;
            scene.post({
              type: "state",
              id: scene.id,
              progress: p,
              scrollY: y,
            });
          },
          () => 0,
        );
      } else if (!on && stopTicker) {
        stopTicker();
        stopTicker = null;
      }
    },
    { rootMargin: "300px 0px" },
  );
  // Observe after the worker has the canvas, so the first "run" isn't dropped.
  const observe = window.setTimeout(
    () => io.observe(canvas.parentElement ?? canvas),
    0,
  );

  return {
    update: (material) =>
      scene.post({ type: "material", id: scene.id, material }),
    dispose: () => {
      window.clearTimeout(observe);
      io.disconnect();
      stopTicker?.();
      scene.dispose();
    },
  };
}
