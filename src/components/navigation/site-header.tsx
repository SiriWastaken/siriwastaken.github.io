import Link from "next/link";
import { NavLinks } from "./nav-links";
import { Container } from "@/components/ui/container";
import { site } from "@/data/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-bg/80 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-12 items-center justify-between gap-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          <span className="sm:hidden">{site.shortName}</span>
          <span className="hidden sm:inline">{site.name}</span>
        </Link>
        <NavLinks />
      </Container>
    </header>
  );
}
