import { DrawLine } from "@/components/ui/draw-line";
import { SectionHead } from "@/components/ui/section-head";
import type { ProductContent } from "@/data/mocks/home/product";

import { RowApproval } from "./row-approval";
import { RowChart } from "./row-chart";
import { RowTrace } from "./row-trace";
import type { FeatureCopy } from "./feature-row";

/** Hairline between blocks, draws from the left — 1280 × 1, white 9% (3488:21998, 22043, 22077). */
const Hairline = ({ className = "" }: { className?: string }) => (
  <DrawLine className={`h-px shrink-0 bg-product-hairline ${className}`} />
);

/**
 * 04 Product — 1440 × 1593, content 1280 from x80 y96 (Figma 3888:5813).
 * Head (174) → hairline → rows of 424 / 424 / 376 split by hairlines; 96 below.
 *
 * 1024 (3888:10220) — 1509 tall, content 928 from x48 y40: the head stacks
 * centred (206), then rows of 388 / 384 / 408 and 80 below.
 *
 * 768 (3832:7487) — 2000 tall, content 688 from x40 y40: head 178, every
 * block 16 apart, rows stack copy over card (545 / 545 / 513), 80 below.
 *
 * 390 (3893:3087) — 1680 tall, content 350 from x20 y48: blocks 32 apart,
 * rows 389 / 429 / 403, 48 below.
 */
type RowKind = "trace" | "approval" | "chart";

export interface ProductSectionProps {
  /** Anchor id (the stream path anchors to "product"). */
  id: string;
  label: string;
  head: ProductContent["patterns"]["head"];
  /** Feature rows; none renders the head alone (doc 2026-11-14). */
  rows?: readonly (FeatureCopy & { kind: RowKind })[];
  graphics: Pick<ProductContent, "trace" | "approval" | "chart">;
}

/**
 * "Content service" section — head plus any number of feature rows, each
 * reusing one of the three row visuals (ADR-0033: the page uses it twice,
 * Patterns without rows and the Framework with 01–04). Height follows the
 * content; the rows keep their per-frame heights.
 */
export const Product = ({ id, label, head, rows = [], graphics }: ProductSectionProps) => (
  <section
    id={id}
    aria-label={label}
    className="[content-visibility:auto] relative flex flex-col px-page-inset pt-24 pb-12 w1024:pt-20 w768:pt-11 w768:gap-4 w390:gap-8 w390:pt-12"
  >
    <SectionHead
      stackClassName="w768:gap-4"
      asideClassName="w1024:w-120! w768:w-130! w390:w-full!"
      badge={head.badge}
      title={head.title}
      aside={head.aside}
      className={rows.length ? "pb-16 w1024:pb-8 w768:pb-4 w390:pb-0" : ""}
    />
    {rows.map((row, i) => {
      const line = <Hairline key={`line-${row.index}`} className={i === 0 ? "" : "w390:hidden"} />;
      const copy = { index: row.index, title: row.title, body: row.body, cta: row.cta };
      if (row.kind === "trace")
        return [line, <RowTrace key={row.index} trace={{ ...graphics.trace, ...copy }} />];
      if (row.kind === "approval")
        return [line, <RowApproval key={row.index} approval={{ ...graphics.approval, ...copy }} />];
      return [line, <RowChart key={row.index} chart={{ ...graphics.chart, ...copy }} />];
    })}
  </section>
);
