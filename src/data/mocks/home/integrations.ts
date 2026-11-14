/** 03 Topics (Integrations layout) — "The Framework in Action" topics, thinkingchristian.org (ADR-0032). */
export const integrationsMock = {
  caption: "unsettling convention, one topic at a time",
  /** The same caption as the 390 frame breaks it (centred, two lines). */
  captionLines390: ["unsettling convention,", "one topic at a time"],
  /**
   * Which frames draw each tile. `in1024` covers 1024 and 768; `in390` is the
   * 390 frame. Six topics plus the articles index.
   */
  apps: [
    { name: "masculinity", initials: "MA", active: false, in1024: true, in390: false },
    { name: "politics", initials: "PO", active: true, in1024: true, in390: true },
    { name: "technology", initials: "TE", active: false, in1024: true, in390: false },
    { name: "culture", initials: "CU", active: false, in1024: true, in390: true },
    { name: "scripture", initials: "SC", active: false, in1024: false, in390: true },
    { name: "history", initials: "HI", active: false, in1024: false, in390: true },
    { name: "questions", initials: "QU", active: false, in1024: true, in390: false },
    { name: "articles", initials: "+", active: false, in1024: true, in390: false },
  ],
} as const;

export type IntegrationsContent = typeof integrationsMock;
export type IntegrationsApp = IntegrationsContent["apps"][number];
