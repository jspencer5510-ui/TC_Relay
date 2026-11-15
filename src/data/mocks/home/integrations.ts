/** 03 Topics (Integrations layout) — "The Framework in Action" topics, thinkingchristian.org (ADR-0032). */
export const integrationsMock = {
  caption: "unsettling convention, one topic at a time",
  /** The same caption as the 390 frame breaks it (centred, two lines). */
  captionLines390: ["unsettling convention,", "one topic at a time"],
  /**
   * Which frames draw each tile. `in1024` covers 1024 and 768; `in390` is the
   * 390 frame. Six topics plus the articles index.
   */
  /**
   * Topic tiles (doc 2026-11-14) — each links to its topic page. `in1024`
   * covers 1024 and 768; `in390` is the phone row (four fit).
   */
  apps: [
    { name: "(Un)Biblical Masculinity", initials: "MA", href: "https://www.thinkingchristian.org/unmanly", active: false, in1024: true, in390: true },
    { name: "Christians & Politics", initials: "PO", href: "https://www.thinkingchristian.org/politics", active: true, in1024: true, in390: true },
    { name: "Technology & Media", initials: "TE", href: "https://www.thinkingchristian.org/technology", active: false, in1024: true, in390: true },
    { name: "Literature, Film, & Culture", initials: "CU", href: "https://www.thinkingchristian.org/culture", active: false, in1024: true, in390: false },
    { name: "Scripture & Theology", initials: "SC", href: "https://www.thinkingchristian.org/scripture", active: false, in1024: true, in390: true },
    { name: "Church History", initials: "CH", href: "https://www.thinkingchristian.org/reformation", active: false, in1024: true, in390: false },
  ],
} as const;

export type IntegrationsContent = typeof integrationsMock;
export type IntegrationsApp = IntegrationsContent["apps"][number];
