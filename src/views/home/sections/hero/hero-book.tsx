import Image from "next/image";

import type { HeroContent } from "@/data/mocks/home/hero";

/**
 * Hero book (doc 2026-11-14, ADR-0033) — the Digital Discernment cover in the
 * slot the product window had, linking to the book page. Until `cover` is set
 * it renders a typeset stand-in (brand orange, Playfair title) so the layout
 * is real; drop the image in `public/assets/hero/` and set `cover`.
 * 2 : 3 cover, centred in the window's former box at every frame.
 */
export const HeroBook = ({ book }: { book: HeroContent["book"] }) => (
  <a
    href={book.href}
    aria-label={`${book.title} by ${book.author} — ${book.note}`}
    className="group absolute top-18 left-220 block h-131.25 w-87.5 w1024:top-14 w1024:left-160 w1024:h-112.5 w1024:w-75 w768:top-88.5 w768:left-63.5 w768:h-97.5 w768:w-65 w390:top-105.5 w390:left-21.25 w390:h-82.5 w390:w-55"
  >
    <span className="relative block size-full overflow-clip rounded-r-xl rounded-l-sm shadow-float transition-transform duration-(--motion-fast) ease-entrance group-hover:-translate-y-1 group-focus-visible:-translate-y-1">
      {book.cover ? (
        <Image
          src={book.cover}
          alt=""
          fill
          sizes="(max-width: 580px) 220px, (max-width: 900px) 260px, (max-width: 1200px) 300px, 350px"
          className="object-cover"
          priority
        />
      ) : (
        <span className="flex size-full flex-col justify-between bg-accent p-8 text-on-accent w390:p-5">
          <span className="text-label leading-label tracking-eyebrow uppercase">
            {book.note}
          </span>
          <span className="font-display text-section-title leading-section-title font-semibold">
            {book.title}
          </span>
          <span className="text-body leading-body tracking-eyebrow uppercase">
            {book.author}
          </span>
        </span>
      )}
      {/* spine shading */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-linear-to-r from-foreground/25 to-transparent"
      />
    </span>
  </a>
);
