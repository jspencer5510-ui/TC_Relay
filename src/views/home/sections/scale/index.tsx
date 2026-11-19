import { SectionHead } from "@/components/ui/section-head";
import type { ScaleContent } from "@/data/mocks/home/scale";

import { HolinessCard } from "./holiness-card";
import { RuntimeCard } from "./runtime-card";

/**
 * 06 Scale — four frames: 1440 × 758 (3888:6445), 1024 × 858 (3888:10842),
 * 768 × 1286 (3832:8109), 390 × 1138 (3893:3743).
 * Head at (80, 96) / (48, 80) / (40, 80) / (20, 48); cards at (80, 254) side by
 * side 20 apart / (48, 286) 12 apart / (40, 274) stacked 12 apart / (20, 248)
 * stacked 12 apart.
 *
 * The cards sit in flow under the absolute head (padding = the frames' card
 * top), so the section grows with the taller card — the static HolinessCard
 * (ADR-0038) is longer than the Figma 480.
 */
export const Scale = ({ head, runtime, holiness }: ScaleContent) => (
  <section
    id="scale"
    aria-label="Reliability"
    className="[content-visibility:auto] relative pt-63.5 w1024:pt-71.5 w768:pt-68.5 w390:pt-62"
  >
    <SectionHead
      /* the aside wraps at 516 (1024, 3888:10849) and 514 (768) */
      asideClassName="w1024:w-129! w768:w-128.5! w390:w-85!"
      {...head}
      className="absolute top-24 left-20 w-320 w1024:top-20 w1024:left-12 w1024:w-232 w768:left-10 w768:w-172 w390:top-12 w390:left-5 w390:w-87.5"
    />
    <div className="relative ml-20 flex gap-5 w1024:ml-12 w1024:gap-3 w768:ml-10 w768:flex-col w390:ml-5">
      <RuntimeCard {...runtime} index={0} />
      <HolinessCard {...holiness} />
    </div>
  </section>
);
