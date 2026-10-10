import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

const styles = {
  primary: "bg-ink text-bg hover:opacity-85",
  secondary: "bg-surface-2 text-ink hover:bg-rule-strong",
};

export function ButtonLink({ href, children, variant = "secondary" }: ButtonLinkProps) {
  const className = `inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-medium transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-95 ${styles[variant]}`;

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
