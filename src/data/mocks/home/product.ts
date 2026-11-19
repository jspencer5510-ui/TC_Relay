/** 04 Breaking from the World's Patterns (Product layout) — thinkingchristian.org (ADR-0032). */
export const productMock = {
  /** Section 1 — Breaking from the World's Patterns (doc 2026-11-14). */
  patterns: {
    head: {
      badge: "breaking from the world's patterns",
      title: { before: "God doesn't live in our world. We live in ", accent: "His", after: "." },
      aside:
        "Every culture builds a world that makes sense of how its people live together, and ties that world to what it holds sacred. Its institutions, ideas, symbols, and hopes for the future reinforce patterns aligned with an incomplete sense of how the world works. Habit, ritual, and reward train us to live according to those patterns. Thinking Christian helps God's people recognize those patterns, whether inconspicuous or evident, including those advanced by Christian culture. Our aim is to cultivate a theological sense of the way the world works, and a life patterned on God's self-disclosure in Son, Scripture, and Spirit.",
    },
  },
  /** Section 3 — The Thinking Christian Framework, rows 01–04 (doc 2026-11-14). */
  framework: {
    head: {
      badge: "The Thinking Christian Framework",
      title: { before: "How we think is as ", accent: "important", after: " as what we think." },
      aside:
        "Much of what shapes us doesn't present itself as a formal argument, but appears in the form of institutions, symbols, slogans, and stories that encourage us to love on our own terms rather than God's. The Thinking Christian Framework is a way of identifying and analyzing the underlying patterns so that we can respond faithfully to God.",
    },
    /** Top-line link of the Numeral Steps layout (ADR-0039). */
    link: { label: "Explore the Framework", href: "https://www.thinkingchristian.org/framework" },
    /** The four practices, rendered by `FrameworkSteps` (ADR-0039). `kind` /
        `cta` are left from the old row cards and are not shown. */
    rows: [
      { kind: "trace", index: "01", title: "Recognizing God's Reality", body: "The willingness to accept God's claim on our lives so that allegiance to him shapes our thought and action.", cta: { label: "Explore the Framework", href: "https://www.thinkingchristian.org/framework" } },
      { kind: "approval", index: "02", title: "Cultivating a Theological Disposition", body: "The pre-reflective, instinctual, theological sense of the way the world works.", cta: { label: "Explore the Framework", href: "https://www.thinkingchristian.org/framework" } },
      { kind: "chart", index: "03", title: "Practicing Theo-Logic", body: "A structured way of reasoning that holds under pressure when the tribe, the algorithm, and the market are offering competing logics.", cta: { label: "Explore the Framework", href: "https://www.thinkingchristian.org/framework" } },
      { kind: "approval", index: "04", title: "Committing to Disciplined Inquiry", body: "The patient, non-defensive work of considering four ways of knowing (the Quad).", cta: { label: "Explore the Framework", href: "https://www.thinkingchristian.org/framework" } },
    ] as const,
  },
  /** Row visuals — placeholders until the owner's images arrive. */
  trace: {
    index: "01",
    title: "More than misinformation. Mis‑formation.",
    body: "In 2018, accusations of doctrinal drift were leveled against some of our faculty and administrators, me included. I watched a simple narrative displace a complicated reality.",
    run: "thinking christian",
    summary: "slow, deliberate, theological",
    steps: [
      { label: "quick to speak", value: "refused", done: true },
      { label: "quick to anger", value: "refused", done: true },
      { label: "slow to listen", value: "refused", done: true },
      { label: "discernment", value: "ongoing", done: false },
    ],
    axis: ["", "", "", "", ""],
  },
  approval: {
    index: "02",
    title: "Responding to God from within it",
    body: "I was falling into the same patterns I wanted to speak against, responding to the situation instead of responding to God from within it.",
    channel: "#the-story",
    day: "2018",
    sender: "James Spencer",
    time: "",
    message: "My wife read them and told me I couldn't.",
    fields: [
      { key: "too", value: "angry" },
      { key: "too", value: "unnuanced" },
      { key: "too", value: "untheological" },
    ],
    approve: "Rewrite",
    hold: "Hold",
    waiting: "she was right",
  },
  chart: {
    index: "03",
    title: "A different sort of response",
    body: "Thinking Christian emerged as slow, deliberate, theological discussion. Faithful Christian witness depends on that kind of discernment.",
    caption: "six topics",
    average: "one at a time",
    days: ["MA", "PO", "TE", "CU", "SC", "HI"],
  },
};

export type ProductContent = typeof productMock;
