// 📖 Docs: obsidian/architecture/tech-stack.md (three) · decisions-log.md ADR-0014
//
// Loads a GLB model and gives it a chrome material (metal + a PMREM RoomEnvironment
// for reflections). The caller drives its vertical position each frame via
// `progress` (0 = above the top edge, .5 = centred, 1 = below the bottom edge) — so
// the same factory can hold a model dead-centre (constant .5) or fly it in with
// parallax (progress tied to scroll). It always spins; `spinDirection` (+1/−1) flips
// which way. `scrollSpin` picks the feel: true adds scroll momentum (spins at scroll
// speed, capped, easing back to idle), false is a **constant linear** turn at a fixed
// rate. Or, `motion: "float"`, it never turns: front to the camera, a gentle bob
// and a few degrees of sway. Renders on a transparent canvas so the gradient backdrop shows behind it.
// Owns its own rAF loop (WebGL artwork, exempt from ADR-0002). Used by the chain
// (held centred, constant-linear spin) and the footer heart (fly-in, floating).
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { isPhone, sceneFrameMs } from "./frame-cap";
import { skipShaderStatusReads, whenIdle } from "./gl-steps";

/** Tunable chrome-material look for the model (live-editable via the dev panel). */
export interface ChainMaterialConfig {
  color: string; // base tint (hex) — white keeps it a pure mirror
  metalness: number; // 0 = dielectric, 1 = metal
  roughness: number; // 0 = mirror, 1 = matte
  envMapIntensity: number; // strength of the environment reflection
  exposure: number; // renderer tone-mapping exposure (overall brightness)
}

export const defaultChainMaterial: ChainMaterialConfig = {
  color: "#a5ade3",
  metalness: 1,
  roughness: 0.1,
  envMapIntensity: 2.8,
  exposure: 0.2,
};

export interface ChainSceneOptions {
  url: string;
  /** Fall progress 0..1 (read each frame): 0 = above the top edge, 0.5 = centred,
   *  1 = below the bottom edge. */
  progress: () => number;
  reducedMotion: boolean;
  /** Initial chrome-material look. Live changes flow through the handle's update(). */
  material?: ChainMaterialConfig;
  /** Spin sense: +1 (default) or −1 to turn the other way. */
  spinDirection?: number;
  /** true (default): scroll adds spin momentum. false: constant linear spin. */
  scrollSpin?: boolean;
  /** rad added to the spin per px of scroll (momentum injection). Higher = the model
   *  accelerates harder when scrolling. Defaults to `SCROLL_ACCEL`. */
  spinAccel?: number;
  /** rad/frame cap on the scroll-injected spin. Defaults to `MAX_SPIN`. */
  maxSpin?: number;
  /**
   * "spin" (default): the endless turn above. "float": no turn — the model
   * keeps its front to the camera, bobbing gently and swaying a few degrees
   * left and right (the footer heart: turned side-on, its open shell showed
   * its inside — owner review, 2026-10-06).
   */
  motion?: "spin" | "float";
  /**
   * The most of the canvas's width the model may span (0–1). On a narrow
   * canvas it scales down to fit; unset, it keeps its size on any shape (the
   * chain). The footer heart: on a phone it ran off both edges.
   */
  fitWidth?: number;
}

export interface ChainSceneHandle {
  dispose: () => void;
  /** Push a new chrome-material look (colour, metalness, roughness, reflection, exposure). */
  update: (material: ChainMaterialConfig) => void;
}

const IDLE_SPIN = 0.004; // rad/frame — gentle constant turn when idle
const SCROLL_ACCEL = 0.00009; // how much a px of scroll adds to the spin
const FRICTION = 0.965; // momentum decay toward the idle turn
const MAX_SPIN = 0.22; // rad/frame cap so fast scrolls can't spin it wildly
const TILT_X = 0.22; // fixed viewing tilt
const FALL_TOP = 9; // world Y above the frame at progress 0
const FALL_BOTTOM = -9; // world Y below the frame at progress 1
// "float": slow, time-based (any refresh rate), front always to the camera
const FLOAT_YAW = 0.21; // rad — ±12° sway left and right
const FLOAT_YAW_PERIOD = 7; // s per sway, there and back
const FLOAT_BOB = 0.12; // world units up and down (~3 % of the model's height)
const FLOAT_BOB_PERIOD = 4.6; // s per bob — out of step with the sway
const FLOAT_ROLL = 0.035; // rad — a hint of roll with the sway (±2°)

/** What the chain scene needs — no DOM, so it also runs in a worker (scene.worker). */
export interface ChainCoreOptions extends Omit<ChainSceneOptions, "progress"> {
  canvas: HTMLCanvasElement | OffscreenCanvas;
  width: number;
  height: number;
  pixelRatio: number;
  /** Absolute URL of the Draco decoder folder. */
  dracoPath: string;
  /** Fall progress, read each drawn frame. */
  progress: () => number;
  /** The page's scroll position, read each tick (scroll-injected spin). */
  scrollY: () => number;
  /** Minimum ms between drawn frames (lib/three/frame-cap). */
  frameMs: number;
  /** Draw one frame as soon as the model is in (desktop: warms the first draw). */
  warmDraw: boolean;
  requestFrame: (callback: (time: number) => void) => number;
  cancelFrame: (handle: number) => void;
}

