import Link from "next/link";

type TextLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

const base =
  "text-ink underline decoration-accent decoration-1 underline-offset-4 transition-colors hover:text-accent motion-safe:hover:decoration-2";

/** Inline link. External URLs open in a new tab and say so to screen readers. */
export function TextLink({ href, children, className = "" }: TextLinkProps) {
  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={`${base} ${className}`}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}
