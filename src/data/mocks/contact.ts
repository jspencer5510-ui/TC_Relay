// Contact form + site footer — Thinking Christian copy and links (main site's
// footer content). No street address or phone is published, so those are empty
// and the footer skips them.

export interface ContactContent {
  labelId: string;
  /** Bold intro prompt above the form. */
  heading: string;
  /** Placeholder / label text for each field. */
  fields: { name: string; phone: string; email: string };
  cta: string;
}

export const contactContent: ContactContent = {
  labelId: "contact-title",
  heading:
    "If you want to consider how God's word exposes the patterns keeping us from being conformed to the image of his Son, Thinking Christian is for you.",
  fields: { name: "Name", phone: "Phone number", email: "Email" },
  cta: "Send",
};

export interface FooterLink {
  label: string;
  href: string;
  /** External links open in a new tab and get rel="noopener". */
  external?: boolean;
}

export interface FooterNavGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterContent {
  tagline: string;
  labelId: string;
  heading: string;
  cta: FooterLink;
  backToTop: FooterLink;
  linksLabel: string;
  sitemap: FooterNavGroup;
  contact: {
    title: string;
    address: string;
    phone: string;
    email: string;
  };
  social: FooterNavGroup;
  copyright: string;
  credit: string;
}

const TC = "https://www.thinkingchristian.org";

export const footerContent: FooterContent = {
  tagline: "Calm, thoughtful, theological conversations.",
  labelId: "footer-title",
  heading: "Thinking Christian is for you.",
  cta: { label: "Contact us", href: "mailto:info@thinkingchristian.org" },
  backToTop: { label: "Back to top", href: "#top" },
  linksLabel: "Links",
  sitemap: {
    title: "Explore",
    links: [
      { label: "Podcast", href: `${TC}/podcast` },
      { label: "Framework", href: `${TC}/framework` },
      { label: "Questions", href: `${TC}/questions` },
      { label: "Articles", href: `${TC}/articles` },
      { label: "About", href: `${TC}/about` },
    ],
  },
  contact: {
    title: "Contact",
    address: "",
    phone: "",
    email: "info@thinkingchristian.org",
  },
  social: {
    title: "Listen & watch",
    links: [
      { label: "YouTube", href: "https://www.youtube.com/@thinking_christian?sub_confirmation=1", external: true },
      {
        label: "Apple Podcasts",
        href: "https://podcasts.apple.com/us/podcast/thinking-christian-clear-theology-for-a-confusing-world/id1712162582",
        external: true,
      },
      { label: "Spotify", href: "https://open.spotify.com/show/3PCi6K1PjPXzhrNVGAPTLX", external: true },
    ],
  },
  copyright: "© 2026 Thinking Christian",
  credit: "Unsettling convention. Cultivating conviction.",
};