export interface ChainCore extends ChainSceneHandle {
  /** Run or pause the render loop (the host knows whether the section is near). */
  setRunning: (on: boolean) => void;
  resize: (
    width: number,
    height: number,
    pixelRatio: number,
    frameMs: number,
  ) => void;
}

export function createChainCore({
  canvas,
  width,
  height,
  pixelRatio,
  url,
  dracoPath,
  progress,
  scrollY,
  frameMs,
  warmDraw,
  requestFrame,
  cancelFrame,
  reducedMotion,
  material = defaultChainMaterial,
  spinDirection = 1,
  scrollSpin = true,
  spinAccel = SCROLL_ACCEL,
  maxSpin = MAX_SPIN,
  motion = "spin",
  fitWidth,
}: ChainCoreOptions): ChainCore {
  let w = Math.max(1, width);
  let h = Math.max(1, height);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas as HTMLCanvasElement,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = material.exposure;
  skipShaderStatusReads(renderer);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 100);
  camera.position.set(0, 0, 8);
  /** The model's fitted size, world units (see `model.scale` below). */
  const MODEL_SIZE = 3.6;

  let disposed = false;

  // Chrome environment — a soft studio room, prefiltered for metal reflections.
  // Built in an idle moment of its own (D-031): its blur passes compile and
  // draw on the GPU, and inside the scene's creation task they made it one
  // long frame on a phone. The model arrives later still (fetch + Draco).
  let envRT: THREE.WebGLRenderTarget | null = null;
  const pending: Array<() => void> = [];
  pending.push(
    whenIdle(() => {
      if (disposed) return;
      const pmrem = new THREE.PMREMGenerator(renderer);
      envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
      scene.environment = envRT.texture;
      pmrem.dispose();
    }),
  );

  const key = new THREE.DirectionalLight(0xffffff, 2.2);
  key.position.set(4, 6, 5);
  scene.add(key);

  const chrome = new THREE.MeshStandardMaterial({
    color: new THREE.Color(material.color),
    metalness: material.metalness,
    roughness: material.roughness,
    envMapIntensity: material.envMapIntensity,
  });

  const group = new THREE.Group();
  scene.add(group);
  // Width fit (`fitWidth`): the world width the camera sees at the model's
  // depth, and the model scaled down if it would span more than that share.
  const fit = () => {
    if (!fitWidth) return;
    const visible =
      2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect;
    group.scale.setScalar(Math.min(1, (visible * fitWidth) / MODEL_SIZE));
  };
  fit();

  // The GLB is Draco-compressed; decoder files live in public/draco/.
  const draco = new DRACOLoader();
  draco.setDecoderPath(dracoPath);
  const loader = new GLTFLoader();
  loader.setDRACOLoader(draco);

  loader.load(
    url,
    (gltf) => {
      if (disposed) return;
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      model.position.sub(center); // centre on origin
      const maxDim = Math.max(size.x, size.y, size.z) || 1;
      model.scale.setScalar(MODEL_SIZE / maxDim); // fit to ~3.6 world units
      model.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.material = chrome;
      });
      group.add(model);
      // Precompile the chrome shader now (off the main scroll path), so the first
      // frame after the model scrolls into view doesn't hitch on JIT compilation.
      try {
        renderer.compile(scene, camera);
      } catch {
        /* compile is best-effort — the first render will compile if this throws */
      }
      // …and, on desktop, draw one frame in an idle moment after it, while the
      // section is screens away (D-031): `compile` leaves the program link, the
      // geometry upload and the PMREM environment's first sample to the first
      // real draw, which landed as a 100–450 ms frame (main thread idle) when
      // the scene scrolled into view. Not on phones' main thread: there the
      // extra draw at load cost more than it saved (Lighthouse's software GL
      // stalled long enough to fail its robots.txt fetch, TBT up).
      if (warmDraw)
        pending.push(
          whenIdle(() => {
            if (!disposed) render();
          }),
        );
    },
    undefined,
    () => {
      /* model failed to load — the gradient backdrop stays */
    },
  );

  group.rotation.x = TILT_X; // centred; only Y spins (or sways, "float")

  let lastScroll = scrollY();
  let spinVel = 0; // scroll-injected angular momentum

  // Drawing is capped at 60 fps on desktop (lib/three/frame-cap); the step
  // runs every tick and is scaled by dt below.
  let bob = 0;
  const float = (now: number) => {
    const tau = Math.PI * 2;
    const sway = Math.sin((now / 1000 / FLOAT_YAW_PERIOD) * tau);
    group.rotation.y = FLOAT_YAW * sway;
    group.rotation.z = -FLOAT_ROLL * sway;
    bob = FLOAT_BOB * Math.sin((now / 1000 / FLOAT_BOB_PERIOD) * tau);
  };
  // The spin constants are per 60 Hz frame; each tick scales them by its
  // real interval (`k` = 1 at 60 Hz, 0.5 at 120 Hz), so the turn and its
  // momentum keep the same speed on any panel and on the worker's loop alike.
  let lastStep = -1;
  const step = () => {
    const now = performance.now();
    const k =
      lastStep < 0 ? 1 : Math.min(4, Math.max(0, (now - lastStep) / (1000 / 60)));
    lastStep = now;
    if (motion === "float") {
      if (!reducedMotion) float(now);
      return;
    }
    if (!reducedMotion) {
      if (scrollSpin) {
        const sc = scrollY();
        // scroll adds momentum; it eases back toward the idle turn (never stops).
        spinVel = spinVel * Math.pow(FRICTION, k) + (sc - lastScroll) * spinAccel;
        spinVel = Math.max(-maxSpin, Math.min(maxSpin, spinVel)); // cap fast-scroll spin
        lastScroll = sc;
        group.rotation.y += spinDirection * (IDLE_SPIN + spinVel) * k;
      } else {
        // Constant, linear spin — a steady angular velocity, no scroll momentum.
        group.rotation.y += spinDirection * IDLE_SPIN * k;
      }
    }
  };
  const render = () => {
    // Fall from above the top edge, through centre, out the bottom.
    const p = Math.min(Math.max(progress(), 0), 1);
    group.position.y = FALL_TOP + (FALL_BOTTOM - FALL_TOP) * p + bob;
    renderer.render(scene, camera);
  };

  // Visibility-gated render loop. Three WebGL scenes (hero, chain, footer heart) each
  // ran their own rAF forever — rendering continuously even while off-screen was the
  // main cause of scroll jank. Only render while the section is on (or near) screen.
  let raf = 0;
  let running = false;
  let minFrameMs = frameMs;
  let lastDraw = -Infinity;
  const loop = () => {
    step();
    const t = performance.now();
    if (t - lastDraw >= minFrameMs) {
      lastDraw = t;
      render();
    }
    raf = requestFrame(loop);
  };

  return {
    setRunning(on: boolean) {
      if (on === running || disposed) return;
      running = on;
      if (on) {
        lastScroll = scrollY(); // reset so a paused gap doesn't inject a spin spike
        lastStep = -1; // …nor a catch-up turn
        raf = requestFrame(loop);
      } else {
        cancelFrame(raf);
        raf = 0;
      }
    },
    resize(
      nextW: number,
      nextH: number,
      nextRatio: number,
      nextFrameMs: number,
    ) {
      minFrameMs = nextFrameMs;
      renderer.setPixelRatio(nextRatio);
      w = Math.max(1, nextW);
      h = Math.max(1, nextH);
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      fit();
    },
    update(next: ChainMaterialConfig) {
      chrome.color.set(next.color);
      chrome.metalness = next.metalness;
      chrome.roughness = next.roughness;
      chrome.envMapIntensity = next.envMapIntensity;
      renderer.toneMappingExposure = next.exposure;
    },
    dispose() {
      disposed = true;
      if (running) cancelFrame(raf);
      running = false;
      for (const cancel of pending) cancel();
      group.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) mesh.geometry.dispose();
      });
      chrome.dispose();
      draco.dispose();
      envRT?.dispose();
      renderer.dispose();
      // Release the context so a remount (StrictMode/HMR) can attach a fresh
      // renderer to the same canvas instead of failing on the existing context.
      renderer.forceContextLoss();
    },
  };
}

