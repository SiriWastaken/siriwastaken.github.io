import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/data/site";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#stack", label: "Stack" },
  { href: "/#frc", label: "FRC", wideOnly: true },
  { href: "/#about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/80 backdrop-blur-md">
      <Container className="flex h-14 items-center justify-between gap-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-5 text-sm sm:gap-7">
            {links.map((link) => (
              <li key={link.href} className={link.wideOnly ? "hidden sm:block" : undefined}>
                <Link href={link.href} className="text-muted transition-colors hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
