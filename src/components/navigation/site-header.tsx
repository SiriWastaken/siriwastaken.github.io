import Link from "next/link";
import { NavLinks } from "./nav-links";
import { Container } from "@/components/ui/container";
import { site } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg">
      <Container className="flex h-14 items-center justify-between gap-6">
        <Link href="/" className="font-mono text-sm font-medium">
          <span className="sm:hidden">{site.shortName}</span>
          <span className="hidden sm:inline">{site.name}</span>
          <span aria-hidden="true" className="text-accent">
            _
          </span>
        </Link>
        <NavLinks />
      </Container>
    </header>
  );
}
