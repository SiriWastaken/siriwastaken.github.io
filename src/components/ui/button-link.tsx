import Link from "next/link";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
};

const styles = {
  primary: "bg-accent text-on-accent hover:opacity-90",
  secondary: "bg-surface text-ink hover:bg-rule",
};

export function ButtonLink({ href, children, variant = "secondary" }: ButtonLinkProps) {
  const className = `inline-flex h-11 items-center rounded-md px-5 text-base font-medium transition-[opacity,background-color] duration-150 ${styles[variant]}`;

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
