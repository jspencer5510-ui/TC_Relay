import Image from "next/image";

import { DisplayTitle } from "@/components/ui/display-title";
import { PillButton } from "@/components/ui/pill-button";
import { Reveal } from "@/components/ui/reveal";
import type { HeroContent } from "@/data/mocks/home/hero";

import { FeatureWindow } from "./feature-window";
import { LOAD } from "./timeline";

/**
 * 02 Hero — 1440 × 712 (Figma 3488:21055), directly under the nav.
 * Copy column at x80; the product window group (3542:24364) runs from x646
 * to the frame's right edge. Coordinates are section-relative.
 *
 * At 1024 (3603:2145) the section keeps its 712 height but is re-laid-out:
 * the copy column moves to x48 / 393 wide with a 44/52 headline, the bloom
 * shrinks to 645 × 583 at (396, 65), the two 12px field marks are gone and the
 * product window (3699:3) is a 516 × 659 portrait with a vertical flow.
 *
 * 768 (3832:6548, 976 tall): the copy stacks centred at the top and the window
 * (3834:893, 516 × 590, all corners round) sits under it at (126, 354) with
 * the vertical flow and one run row. 390 (3893:2141, 949 tall): the same
 * stack at 350 wide — full-width buttons, the note on two lines — and the
 * 768 flow scaled 310 / 380 inside a 350 × 515 window at (20, 422).
 */
export const Hero = ({
  chip,
  title,
  subhead,
  actions,
  feature,
}: HeroContent) => (
  <section
    id="hero"
    aria-label={`${title.before}${title.accent}${title.after}`}
    className="relative h-[calc(var(--hero-frame)+var(--hero-extra))]"
  >
    {/* the frame's own layout, centred in the viewport-tall section */}
    <div className="absolute inset-x-0 top-[calc(var(--hero-extra)/2)] h-(--hero-frame)">
        {/* Window bloom 3488:21056 — ellipse at x640 y40, SVG padded 200 (1400 × 1020).
        Not clipped: Figma's render carries the bloom up into the nav.
        Still — the cursor tilt/parallax was removed (owner, 2026-11-18). */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/assets/hero/hero-window-bloom.webp"
            alt=""
            width={1400}
            height={1020}
            quality={85}
            fetchPriority="high"
            decoding="sync"
            sizes="(max-width: 580px) 546px, (max-width: 900px) 1260px, (max-width: 1200px) 965px, 1400px"
            className="absolute -top-40 left-110 h-255 w-350 max-w-none object-cover w1024:-top-23.75 w1024:left-59 w1024:h-225.75 w1024:w-241.25 w768:-top-51.25 w768:-left-61.5 w768:h-312.5 w768:w-315 w390:-top-61.25 w390:-left-19.5 w390:w-136.5"
            priority
          />
        </div>

        {/* Copy column — chip, title, subhead, actions, note in normal flow
          (light re-content, ADR-0032): the Thinking Christian copy is ~3× the
          frame's, so it stacks instead of sitting on fixed Figma tops. Same
          column origin / width per frame as the original layout. */}
        <div className="absolute top-20 left-20 flex w-170 flex-col items-start gap-6 w1024:top-24 w1024:left-12 w1024:w-110 w1024:gap-5 w768:top-10 w768:left-1/2 w768:w-136 w768:-translate-x-1/2 w768:items-center w768:text-center w390:top-8 w390:w-87.5 w390:gap-4">
          {/* Release chip 3488:21930 — padding less the 1px border Figma draws inside. */}
          <Reveal delay={LOAD.copy.chip}>
            {/* eyebrow: plain orange capitals, as the site's other eyebrows */}
            <p className="text-label leading-label font-semibold tracking-eyebrow whitespace-nowrap text-accent uppercase">
              {chip}
            </p>
          </Reveal>

          <Reveal delay={LOAD.copy.title}>
            <DisplayTitle
              tag="h1"
              delay={LOAD.copy.title}
              {...title}
              className="text-hero-title leading-hero-title font-semibold! w768:text-center"
              accentClassName="text-hero-title"
              accentFamily="display"
            />
          </Reveal>

          <Reveal
            tag="p"
            variant="fade"
            delay={LOAD.copy.subhead}
            className="font-serif text-subtitle leading-lead font-medium text-foreground-muted w390:text-body w390:leading-body"
          >
            {subhead}
          </Reveal>

          <Reveal
            delay={LOAD.copy.actions}
            className="mt-2 flex items-center gap-3 w1024:flex-col w1024:items-start w768:flex-row w768:items-center w390:w-full w390:flex-col"
          >
            <PillButton
              href={actions.primary.href}
              size="lg"
              className="uppercase tracking-badge w390:w-full w390:justify-center"
            >
              {actions.primary.label}
            </PillButton>
            <PillButton
              href={actions.secondary.href}
              variant="glass"
              size="lg"
              className="uppercase tracking-badge w390:w-full w390:justify-center"
            >
              <Image
                src="/assets/hero/hero-play-icon.svg"
                alt=""
                width={16}
                height={16}
                className="size-4 shrink-0"
              />
              {actions.secondary.label}
            </PillButton>
          </Reveal>

        </div>

        {/* Tick 3488:21953 / 3603:2159 and field marks 3488:21954 / 3488:21956 —
          the 1024 frame drops both marks. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="absolute top-155 left-295 h-2 w-px bg-hero-tick w1024:top-136.5 w1024:left-243.75 w768:left-181.75 w390:left-92.25" />
          <Image
            src="/assets/hero/hero-field-mark.svg"
            alt=""
            width={12}
            height={12}
            className="absolute top-168 left-220 size-3 w1024:hidden"
          />
          <Image
            src="/assets/hero/hero-field-mark.svg"
            alt=""
            width={12}
            height={12}
            className="absolute top-167 left-322.5 size-3 w1024:hidden"
          />
        </div>

        {/* Featured panel in the product window's box. 768 / 390 stack it
          under the copy; the longer copy pushes it down by --hero-copy-extra. */}
        <div className="pointer-events-none absolute inset-0 translate-y-(--hero-copy-extra)">
          <FeatureWindow {...feature} />
        </div>
    </div>
  </section>
);
