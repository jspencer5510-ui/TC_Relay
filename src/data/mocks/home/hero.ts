/** 02 Hero — Figma 3488:21055. Copy: thinkingchristian.org homepage (ADR-0032). */
export const heroMock = {
  chip: "Thinking Christian",
  title: { before: "Unsettling convention. Cultivating ", accent: "conviction", after: "." },
  subhead:
    "Reading the Bible as the final authority for life and faith means questioning the assumptions of our culture, even our Christian culture, so that we don't settle for a narrower vision than God's word offers.",
  actions: {
    primary: { label: "Explore the Framework", href: "https://www.thinkingchristian.org/framework" },
    secondary: { label: "Listen to the Podcast", href: "https://www.thinkingchristian.org/podcast" },
  },
  /**
   * Featured panel (owner, 2026-11-18) — the Relay product window's glass box,
   * now a three-item showcase: a book launch, a new series, an episode. Edit
   * these to change what is featured. `image`: path under public/ (1600×800,
   * 2 : 1) or null for a typeset stand-in; `fit: "contain"` shows the whole
   * image on a tinted panel (book covers), `"cover"` fills the frame.
   */
  feature: {
    label: "Featured",
    items: [
      {
        kind: "New book",
        title: "Digital Discernment",
        text: "Thinking Rightly in an Age of Misinformation — the forthcoming book from James Spencer.",
        image: "/assets/hero/digital-discernment-cover.jpg" as string | null,
        fit: "contain" as "contain" | "cover",
        cta: { label: "Learn more", href: "https://www.thinkingchristian.org/digitaldiscernment" },
      },
      {
        kind: "Podcast",
        title: "Thinking Christian Podcast",
        text: "Clear theology for a confusing world — long-form conversations on faith and culture.",
        image: null as string | null,
        fit: "cover" as "contain" | "cover",
        cta: { label: "Listen now", href: "https://www.thinkingchristian.org/podcast" },
      },
      {
        kind: "Series",
        title: "The Framework in Action",
        text: "Masculinity, politics, technology — the Thinking Christian Framework applied to the questions of the moment.",
        image: null as string | null,
        fit: "cover" as "contain" | "cover",
        cta: { label: "Explore the series", href: "https://www.thinkingchristian.org/framework" },
      },
    ],
  },
} as const;

export type HeroContent = typeof heroMock;
