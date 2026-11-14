/** 09 Pricing — Figma 3488:22781. Copy is verbatim from the frame. */
export const pricingMock = {
  head: {
    badge: "pricing",
    title: { before: "You pay for runs, not ", accent: "for seats", after: "." },
    aside:
      "Invite the whole company on any plan. Nobody should ask permission to automate their own job.",
  },
  meter: {
    eyebrow: "estimate",
    question: "How many runs do you expect a month?",
    resultEyebrow: "your plan",
    period: "a month",
    included: "runs included",
    cta: { label: "Start free", href: "#start" },
  },
  /** `size` — Figma sets a few feature lines at 16/24 instead of 14/20. */
  tiers: [
    {
      name: "Starter",
      price: "$29",
      runs: 3000,
      period: "a month",
      featured: false,
      features: [
        { label: "3,000 runs a month", size: "label" },
        { label: "10 workflows", size: "label" },
        { label: "7 days of run history", size: "body" },
        { label: "email support", size: "label" },
      ],
      cta: { label: "Start free", href: "#start" },
    },
    {
      name: "Team",
      price: "$89",
      runs: 30000,
      period: "a month",
      featured: true,
      tag: "most picked",
      features: [
        { label: "30,000 runs a month", size: "body" },
        { label: "unlimited workflows", size: "body" },
        { label: "90 days of run history", size: "body" },
        { label: "Slack approvals and code steps", size: "body" },
      ],
      cta: { label: "Start free", href: "#start" },
    },
    {
      name: "Scale",
      price: "$290",
      runs: 300000,
      period: "a month",
      featured: false,
      features: [
        { label: "300,000 runs a month", size: "body" },
        { label: "single sign on and audit log", size: "body" },
        { label: "1 year of run history", size: "body" },
        { label: "named engineer, 4 hour response", size: "body" },
      ],
      cta: { label: "Talk to us", href: "#contact" },
    },
  ],
} as const;

export type PricingContent = typeof pricingMock;
