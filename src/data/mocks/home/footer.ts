/** 10 Footer — Figma 3888:7053. Copy is verbatim from the frame. */
export const footerMock = {
  brand: {
    name: "Relay",
    href: "/",
    tagline: "Automation for the work that lives between your tools.",
    socialLabel: "stay in touch",
    socials: [
      { label: "in", name: "LinkedIn", href: "#linkedin" },
      { label: "x", name: "X", href: "#x" },
      { label: "gh", name: "GitHub", href: "#github" },
      { label: "dc", name: "Discord", href: "#discord" },
    ],
  },
  cta: {
    eyebrow: "what now",
    title: { before: "Pick the task you ", accent: "hate", after: " most." },
    copy: "Bring one job nobody enjoys doing by hand. If Relay cannot run it by the end of the trial, we will tell you so.",
    emailLabel: "Work email",
    submit: "Start free",
  },
  /** `short` is the 768 / 390 copy (3876:139 / 3876:142). */
  statuses: [
    { label: "all systems normal", short: "all systems normal" },
    { label: "99% pass on the first attempt", short: "99% first-attempt pass" },
    {
      label: "three regions, no cross border hops",
      short: "three regions, no hops",
    },
  ],
  company: {
    name: "Relay Labs",
    copy: "Independent, profitable, and boring on purpose since 2024.",
    compliance: "SOC 2 Type II / audit log / data residency",
  },
  columns: [
    {
      title: "product",
      links: [
        { label: "Canvas", href: "#product" },
        { label: "Apps", href: "#apps" },
        { label: "Run history", href: "#run-history" },
        { label: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "learn",
      links: [
        { label: "Docs", href: "#docs" },
        { label: "Templates", href: "#templates" },
        { label: "Changelog", href: "#changelog" },
        { label: "Status", href: "#status" },
      ],
    },
    {
      title: "company",
      links: [
        { label: "About", href: "#about" },
        { label: "Careers", href: "#careers" },
        { label: "Security", href: "#security" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "legal",
      links: [
        { label: "Privacy", href: "#privacy" },
        { label: "Terms", href: "#terms" },
        { label: "Cookies", href: "#cookies" },
      ],
    },
  ],
  legal: {
    copyright: "2026, all rights reserved",
    origin: "built in Lisbon and Kraków",
  },
} as const;

export type FooterContent = typeof footerMock;
