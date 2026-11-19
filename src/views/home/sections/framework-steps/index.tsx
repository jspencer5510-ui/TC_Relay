import type { TitleParts } from "@/components/ui/display-title";

export interface FrameworkStep {
  index: string;
  title: string;
  body: string;
}

export interface FrameworkStepsProps {
  head: { badge: string; title: TitleParts; aside: string };
  rows: readonly FrameworkStep[];
  link: { label: string; href: string };
}

/**
 * The Thinking Christian Framework — four numbered practices (owner,
 * 2026-11-19; ADR-0039). Adapted from GetLayers "Numeral Steps": a top line
 * (eyebrow + link), an intro column (title at the top, paragraphs at the
 * bottom) and a framed list of steps, each with a large numeral.
 *
 * Static and server-rendered: no pinned scroll, no drifting numerals, no
 * reveals — only the link's hover colour (CSS transition exception). Brand
 * page, Playfair titles with the Cormorant accent, Public Sans copy, numerals
 * in brand orange. The intro paragraph is split at its second sentence.
 * Below 900 it stacks: intro, then the list.
 */
export const FrameworkSteps = ({ head, rows, link }: FrameworkStepsProps) => {
  const [lead, ...rest] = head.aside.split(/(?<=God's\.) /);
  const paragraphs = [lead, rest.join(" ")].filter(Boolean);

  return (
    <section
      id="framework"
      aria-labelledby="framework-title"
      className="relative mx-page w-page px-page-inset py-24 w1024:py-20 w768:py-16 w390:py-12"
    >
      <div className="flex items-start justify-between gap-5">
        <p className="text-label leading-label font-semibold tracking-eyebrow text-accent uppercase">
          {head.badge}
        </p>
        <a
          href={link.href}
          className="shrink-0 text-body leading-body font-medium text-foreground underline decoration-1 underline-offset-4 transition-colors duration-(--motion-fast) ease-entrance hover:text-accent focus-visible:text-accent"
        >
          {link.label}
        </a>
      </div>

      <div className="mt-16 grid grid-cols-12 gap-x-5 w768:mt-12 w768:grid-cols-1 w768:gap-y-12 w390:mt-10">
        {/* Intro — columns 1–5: title at the top, paragraphs at the bottom */}
        <div className="col-span-5 flex flex-col justify-between gap-16 pt-6 w768:col-span-1 w768:justify-start w768:gap-6 w768:pt-0">
          <h2
            id="framework-title"
            className="bg-linear-to-b/srgb from-title-gradient-from to-title-gradient-to bg-clip-text font-display text-section-title leading-section-title font-medium tracking-title text-transparent"
          >
            {head.title.before}
            <span className="font-serif text-section-title-accent leading-none font-medium text-title-accent italic">
              {head.title.accent}
            </span>
            {head.title.after}
          </h2>
          <div className="flex flex-col gap-5 text-lead leading-lead text-foreground-muted w390:text-body w390:leading-body">
            {paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>

        {/* Steps — columns 7–12, framed top and bottom */}
        <ol className="col-span-6 col-start-7 border-y border-steps-rule-frame w768:col-span-1 w768:col-start-1">
          {rows.map((step) => (
            <li
              key={step.index}
              className="flex items-end justify-between gap-5 border-b border-steps-rule pt-8 pb-6 last:border-b-0 w390:gap-3 w390:pt-6 w390:pb-4"
            >
              <div className="flex min-w-0 flex-col gap-1.5 pb-3">
                <h3 className="font-display text-steps-title leading-steps-title font-medium text-foreground">
                  {step.title}
                </h3>
                <p className="text-body leading-body text-foreground-muted">{step.body}</p>
              </div>
              <span
                aria-hidden="true"
                className="shrink-0 font-display text-steps-number leading-steps-number font-medium tracking-steps-number text-title-accent tabular-nums lining-nums"
              >
                {step.index}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
