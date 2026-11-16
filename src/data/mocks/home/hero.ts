/** 02 Hero — Figma 3488:21055. Copy: thinkingchristian.org homepage (ADR-0032). */
export const heroMock = {
  chip: "Thinking Christian",
  title: { before: "Unsettling convention. Cultivating ", accent: "conviction", after: "." },
  subhead:
    "Reading the Bible as the final authority for life and faith means questioning the assumptions of our culture, even our Christian culture, so that we don't settle for a narrower vision than God's word offers.",
  actions: {
    primary: { label: "Explore the Framework", href: "https://www.thinkingchristian.org/framework" },
    secondary: { label: "Listen to the Podcast", href: "https://www.thinkingchristian.org/podcast" },
  },
  /** Hero book (doc 2026-11-14). `cover`: path under public/ once supplied. */
  book: {
    title: "Digital Discernment",
    author: "James Spencer",
    note: "forthcoming",
    href: "https://www.thinkingchristian.org/digitaldiscernment",
    cover: "/assets/hero/digital-discernment-cover.jpg" as string | null,
  },
  window: {
    label: "The Thinking Christian Framework",
    title: "The Framework",
    meta: "4 practices",
    status: "in action",
    zoom: "100%",
    tools: [
      { name: "select", icon: "/assets/hero/hero-tool-select.svg" },
      { name: "add", icon: "/assets/hero/hero-tool-add.svg" },
      { name: "redirect", icon: "/assets/hero/hero-tool-redirect.svg" },
      { name: "code", icon: "/assets/hero/hero-tool-extra.svg" },
    ],
    /** The Framework's four practices (thinkingchristian.org/framework). */
    trigger: { title: "God's Reality", source: "01 / recognizing" },
    condition: { title: "Theological Disposition", source: "02 / cultivating" },
    log: { title: "Theo-Logic", source: "03 / practicing" },
    /** Labels on the fan-out from 01 to 02 and 03. */
    branches: { yes: "and", no: "and" },
    approval: { title: "Disciplined Inquiry", source: "04 / committing" },
    wait: "the Quad",
    runsLabel: "the framework in action",
    /**
     * "The Framework in Action" topics. `time` is the row's fixed index label
     * (LiveRuns uses it as-is when it isn't a clock time).
     */
    runs: [
      { time: "01", name: "masculinity", duration: "read", live: true },
      { time: "02", name: "politics", duration: "explore", live: false },
      { time: "03", name: "technology", duration: "read", live: false },
    ],
    /** The live feed keeps cycling the topics. */
    runPool: [
      { time: "04", name: "culture", duration: "listen" },
      { time: "05", name: "scripture", duration: "explore" },
      { time: "06", name: "church history", duration: "listen" },
      { time: "01", name: "masculinity", duration: "read" },
      { time: "02", name: "politics", duration: "explore" },
      { time: "03", name: "technology", duration: "read" },
    ],
    /** Unused for index labels; kept for the feed's clock-time mode. */
    runGaps: [47, 73, 38, 91, 56],
  },
} as const;

export type HeroContent = typeof heroMock;
