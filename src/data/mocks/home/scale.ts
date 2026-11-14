/** 06 Scale — Figma 3488:22268. Copy is verbatim from the frame. */
export const scaleMock = {
  head: {
    badge: "reliability",
    title: { before: "", accent: "Boring", after: " in the ways that matter." },
    aside:
      "Credentials, retries, rate limits, residency. The parts nobody demos, and the parts that decide the year.",
  },
  runtime: {
    title: "One runtime, every app",
    copy: "Relay holds the credentials, retries and rate limits, so a step behaves the same on Stripe or on the API you wrote last week.",
    label: "one runtime, every connection",
    caption: "credentials, retries, rate limits, replay",
    /** Order matches the node layout: SL, ST, PG, HS. */
    apps: [
      { code: "SL", name: "slack" },
      { code: "ST", name: "stripe" },
      { code: "PG", name: "postgres" },
      { code: "HS", name: "hubspot" },
    ],
  },
  regions: {
    title: "Runs where your data lives",
    copy: "Pick Frankfurt, Virginia or Sydney. Payloads and logs stay in the region you chose, and the audit trail says so in writing.",
    label: "where runs executed, last 24 hours",
    rows: [
      { region: "eu-central-1", city: "Frankfurt", share: "46%" },
      { region: "us-east-1", city: "Virginia", share: "38%" },
      { region: "ap-southeast-2", city: "Sydney", share: "16%" },
    ],
    footnote: "a payload never leaves the lane it started in",
  },
} as const;

export type ScaleContent = typeof scaleMock;
