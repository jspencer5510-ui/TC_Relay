/** 05 Statement — "The framework in action" (doc 2026-11-14, ADR-0033). */
export const statementMock = {
  kicker: "The framework in action",
  title: {
    lead: "Unsettling conventions,",
    accent: "one topic",
    tail: " at a time",
  },
  caption: "biblically rooted, theologically savvy",
  /** Centre word on the line (was "now"). */
  now: "Thinking Christian",
  /** Words under the line — three left of centre, three right (doc 2026-11-14). */
  hours: [
    "(un)biblical masculinity",
    "christians & politics",
    "technology & media",
    "literature, film & culture",
    "scripture & theology",
    "church history",
  ],
} as const;

export type StatementContent = typeof statementMock;
