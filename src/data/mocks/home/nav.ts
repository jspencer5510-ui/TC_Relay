/**
 * 01 Navigation — Figma 3488:21037. Copy: thinkingchristian.org (ADR-0032); `code`
 * and `note` only feed the 390 menu card (not in Figma, user-picked variant).
 */
export const navMock = {
  brand: { name: "Thinking Christian", href: "/" },
  links: [
    {
      label: "Podcast",
      href: "https://www.thinkingchristian.org/podcast",
      code: "PO",
      note: "Long-form conversations on Scripture and theology",
    },
    {
      label: "Topics",
      href: "#integrations",
      code: "TO",
      note: "Unsettling convention, one topic at a time",
    },
    {
      label: "Articles",
      href: "https://www.thinkingchristian.org/articles",
      code: "AR",
      note: "Essays and short answers",
    },
    {
      label: "About",
      href: "https://www.thinkingchristian.org/about",
      code: "AB",
      note: "Why Thinking Christian exists",
    },
  ],
  status: "into the text, coming soon",
  cta: { label: "Read the Framework", href: "https://www.thinkingchristian.org/framework" },
} as const;

export type NavContent = typeof navMock;
