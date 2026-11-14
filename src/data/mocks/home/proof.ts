/** 08 Proof — Figma 3488:22724. Copy is verbatim from the frame. */
export const proofMock = {
  badge: "case studies",
  title: {
    before: "Numbers we did ",
    accent: "not",
    after: " have to explain away.",
  },
  aside:
    "Counted across every account, including the ones that churned. An honest average, not a best case.",
  stats: [
    {
      id: "volume",
      label: "volume",
      value: "62,000",
      caption: "runs handled on an average weekday",
      visual: "sparkline",
      trend: "up 18% since March",
      quote: {
        text: "We killed four scripts nobody wanted to own and a spreadsheet that had been lying to us.",
        name: "Marta Silvani",
        role: "head of operations, Fielder",
      },
    },
    {
      id: "time-back",
      label: "time back",
      value: "11",
      caption: "hours a week given back per person",
      visual: "hours",
      trend: "measured across 1,400 teams",
      quote: {
        text: "Finance stopped asking me for the weekly export. It just lands in the channel now.",
        name: "Owen Brandt",
        role: "data lead, Cassette",
      },
    },
    {
      id: "first-attempt",
      label: "first attempt",
      value: "99%",
      caption: "of runs finish on the first attempt",
      visual: "progress",
      trend: "the other 1% retried and passed",
      quote: {
        text: "What sold my team was the log. When something breaks we see the exact payload.",
        name: "Tom Ekelund",
        role: "cto, Bright Coast",
      },
    },
  ],
  /** Hours column: 11 lit bars (one union asset) + 3 dim bars (3488:22760–62). */
  dimHours: 3,
} as const;

export type ProofContent = typeof proofMock;
export type ProofStat = ProofContent["stats"][number];
