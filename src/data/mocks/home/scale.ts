/** 06 The Framework (Scale layout) — thinkingchristian.org (ADR-0032). */
export const scaleMock = {
  /** Head per doc 2026-11-14; the two cards below stay as they are for now. */
  head: {
    badge: "Body Building",
    title: { before: "Defying the World. ", accent: "Following", after: " Jesus." },
    aside:
      "Refusing to love the world on the world's terms requires us to read Scripture as the final authority for life and faith.",
  },
  runtime: {
    title: "Four practices, one response",
    copy: "The Thinking Christian Framework is a way of identifying and analyzing the underlying patterns so that we can respond faithfully to God.",
    label: "the four practices of the framework",
    caption: "recognize, cultivate, practice, commit",
    /** Order matches the node layout (four nodes around the mark). */
    apps: [
      { code: "01", name: "reality" },
      { code: "02", name: "disposition" },
      { code: "03", name: "theo-logic" },
      { code: "04", name: "inquiry" },
    ],
  },
  regions: {
    title: "A life patterned on God",
    copy: "Our aim is to cultivate a theological sense of the way the world works, and a life patterned on God's self-disclosure in Son, Scripture, and Spirit.",
    label: "God's self-disclosure",
    /** `share` is shown as written when it isn't a number (lane-bar). */
    rows: [
      { region: "son", city: "", share: "" },
      { region: "scripture", city: "", share: "" },
      { region: "spirit", city: "", share: "" },
    ],
    footnote: "God doesn't live in our world. We live in his.",
  },
} as const;

export type ScaleContent = typeof scaleMock;
