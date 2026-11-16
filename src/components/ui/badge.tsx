export interface BadgeProps {
  label: string;
  className?: string;
}

/**
 * Section eyebrow — plain brand-orange capitals with wide tracking, as on
 * thinkingchristian.org (owner, 2026-11-15: no pill, no dot). The name stays
 * `Badge` so every section head picks it up. `--tracking-eyebrow` is 0.219em.
 */
export const Badge = ({ label, className = "" }: BadgeProps) => (
  <span
    className={`text-label leading-label font-semibold tracking-eyebrow uppercase text-accent ${className}`}
  >
    {label}
  </span>
);
