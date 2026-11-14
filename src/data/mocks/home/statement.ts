/** 05 Statement — "Not left. Not right. Not leaving." thinkingchristian.org (ADR-0032). */
export const statementMock = {
  kicker: "[ not left. not right. not leaving. ]",
  title: {
    lead: "Refusing to settle for wholesomeness when only",
    accent: "holiness",
    tail: " will do.",
  },
  caption: "conformed to the image of his Son",
  now: "now",
  /** Ruler labels — the paragraph's arc, in its own words. */
  hours: ["wholesomeness", "respectability", "slogans", "conventions", "conviction", "holiness"],
} as const;

export type StatementContent = typeof statementMock;
