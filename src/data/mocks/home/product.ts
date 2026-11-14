/** 04 Breaking from the World's Patterns (Product layout) — thinkingchristian.org (ADR-0032). */
export const productMock = {
  head: {
    badge: "breaking from the world's patterns",
    title: { before: "God doesn't live in our world. We live in ", accent: "His", after: "." },
    aside:
      "Every culture builds a world that makes sense of how its people live together, and ties that world to what it holds sacred. Thinking Christian helps God's people recognize those patterns, whether inconspicuous or evident, including those advanced by Christian culture.",
  },
  trace: {
    index: "01",
    title: "More than misinformation. Mis-formation.",
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
    message: "I wrote articles I intended to publish, and my wife read them and told me I couldn't.",
    fields: [
      { key: "too", value: "angry" },
      { key: "too", value: "unnuanced" },
      { key: "too", value: "untheological" },
    ],
    approve: "Read the full story",
    hold: "Digital Discernment",
    waiting: "she was right",
  },
  chart: {
    index: "03",
    title: "A different sort of response",
    body: "Thinking Christian emerged as slow, deliberate, theological discussion. Faithful Christian witness depends on that kind of discernment.",
    caption: "unsettling convention",
    average: "one topic at a time",
    days: ["masculinity", "politics", "technology", "culture", "scripture", "history"],
  },
} as const;

export type ProductContent = typeof productMock;
