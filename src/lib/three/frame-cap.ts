// 📖 Docs: optimization D-031 — "Cap a desktop WebGL scene at 60 fps"
//
// The scenes draw at most 60 fps on desktop. On a 120 Hz panel (ProMotion,
// the scroll test's desktop) each one redrew its whole scene — the hero's
// bloom chain included — every 8.3 ms tick. 12.5 ms sits between a 120 Hz
// tick (8.3 ms) and a 60 Hz one (16.7 ms): a 60 Hz screen keeps every frame
// however its timestamps jitter, a 120 Hz screen draws every other tick.
// Phones keep drawing every tick, as before. Motion that steps per tick keeps
// stepping per tick (see each loop), so its speed is unchanged on any panel.

const DESKTOP_FRAME_MS = 12.5;

/** The same 60 fps cap for the phone scenes drawn in the worker (lib/three/scene.worker):
 *  on a 120 Hz phone their present waits stalled the page's frames at the footer. */
export const WORKER_FRAME_MS = DESKTOP_FRAME_MS;

/** A phone or a touch tablet: drawn every tick, and not warmed ahead. */
export const isPhone = (): boolean =>
  window.innerWidth < 768 ||
  window.matchMedia("(hover: none) and (pointer: coarse)").matches;

/** Minimum ms between drawn frames for this device. */
export const sceneFrameMs = (): number => (isPhone() ? 0 : DESKTOP_FRAME_MS);
