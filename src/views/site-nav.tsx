// Fixed site header overlaid on the page: a brand pill and a separate links pill on
// the left, and a white "request a demo" button on the right — all the same height
// (h-11). Pinned to the viewport (position: fixed) with symmetric insets (top ===
// sides). White text works over the dark hero/chain stages; the pills' dark backdrop
// keeps them legible over light sections too. Rendered once near the app root — see
// home.tsx.
import Image from "next/image";

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteNavContent {
  brand: string;
  items: NavLink[];
  cta: NavLink;
}

export interface SiteNavProps extends SiteNavContent {
  /** Accessible name for the <nav> landmark. */
  navLabel?: string;
}


// Shared pill shell — brand and links pills sit in their own rounded plaques.
const PILL =
  "flex h-11 items-center rounded-full border border-white/10 bg-ink/30 backdrop-blur-md";

export const SiteNav = ({
  brand,
  items,
  cta,
  navLabel = "Primary",
}: SiteNavProps) => (
  <header className="fixed inset-x-4 top-4 z-50 flex items-center justify-between gap-4 text-white md:inset-x-6 md:top-6">
    <div className="flex items-center gap-3">
      {/* Brand: the Thinking Christian mark + Playfair wordmark, "Christian"
          in italic (as the logo lockup). */}
      <a href="#top" className={`${PILL} gap-2 pl-3 pr-5`}>
        <Image src="/assets/brand/tc-mark.svg" alt="" width={24} height={24} className="h-6 w-6" />
        <span className="font-display text-base">
          {brand.split(" ")[0]} <span className="italic">{brand.split(" ").slice(1).join(" ")}</span>
        </span>
      </a>
      <nav aria-label={navLabel} className={`${PILL} hidden px-2 md:flex`}>
        {items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </div>
    <a
      href={cta.href}
      className="inline-flex h-11 items-center rounded-full bg-white px-6 text-sm font-medium text-ink shadow-sm hover:bg-white/90"
    >
      {cta.label}
    </a>
  </header>
);
