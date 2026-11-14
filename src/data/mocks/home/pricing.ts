/** 09 Listen, Watch, and Read — thinkingchristian.org "Start Here" (ADR-0032). */
export const pricingMock = {
  head: {
    badge: "start here",
    title: { before: "Listen, Watch, and ", accent: "Read", after: "." },
    aside:
      "Long-form conversations with scholars, pastors, and authors on Scripture, theology, and the church's life in the world.",
  },
  /** `size` — 14/20 (`label`) or 16/24 (`body`) feature lines. */
  tiers: [
    {
      name: "01 / the podcast",
      price: "Listen",
      period: "the thinking christian podcast",
      featured: true,
      tag: "start here",
      features: [
        { label: "Apple Podcasts", size: "body" },
        { label: "Spotify", size: "body" },
        { label: "Amazon Music", size: "body" },
        { label: "iHeart and LifeAudio", size: "body" },
      ],
      cta: { label: "Listen to the Podcast", href: "https://www.thinkingchristian.org/podcast" },
    },
    {
      name: "02 / youtube",
      price: "Watch",
      period: "thinking christian on youtube",
      featured: false,
      tag: "coming soon",
      features: [
        { label: "Thinking Christian: Into the Text", size: "body" },
        { label: "a Bible podcast reading Scripture", size: "body" },
        { label: "closely, in context,", size: "body" },
        { label: "and against ourselves", size: "body" },
      ],
      cta: { label: "Watch on YouTube", href: "https://www.youtube.com/@thinking_christian?sub_confirmation=1" },
    },
    {
      name: "03 / articles",
      price: "Read",
      period: "essays and short answers",
      featured: false,
      features: [
        { label: "Scripture", size: "body" },
        { label: "Theology", size: "body" },
        { label: "Culture", size: "body" },
        { label: "Questions", size: "body" },
      ],
      cta: { label: "Read the latest", href: "https://www.thinkingchristian.org/articles" },
    },
  ],
} as const;

export type PricingContent = typeof pricingMock;
