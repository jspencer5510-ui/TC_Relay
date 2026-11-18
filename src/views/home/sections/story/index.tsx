import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { DisplayTitle } from "@/components/ui/display-title";
import { PillButton } from "@/components/ui/pill-button";
import { Reveal } from "@/components/ui/reveal";
import type { StoryContent } from "@/data/mocks/home/story";
import { REVEAL } from "@/lib/motion";

/**
 * Story — text and picture (doc 2026-11-14, ADR-0033). Eyebrow, heading,
 * three paragraphs and two CTAs beside a portrait; stacked from 768 down.
 * Normal flow throughout — the copy is long and owner-edited, so nothing sits
 * on fixed coordinates. Until `photo` is set the portrait slot shows a
 * monogram stand-in; drop the image in public/assets/story/ and set `photo`.
 */
export const Story = ({
  eyebrow,
  title,
  paragraphs,
  primary,
  secondary,
  photo,
  photoAlt,
}: StoryContent) => (
  <section
    id="story"
    aria-label={`${title.before}${title.accent}${title.after}`}
    className="[content-visibility:auto] relative mx-page flex w-page items-center justify-between gap-16 px-page-inset py-24 w1024:gap-10 w1024:py-20 w768:flex-col-reverse w768:gap-10 w768:py-12 w390:gap-8"
  >
    <div className="flex w-150 flex-col items-start gap-6 w1024:w-115 w768:w-full w768:items-center w768:text-center">
      <Reveal>
        <Badge label={eyebrow} />
      </Reveal>
      <DisplayTitle
        {...title}
        className="text-section-title leading-section-title"
        accentClassName="text-section-title-accent"
      />
      {paragraphs.map((paragraph, i) => (
        <Reveal
          key={paragraph.slice(0, 24)}
          tag="p"
          variant="fade"
          delay={(i + 1) * REVEAL.step}
          className="text-body leading-body text-foreground-muted"
        >
          {paragraph}
        </Reveal>
      ))}
      <Reveal
        delay={(paragraphs.length + 1) * REVEAL.step}
        className="mt-2 flex flex-wrap items-center gap-3 w768:justify-center w390:w-full w390:flex-col"
      >
        <PillButton href={primary.href} className="uppercase tracking-badge w390:w-full w390:justify-center">
          {primary.label}
        </PillButton>
        <PillButton href={secondary.href} variant="glass" className="uppercase tracking-badge w390:w-full w390:justify-center">
          {secondary.label}
        </PillButton>
      </Reveal>
    </div>

    <Reveal
      delay={REVEAL.step}
      className="relative aspect-4/5 w-115 shrink-0 overflow-clip rounded-product-card border border-product-card-border bg-surface-raised shadow-float w1024:w-90 w768:w-80 w390:w-full"
    >
      {photo ? (
        <Image
          src={photo}
          alt={photoAlt}
          fill
          sizes="(max-width: 580px) 350px, (max-width: 900px) 320px, (max-width: 1200px) 360px, 460px"
          className="object-cover"
        />
      ) : (
        <span
          role="img"
          aria-label={photoAlt}
          className="flex size-full items-center justify-center bg-linear-to-b from-surface-raised to-background font-display text-section-title-accent font-medium text-title-accent"
        >
          JS
        </span>
      )}
    </Reveal>
  </section>
);
