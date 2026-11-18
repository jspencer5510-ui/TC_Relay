import type { RefObject } from "react";

import { InviewSeen } from "@/components/ui/inview-seen";
import { TYPE_WIPE, TypeText, type TypeTextProps } from "@/components/ui/type-text";


/**
 * TypeText, optionally triggered elsewhere. (The old sub-pixel nudge on the
 * 1ch clip went with the brand-font pass — the wipe needs none.)
 *
 * With `trigger`, the typing runs off that element being seen instead of the
 * label itself — TypeText's markup and timing, driven by the card: at 1440 the
 * pinned section is covered by the footer before a card's period line ever
 * reaches the view line.
 */
export const TypeLabel = ({
  className = "",
  trigger,
  ...props
}: TypeTextProps & { trigger?: RefObject<HTMLElement> }) => {
  if (!trigger)
    return (
      <TypeText
        {...props}
        className={className}
      />
    );

  const { children, tag = "span", delay = 0, per = 30 } = props;
  return (
    <InviewSeen
      tag={tag}
      mode="once"
      trigger={trigger}
      className={`relative inline-block ${className}`}
      from={{ "--typed": 0 }}
      to={{ "--typed": 1 }}
      config={{ duration: children.length * per }}
      delayIn={delay}
      style={{ clipPath: TYPE_WIPE }}
    >
      {children}
    </InviewSeen>
  );
};
