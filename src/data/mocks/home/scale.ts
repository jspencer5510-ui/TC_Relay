/** 06 The Framework (Scale layout) — thinkingchristian.org (ADR-0032). */
export const scaleMock = {
  head: {
    badge: "the thinking christian framework",
    title: { before: "How we think is as ", accent: "important", after: " as what we think." },
    aside:
      "Much of what shapes us doesn't present itself as a formal argument, but appears in the form of institutions, symbols, slogans, and stories that encourage us to love on our own terms rather than God's.",
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
      { region: "son", city: "God's self-disclosure", share: "" },
      { region: "scripture", city: "God's self-disclosure", share: "" },
      { region: "spirit", city: "God's self-disclosure", share: "" },
    ],
    footnote: "God doesn't live in our world. We live in his.",
  },
} as const;

export type ScaleContent = typeof scaleMock;