/** The chain scene on this thread: sized to, and run while near, the canvas's parent. */
export function createChainScene(
  canvas: HTMLCanvasElement,
  options: ChainSceneOptions,
): ChainSceneHandle {
  const parent = canvas.parentElement ?? canvas;
  const sizeOf = () => {
    const r = parent.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  };
  const { w, h } = sizeOf();
  const core = createChainCore({
    ...options,
    canvas,
    width: w,
    height: h,
    pixelRatio: Math.min(window.devicePixelRatio, 2),
    url: new URL(options.url, window.location.href).href,
    dracoPath: new URL("/draco/", window.location.href).href,
    scrollY: () => window.scrollY,
    frameMs: sceneFrameMs(),
    warmDraw: !isPhone(),
    requestFrame: (callback) => requestAnimationFrame(callback),
    cancelFrame: (handle) => cancelAnimationFrame(handle),
  });
  const io = new IntersectionObserver(
    ([entry]) => core.setRunning(entry.isIntersecting),
    { rootMargin: "300px 0px" }, // spin up a little before it scrolls into view
  );
  io.observe(parent);
  const ro = new ResizeObserver(() => {
    const s = sizeOf();
    core.resize(s.w, s.h, Math.min(window.devicePixelRatio, 2), sceneFrameMs());
  });
  ro.observe(parent);
  return {
    update: core.update,
    dispose() {
      io.disconnect();
      ro.disconnect();
      core.dispose();
    },
  };
}
