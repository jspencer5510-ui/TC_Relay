// 📖 Docs: optimization D-031 — stride mobile scroll
//
// Two helpers that keep a scene's set-up off the scroll on a phone.
//
// three r143 reads every program's link status right after linking it
// (`debug.checkShaderErrors`), and that read waits for the GPU process to
// finish compiling: traced on a 4×-throttled phone, the after-load builds of
// the chain and footer scenes spent 45–90 ms each in `GetProgramiv` and
// 75–180 ms blocked on the command buffer — 150–210 ms frames in the first
// seconds of scroll. With the read off, a compile only queues the work, and
// the first draw — scheduled a task later — finds the program linked.
import type * as THREE from "three";

/** Production skips the synchronous link-status read; dev keeps the shader error log. */
export const skipShaderStatusReads = (renderer: THREE.WebGLRenderer): void => {
  if (process.env.NODE_ENV === "production")
    renderer.debug.checkShaderErrors = false;
};

/** Longest wait for an idle moment before the step runs anyway. */
const IDLE_TIMEOUT = 1500;

/** Runs `fn` in an idle moment of its own (a short timer in a worker); returns a cancel. */
export const whenIdle = (fn: () => void): (() => void) => {
  const g = globalThis as typeof globalThis & {
    requestIdleCallback?: Window["requestIdleCallback"];
    cancelIdleCallback?: Window["cancelIdleCallback"];
  };
  if (
    typeof g.requestIdleCallback === "function" &&
    typeof g.cancelIdleCallback === "function"
  ) {
    const id = g.requestIdleCallback(fn, { timeout: IDLE_TIMEOUT });
    return () => g.cancelIdleCallback?.(id);
  }
  const id = setTimeout(fn, 50);
  return () => clearTimeout(id);
};
