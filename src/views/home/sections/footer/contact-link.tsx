/**
 * The CTA panel's contact row (ADR-0032) — replaces the starter's signup form,
 * which collected nothing (it only flipped to a "sent" state). Same white pill
 * as the form so the panel keeps its shape: the address on the left, a
 * "Contact Us" button that opens the visitor's mail client.
 */
export const ContactLink = ({
  email,
  label,
  className = "",
}: {
  email: string;
  label: string;
  className?: string;
}) => (
  <a
    href={`mailto:${email}`}
    className={`group relative flex h-13 w-162.5 items-center gap-2 overflow-clip rounded-full bg-footer-signup-fill py-1.5 pr-1.5 pl-5 w1024:h-14 w1024:w-102.25 w1024:py-2 w1024:pr-2 w768:w-160 w390:w-77.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-on-accent ${className}`}
  >
    <span className="min-w-px flex-1 truncate text-body leading-body text-foreground">
      {email}
    </span>
    <span className="flex h-10 shrink-0 items-center justify-center rounded-full bg-accent px-6 text-label leading-label font-medium whitespace-nowrap text-on-accent transition-colors duration-(--motion-fast) ease-entrance group-hover:bg-foreground">
      {label}
    </span>
  </a>
);
