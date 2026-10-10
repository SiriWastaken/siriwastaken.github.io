import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

const styles = {
  primary: "bg-ink text-bg hover:bg-accent",
  secondary: "border border-rule-strong text-ink hover:border-ink",
};

export function ButtonLink({ href, children, variant = "secondary" }: ButtonLinkProps) {
  const className = `inline-flex h-10 items-center gap-2 rounded-sm px-4 text-sm font-medium transition-all motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-95 ${styles[variant]}`;

  if (href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
