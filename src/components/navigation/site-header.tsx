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
    <header className="sticky top-0 z-40 bg-bg/75 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Main">
          <ul className="flex items-center gap-1 text-sm">
            {links.map((link) => (
              <li key={link.href} className={link.wideOnly ? "hidden sm:block" : undefined}>
                <Link
                  href={link.href}
                  className="rounded-full px-3.5 py-2 text-muted transition-colors hover:bg-surface-2 hover:text-ink"
                >
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
