import type { ScaleContent } from "@/data/mocks/home/scale";

/**
 * "Refusing to Settle for Wholesomeness…" — the Body Building section's second
 * card (owner, 2026-11-19; ADR-0038). Replaces the animated "A life patterned
 * on God" regions card. Static on purpose: no reveal, no art, no motion — a
 * Server Component. Same shell as `ScaleCard`; the row stretches both cards to
 * the taller one, so this card's copy sets the row height.
 *
 * Episodes with `href: null` render as plain text until a link is supplied.
 */
export const HolinessCard = ({
  title,
  paragraphs,
  episodesLabel,
  episodes,
}: ScaleContent["holiness"]) => (
  <article className="flex w-157.5 flex-col gap-5 rounded-scale-card border border-border-subtle bg-linear-to-b/srgb from-scale-card-from to-scale-card-to p-7.75 w1024:w-114.5 w1024:p-5.75 w768:w-172 w390:w-87.5">
    <h3 className="font-display text-scale-card-title leading-scale-card-title font-medium tracking-scale-card-title text-foreground">
      {title}
    </h3>

    <div className="flex flex-col gap-3 text-scale-card-copy leading-scale-card-copy text-foreground-muted">
      {paragraphs.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>

    <div className="mt-auto flex flex-col gap-2 pt-2">
      <h4 className="text-label leading-label font-semibold tracking-eyebrow text-accent uppercase">
        {episodesLabel}
      </h4>
      <ul className="flex flex-col">
        {episodes.map(({ title: episode, href }) => (
          <li key={episode} className="border-b border-border-subtle last:border-b-0">
            {href ? (
              <a
                href={href}
                className="group flex items-baseline justify-between gap-4 py-2.5 text-body leading-body font-medium text-foreground transition-colors duration-(--motion-fast) ease-entrance hover:text-accent focus-visible:text-accent"
              >
                <span>{episode}</span>
                <span aria-hidden="true" className="shrink-0 text-accent">
                  →
                </span>
              </a>
            ) : (
              <p className="py-2.5 text-body leading-body font-medium text-foreground">{episode}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  </article>
);
