/**
 * 01 Navigation — Figma 3488:21037. Copy: thinkingchristian.org (ADR-0032); `code`
 * and `note` only feed the 390 menu card (not in Figma, user-picked variant).
 */
export type NavLink = {
  label: string;
  href: string;
  code: string;
  note: string;
  /** Drop-down entries (desktop); the phone menu links to `href`. */
  children?: readonly { label: string; href: string }[];
};

export const navMock: {
  brand: { name: string; href: string; logo: string };
  links: readonly NavLink[];
  status: string;
  cta: { label: string; href: string };
} = {
  /** `logo` — swap in the Thinking Christian logo file when supplied. */
  brand: { name: "Thinking Christian", href: "/", logo: "/assets/nav/nav-logo-mark.svg" },
  links: [
    { label: "Podcast", href: "https://www.thinkingchristian.org/podcast", code: "PO", note: "Long-form conversations" },
    {
      label: "Topics",
      href: "#integrations",
      code: "TO",
      note: "One topic at a time",
      children: [
        { label: "Scripture & Theology", href: "https://www.thinkingchristian.org/scripture" },
        { label: "Christians & Politics", href: "https://www.thinkingchristian.org/politics" },
        { label: "Technology", href: "https://www.thinkingchristian.org/technology" },
        { label: "Discipleship", href: "https://www.thinkingchristian.org/discipleship" },
        { label: "Masculinity", href: "https://www.thinkingchristian.org/unmanly" },
      ],
    },
    { label: "Questions", href: "https://www.thinkingchristian.org/questions", code: "QU", note: "Short answers" },
    { label: "Articles", href: "https://www.thinkingchristian.org/articles", code: "AR", note: "Essays" },
    { label: "About", href: "https://www.thinkingchristian.org/about", code: "AB", note: "Thinking Christian" },
  ],
  /** No status pill (doc 2026-11-14); empty hides it. */
  status: "",
  cta: { label: "The Framework", href: "https://www.thinkingchristian.org/framework" },
};

export type NavContent = typeof navMock;
