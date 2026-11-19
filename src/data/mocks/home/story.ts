/** Story — text and picture section (doc 2026-11-14). Copy is the owner's, verbatim. */
export const storyMock = {
  eyebrow: "Calm, Thoughtful, Theological.",
  title: { before: "More than Misinformation. ", accent: "Mis‑formation", after: "." },
  paragraphs: [
    "In 2018, while I was serving as an academic dean, accusations of doctrinal drift were leveled against some of our faculty and administrators, me included. As the story went public and high-profile evangelicals weighed in without knowing what was really happening, I watched a simple narrative displace a complicated reality.",
    "What I didn't anticipate was how difficult it would be not to fire back with a terribly simple story of my own. After leaving my position, I wrote articles I intended to publish, and my wife read them and told me I couldn't. They were too angry, too unnuanced, and too untheological. She was right. I was falling into the same patterns I wanted to speak against, responding to the situation instead of responding to God from within it. The problem wasn't simply about misinformation, but mis-formation.",
    "Thinking Christian emerged as a different sort of response: slow, deliberate, theological discussion that refuses to be quick to speak, quick to anger, and slow to listen. Faithful Christian witness depends on that kind of discernment.",
  ],
  primary: {
    label: "Read the full story",
    href: "https://www.thinkingchristian.org/james#why-i-do-this-work",
  },
  secondary: { label: "Order Digital Discernment", href: "https://link.amazon/B00xb3xPQ" },
  /** Path under public/ once the owner supplies the portrait. */
  photo: "/assets/story/james-spencer-portrait.jpg" as string | null,
  photoAlt: "James Spencer",
};

export type StoryContent = typeof storyMock;
