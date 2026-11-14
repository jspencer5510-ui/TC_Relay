/** 07 Signals — Figma 3488:22342. Copy is verbatim from the frame. */

/**
 * One heatmap bar (Load 3488:22353…22414): the RGB channels and the start/end
 * alpha of its left → right gradient. Light re-theme (ADR-0031): every bar is
 * the brand stone; the frame's per-bar brightness is folded into the alpha
 * (busiest bar = the frame's alpha), so the load pattern reads the same.
 */
export type SignalsLoad = readonly [
  r: number,
  g: number,
  b: number,
  alphaFrom: number,
  alphaTo: number,
];

export const signalsMock = {
  head: {
    badge: "daily view",
    title: { before: "A ", accent: "Tuesday", after: ", seen from Relay." },
    aside:
      "The screen people actually keep open: what ran, what is queued, and who still owes an answer.",
  },
  week: {
    title: "this week, run by run",
    nextRun: "next run in 12 min",
    /** Shorter chip copy in the 1024 frame (3603:3832). */
    nextRunNarrow: "next in 12 min",
    hours: ["09", "11", "13", "15"],
    /** Hour label drawn in the muted colour (the row holding today's peak). */
    activeHour: "13",
    /** Day whose bars carry the accent bar and the today rule. */
    today: "tue",
    /** Index (top → bottom) of the accent bar in today's column. */
    todayPeak: 4,
    days: [
      {
        label: "mon",
        loads: [
          [171, 168, 163, 0.33, 0.14],
          [171, 168, 163, 0.45, 0.19],
          [171, 168, 163, 0.56, 0.24],
          [171, 168, 163, 0.65, 0.28],
          [171, 168, 163, 0.61, 0.26],
          [171, 168, 163, 0.5, 0.21],
          [171, 168, 163, 0.39, 0.17],
          [171, 168, 163, 0.3, 0.13],
        ],
      },
      {
        label: "tue",
        loads: [
          [171, 168, 163, 0.37, 0.16],
          [171, 168, 163, 0.5, 0.21],
          [171, 168, 163, 0.64, 0.26],
          [171, 168, 163, 0.76, 0.32],
          [171, 168, 163, 0.0, 0.0],
          [171, 168, 163, 0.65, 0.28],
          [171, 168, 163, 0.45, 0.19],
          [171, 168, 163, 0.33, 0.14],
        ],
      },
      {
        label: "wed",
        loads: [
          [171, 168, 163, 0.32, 0.13],
          [171, 168, 163, 0.44, 0.19],
          [171, 168, 163, 0.54, 0.22],
          [171, 168, 163, 0.64, 0.26],
          [171, 168, 163, 0.6, 0.25],
          [171, 168, 163, 0.47, 0.2],
          [171, 168, 163, 0.36, 0.15],
          [171, 168, 163, 0.29, 0.12],
        ],
      },
      {
        label: "thu",
        loads: [
          [171, 168, 163, 0.36, 0.15],
          [171, 168, 163, 0.47, 0.2],
          [171, 168, 163, 0.6, 0.25],
          [171, 168, 163, 0.72, 0.3],
          [171, 168, 163, 0.64, 0.26],
          [171, 168, 163, 0.52, 0.22],
          [171, 168, 163, 0.41, 0.17],
          [171, 168, 163, 0.3, 0.13],
        ],
      },
      {
        label: "fri",
        loads: [
          [171, 168, 163, 0.3, 0.13],
          [171, 168, 163, 0.41, 0.17],
          [171, 168, 163, 0.52, 0.22],
          [171, 168, 163, 0.61, 0.26],
          [171, 168, 163, 0.54, 0.22],
          [171, 168, 163, 0.44, 0.19],
          [171, 168, 163, 0.33, 0.14],
          [171, 168, 163, 0.27, 0.11],
        ],
      },
      {
        label: "sat",
        loads: [
          [171, 168, 163, 0.19, 0.08],
          [171, 168, 163, 0.21, 0.09],
          [171, 168, 163, 0.24, 0.1],
          [171, 168, 163, 0.25, 0.1],
          [171, 168, 163, 0.24, 0.1],
          [171, 168, 163, 0.21, 0.09],
          [171, 168, 163, 0.19, 0.08],
          [171, 168, 163, 0.18, 0.08],
        ],
      },
      {
        label: "sun",
        loads: [
          [171, 168, 163, 0.18, 0.08],
          [171, 168, 163, 0.19, 0.08],
          [171, 168, 163, 0.22, 0.09],
          [171, 168, 163, 0.24, 0.1],
          [171, 168, 163, 0.22, 0.09],
          [171, 168, 163, 0.21, 0.09],
          [171, 168, 163, 0.19, 0.08],
          [171, 168, 163, 0.17, 0.07],
        ],
      },
    ],
  },
  handsOff: {
    title: "hands off",
    value: "82%",
    caption: "of steps finish without a person in the loop",
  },
  waiting: {
    title: "waiting on people",
    faces: [
      "/assets/signals/signals-face-1.png",
      "/assets/signals/signals-face-2.png",
      "/assets/signals/signals-face-3.png",
      "/assets/signals/signals-face-4.png",
      "/assets/signals/signals-face-5.png",
    ],
    count: "3",
    countLabel: "approvals",
    note: "Longest wait: 26 minutes, in #finance",
  },
  failures: {
    title: "failures and recoveries",
    chartLabel: "Recovered and failed-hard runs crossing over the week",
    legend: { recovered: "recovered", failed: "failed hard" },
  },
  regions: {
    title: "where it ran",
    mapLabel: "Dot map of run regions: iad 46%, fra 38%, syd 16%",
    markers: [
      { id: "iad", label: "iad 46%" },
      { id: "fra", label: "fra 38%" },
      { id: "syd", label: "syd 16%" },
    ],
    caption: "Every run stays in the region that started it",
  },
} as const;

export type SignalsContent = typeof signalsMock;
