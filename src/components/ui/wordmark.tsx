/**
 * Thinking Christian wordmark — "Thinking" in Playfair, "Christian" in
 * Playfair italic, brand orange (owner logo, 2026-11-15). Live text, not an
 * image: crisp at every size, and the name stays readable to assistive tech.
 * Size, leading and visibility come from `className`.
 */
export const Wordmark = ({ className = "" }: { className?: string }) => (
  <span className={`font-display whitespace-nowrap text-foreground ${className}`}>
    Thinking <span className="text-title-accent italic">Christian</span>
  </span>
);
