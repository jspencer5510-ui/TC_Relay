/** 02 Hero — Figma 3488:21055. Copy is verbatim from the frame. */
export const heroMock = {
  chip: "open beta / 240 apps connected",
  title: { before: "The handoffs run ", accent: "themselves", after: "." },
  subhead:
    "Relay runs the steps between your apps and only pings a person when it matters.",
  actions: {
    primary: { label: "Start free", href: "#start" },
    secondary: { label: "Watch a build, 2 minutes", href: "#watch" },
  },
  note: "free for 14 days / no card / no call with sales",
  /** The same note as the 1024 frame breaks it (3603:2158, 380 wide, 2 lines). */
  noteLines: ["free for 14 days / no card / no call with", "sales"],
  /** …and as the 390 frame breaks it (3893:2158, 217 wide, 12px, centred). */
  noteLines390: ["free for 14 days / no card /", "no call with sales"],
  window: {
    label: "Relay workflow preview",
    title: "Refunds over 5000",
    meta: "3 steps / 1 branch",
    status: "running",
    zoom: "100%",
    tools: [
      { name: "select", icon: "/assets/hero/hero-tool-select.svg" },
      { name: "add", icon: "/assets/hero/hero-tool-add.svg" },
      { name: "redirect", icon: "/assets/hero/hero-tool-redirect.svg" },
      { name: "code", icon: "/assets/hero/hero-tool-extra.svg" },
    ],
    trigger: { title: "Refund created", source: "stripe" },
    condition: { title: "Amount over 5000", source: "condition" },
    log: { title: "Log to warehouse", source: "postgres" },
    /** Branch labels 3685:11 / 3685:13 on the Refund created fan-out. */
    branches: { yes: "true", no: "else" },
    approval: { title: "Ask finance", source: "waiting on a yes" },
    wait: "26 min",
    runsLabel: "last runs",
    runs: [
      {
        time: "09:41:02",
        name: "refunds over 5000",
        duration: "129 ms",
        live: true,
      },
      {
        time: "09:38:57",
        name: "weekly export",
        duration: "2.1 s",
        live: false,
      },
      {
        time: "09:31:14",
        name: "invoice reminder",
        duration: "410 ms",
        live: false,
      },
    ],
    /** Live feed — new rows reuse these in the Figma row format. */
    runPool: [
      { name: "refunds over 5000", duration: "134 ms" },
      { name: "invoice reminder", duration: "388 ms" },
      { name: "refunds over 5000", duration: "121 ms" },
      { name: "weekly export", duration: "1.9 s" },
      { name: "refunds over 5000", duration: "142 ms" },
      { name: "invoice reminder", duration: "402 ms" },
    ],
    /** Seconds between consecutive live-feed timestamps, cycled. */
    runGaps: [47, 73, 38, 91, 56],
  },
} as const;

export type HeroContent = typeof heroMock;
