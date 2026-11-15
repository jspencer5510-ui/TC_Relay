import Link from "next/link";

import type { NavLink } from "@/data/mocks/home/nav";

/**
 * Topics drop-down (ADR-0033). A native `<details>` disclosure: keyboard and
 * screen-reader support with no client JS, and it opens on click/tap rather
 * than on hover so it never flickers open while the pointer crosses the nav.
 * The panel appears without motion — a discrete state change, not an
 * animation (AGENTS.md hard rule 1).
 */
export const TopicsMenu = ({ link }: { link: NavLink }) => (
  <details className="group relative">
    <summary className="flex cursor-pointer list-none items-center gap-1.5 whitespace-nowrap transition-colors duration-(--motion-fast) ease-entrance hover:text-accent group-open:text-foreground [&::-webkit-details-marker]:hidden">
      {link.label}
      <span
        aria-hidden="true"
        className="block size-1.5 rotate-45 border-r border-b border-current transition-transform duration-(--motion-fast) ease-entrance group-open:-rotate-135"
      />
    </summary>
    <ul className="absolute top-full left-1/2 mt-4 w-64 -translate-x-1/2 overflow-clip rounded-2xl border border-border-subtle bg-surface-raised p-2 shadow-float">
      {link.children?.map((child) => (
        <li key={child.href}>
          <Link
            href={child.href}
            className="block rounded-xl px-4 py-2.5 text-body leading-body whitespace-nowrap text-foreground transition-colors duration-(--motion-fast) ease-entrance hover:bg-background hover:text-accent"
          >
            {child.label}
          </Link>
        </li>
      ))}
    </ul>
  </details>
);
