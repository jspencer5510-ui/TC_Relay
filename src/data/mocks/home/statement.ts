/** 05 Statement — Figma 3488:22124. Copy is verbatim from the frame. */
export const statementMock = {
  kicker: "[ what we are actually selling ]",
  title: {
    lead: "The best workflow is the one",
    accent: "nobody mentions",
    tail: " in standup.",
  },
  caption: "one tick, one run",
  now: "now",
  hours: ["09:00", "11:00", "13:00", "15:00", "17:00", "19:00"],
} as const;

export type StatementContent = typeof statementMock;
