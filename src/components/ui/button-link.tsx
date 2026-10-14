import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

const styles = {
  primary: "bg-accent text-on-accent border-accent hover:bg-ink hover:border-ink hover:text-bg",
  secondary: "border-rule-strong text-ink hover:border-accent hover:text-accent",
};

export function ButtonLink({ href, children, variant = "secondary" }: ButtonLinkProps) {
  const className = `group inline-flex h-11 items-center gap-2 border px-5 font-mono text-sm transition-colors duration-150 ${styles[variant]}`;
  const external = href.startsWith("http");
  const arrow = (
    <span
      aria-hidden="true"
      className={`inline-block transition-transform duration-150 ${external ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}
    >
      {external ? "↗" : "↓"}
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
        {arrow}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
      {arrow}
    </Link>
  );
}
