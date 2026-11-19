/** 06 The Framework (Scale layout) — thinkingchristian.org (ADR-0032). */
export const scaleMock = {
  /** Head per doc 2026-11-14. */
  head: {
    badge: "Body Building",
    title: { before: "Defying the World. ", accent: "Following", after: " Jesus." },
    aside:
      "Refusing to love the world on the world's terms requires us to read Scripture as the final authority for life and faith.",
  },
  runtime: {
    title: "Four practices, one response",
    copy: "The Thinking Christian Framework is a way of identifying and analyzing the underlying patterns so that we can respond faithfully to God.",
    label: "the four practices of the framework",
    caption: "recognize, cultivate, practice, commit",
    /** Order matches the node layout (four nodes around the mark). */
    apps: [
      { code: "01", name: "reality" },
      { code: "02", name: "disposition" },
      { code: "03", name: "theo-logic" },
      { code: "04", name: "inquiry" },
    ],
  },
  /** Second card (owner, 2026-11-19): static — no art, no motion. The owner's
      single paragraph is split at its sentence groups for readability; the
      words are unchanged. `href: null` = link not supplied yet (rendered as
      plain text until it is). */
  holiness: {
    title: "Refusing to Settle for Wholesomeness When Only Holiness Will Do",
    paragraphs: [
      "Thinking Christian is for believers committed to the work of building the body of Christ even when doing so requires us to unsettle the conventions we've inherited.",
      "Wholesomeness tempts us to set aside our theological convictions and live according to human standards of goodness and respectability. Holiness calls us to be uncompromising as we strive to point to and glorify the Triune God.",
      "If you want Scripture to endorse the right or the left without qualification, baptize slogans like \"family friendly,\" or provide a vision of progress that ends in something other than new creation, Thinking Christian will frustrate you. If you want to consider how God's word exposes the patterns keeping us from being conformed to the image of his Son, Thinking Christian is for you.",
    ],
    episodesLabel: "Start with one of these episodes",
    episodes: [
      { title: "When Your Interpretation Becomes the Authority | The Diagnosis", href: null as string | null },
      { title: "Why Do Christian Institutions Compromise to Stay Alive?", href: null as string | null },
      {
        title: "Shadow vs. Substance: How the Book of Hebrews Unlocks Old Testament Law (Rebekah Josberger and Renee Duffy)",
        href: null as string | null,
      },
      {
        title: "Faith in the Age of Reason: Navigating the Journey of Modern Theology",
        href: "https://www.thinkingchristian.org/episodes/faith-in-the-age-of-reason-navigating-the-journey-of-modern-theology" as string | null,
      },
    ],
  },
} as const;

export type ScaleContent = typeof scaleMock;
