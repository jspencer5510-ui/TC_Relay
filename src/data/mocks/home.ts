// Content for the home view. Kept out of components per the data rules — passed
// in as props.
// See obsidian/frontend/component-conventions.md (Data rules).
import type { HeroContent } from "@/views/hero";
import type { AboutContent } from "@/views/about";
import type { StatsContent } from "@/views/stats";
import type { ShowcaseContent } from "@/views/showcase";
import type { WorksContent } from "@/views/works";
import type { ChainContent } from "@/views/chain";
import type { SiteNavContent } from "@/views/site-nav";

export interface HomeContent {
  /** Shared fixed site header (rendered once). */
  nav: SiteNavContent;
  hero: HeroContent;
  logos: {
    label: string;
    /** The six topics — rendered as one flat grey in the marquee. */
    items: string[];
  };
  about: AboutContent & { labelId: string };
  stats: StatsContent;
  showcase: ShowcaseContent;
  works: WorksContent;
  chain: ChainContent;
}

// Thinking Christian mockup content (owner request 2026-11-23). Copy and links
// come from the main site's content (TC_Relay `content/thinking-christian`,
// src/data/mocks/home/*) — nothing here is invented: numbers are counts of real
// things (4 framework practices, 6 topics, 3 ways in), and every link points at
// thinkingchristian.org or the show's real podcast / video pages.
const TC = "https://www.thinkingchristian.org";

// The site nav is shared across the hero and chain stages.
const siteNav: SiteNavContent = {
  brand: "Thinking Christian",
  items: [
    { label: "Podcast", href: `${TC}/podcast` },
    { label: "Questions", href: `${TC}/questions` },
    { label: "Articles", href: `${TC}/articles` },
    { label: "About", href: `${TC}/about` },
  ],
  cta: { label: "The Framework", href: `${TC}/framework` },
};

export const homeContent: HomeContent = {
  nav: siteNav,
  hero: {
    titleLines: ["Unsettling convention.", "Cultivating conviction."],
    sectionLabel: "Hero",
    sceneLabel: "Animated burst of light",
    cta: { label: "Explore the Framework", href: `${TC}/framework` },
    secondaryCta: { label: "Listen to the Podcast", href: `${TC}/podcast` },
    insightTitle:
      "Reading the Bible as the final authority for life and faith.",
    insightBody:
      "Reading the Bible as the final authority for life and faith means questioning the assumptions of our culture, even our Christian culture, so that we don't settle for a narrower vision than God's word offers.",
    stats: [
      { value: "4", label: "Framework practices" },
      { value: "6", label: "Topics, one at a time" },
      { value: "3", label: "Ways in: listen, watch, read" },
    ],
  },
  logos: {
    label: "Unsettling conventions, one topic at a time",
    items: [
      "(Un)Biblical Masculinity",
      "Christians & Politics",
      "Technology & Media",
      "Literature, Film, & Culture",
      "Scripture & Theology",
      "Church History",
    ],
  },
  about: {
    labelId: "about-title",
    eyebrow: "Calm, thoughtful, theological",
    lead: "God doesn't live in our world.",
    mutedLead: "We live in His.",
  },
  stats: {
    label: "Thinking Christian at a glance",
    brand: "James Spencer",
    collab: {
      value: "2018",
      desc: "Where the story starts: a simple narrative displacing a complicated reality.",
    },
    commitment: {
      eyebrow: "Calm, thoughtful, theological.",
      value: "Not left. Not right.",
      quote:
        "Faithful Christian witness depends on that kind of discernment.",
    },
    data: {
      label: "The Thinking Christian Framework",
      value: "4",
      desc: "Practices for identifying the underlying patterns so that we can respond faithfully to God.",
    },
    reach: { label: "Topics", value: "6" },
  },
  chain: {
    heading: "Defying the world",
    tagline:
      "Refusing to love the world on the world's terms requires us to read Scripture as the final authority for life and faith.",
    aside: "following Jesus",
  },
  showcase: {
    heading: "How we think is as important as what we think",
    cta: "Explore the Framework",
    items: [
      { prefix: "Recognizing", name: "God's Reality", image: "/assets/images/3rd/approach.jpg" },
      {
        prefix: "Cultivating",
        name: "a Theological Disposition",
        image: "/assets/images/3rd/technology.jpg",
      },
      { prefix: "Practicing", name: "Theo-Logic", image: "/assets/images/3rd/security.jpg" },
      { prefix: "Committing", name: "to Disciplined Inquiry", image: "/assets/images/3rd/team.jpg" },
    ],
  },
  works: {
    heading: "Start with these episodes",
    viewLabel: "Listen",
    items: [
      {
        name: "When Your Interpretation Becomes the Authority",
        year: "The Diagnosis",
        image: "/assets/images/portfolio/1.jpg",
      },
      {
        name: "Why Do Christian Institutions Compromise to Stay Alive?",
        year: "Episode",
        image: "/assets/images/portfolio/2.jpg",
      },
      {
        name: "Shadow vs. Substance: How the Book of Hebrews Unlocks Old Testament Law",
        year: "Episode",
        image: "/assets/images/portfolio/3.jpg",
      },
      {
        name: "Faith in the Age of Reason: Navigating the Journey of Modern Theology",
        year: "Episode",
        image: "/assets/images/portfolio/4.jpg",
      },
    ],
  },
};
