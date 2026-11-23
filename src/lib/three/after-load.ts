// 📖 Docs: obsidian/meta/decisions-log.md ADR-0014 · optimization D-029 wave 9
//
// Runs scene set-up steps after the page's `load`, one step per idle moment —
// for scenes far below the fold (the chain, the footer heart). Each WebGL
// context, PMREM environment and shader compile is a main-thread task of its
// own; built at hydration they all landed in one ~480 ms task on a
// 4x-throttled phone, together with the hero. The scenes are sticky sections
// several screens down, so they are ready long before anyone scrolls there.
//
// Idle-callback ids and timeout ids are separate counters: each id is kept
// with its kind and cancelled with the matching function (Pitfalls: vesper).

type Pending = { kind: "idle"; id: number } | { kind: "timeout"; id: number } | null;

/** Longest wait for an idle moment before a step runs anyway. */
const IDLE_TIMEOUT = 2000;

export function runAfterLoad(steps: Array<() => void>): () => void {
  let pending: Pending = null;
  let cancelled = false;
  let index = 0;

  const schedule = () => {
    if (cancelled || index >= steps.length) return;
    if (typeof window.requestIdleCallback === "function") {
      pending = { kind: "idle", id: window.requestIdleCallback(runNext, { timeout: IDLE_TIMEOUT }) };
    } else {
      pending = { kind: "timeout", id: window.setTimeout(runNext, 50) };
    }
  };
  const runNext = () => {
    pending = null;
    if (cancelled) return;
    const step = steps[index++];
    step?.();
    schedule();
  };
  const onLoad = () => schedule();

  if (document.readyState === "complete") schedule();
  else window.addEventListener("load", onLoad, { once: true });

  return () => {
    cancelled = true;
    window.removeEventListener("load", onLoad);
    if (pending?.kind === "idle") window.cancelIdleCallback(pending.id);
    if (pending?.kind === "timeout") window.clearTimeout(pending.id);
    pending = null;
  };
}
