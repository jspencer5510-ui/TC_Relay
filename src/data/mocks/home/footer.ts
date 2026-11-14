/** 10 Footer — thinkingchristian.org footer (ADR-0032). */
export const footerMock = {
  brand: {
    name: "Thinking Christian",
    href: "/",
    tagline: "Unsettling convention. Cultivating conviction.",
    socialLabel: "listen and watch",
    socials: [
      { label: "yt", name: "YouTube", href: "https://www.youtube.com/@thinking_christian?sub_confirmation=1" },
      { label: "ap", name: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/thinking-christian-clear-theology-for-a-confusing-world/id1712162582" },
      { label: "sp", name: "Spotify", href: "https://open.spotify.com/show/3PCi6K1PjPXzhrNVGAPTLX" },
      { label: "@", name: "Email", href: "mailto:info@thinkingchristian.org" },
    ],
  },
  cta: {
    eyebrow: "not left. not right. not leaving.",
    title: { before: "Thinking Christian is ", accent: "for", after: " you." },
    copy: "If you want to consider how God's word exposes the patterns keeping us from being conformed to the image of his Son, Thinking Christian is for you.",
    email: "info@thinkingchristian.org",
    contactLabel: "Contact Us",
  },
  /** `short` is the 768 / 390 copy. */
  statuses: [
    { label: "calm, thoughtful, theological", short: "calm, thoughtful, theological" },
    { label: "scripture as the final authority", short: "scripture, the final authority" },
    {
      label: "son, scripture, and spirit",
      short: "son, scripture, spirit",
    },
  ],
  company: {
    name: "Thinking Christian",
    copy: "Calm, thoughtful, theological conversations.",
    compliance: "As an Amazon Associate, Thinking Christian earns from qualifying purchases.",
  },
  columns: [
    {
      title: "listen",
      links: [
        { label: "Podcast", href: "https://www.thinkingchristian.org/podcast" },
        { label: "All Episodes", href: "https://www.thinkingchristian.org/episodes" },
        { label: "Guests", href: "https://www.thinkingchristian.org/guests" },
        { label: "Series", href: "https://www.thinkingchristian.org/series" },
      ],
    },
    {
      title: "explore",
      links: [
        { label: "Questions", href: "https://www.thinkingchristian.org/questions" },
        { label: "Articles", href: "https://www.thinkingchristian.org/articles" },
        { label: "Scripture & Theology", href: "https://www.thinkingchristian.org/scripture" },
        { label: "Books", href: "https://www.thinkingchristian.org/books" },
      ],
    },
    {
      title: "resources",
      links: [
        { label: "The Framework", href: "https://www.thinkingchristian.org/framework" },
        { label: "Study Guides", href: "https://www.thinkingchristian.org/studyguides" },
        { label: "Glossary", href: "https://www.thinkingchristian.org/glossary" },
        { label: "Useful to God", href: "https://www.thinkingchristian.org/useful-to-god" },
      ],
    },
    {
      title: "about",
      links: [
        { label: "About", href: "https://www.thinkingchristian.org/about" },
        { label: "James Spencer", href: "https://www.thinkingchristian.org/james" },
        { label: "Statement of Faith", href: "https://www.thinkingchristian.org/about/faith" },
        { label: "Privacy Policy", href: "https://www.thinkingchristian.org/privacy" },
      ],
    },
  ],
  legal: {
    copyright: "© 2026 Thinking Christian. All rights reserved.",
    origin: "info@thinkingchristian.org",
  },
} as const;

export type FooterContent = typeof footerMock;
