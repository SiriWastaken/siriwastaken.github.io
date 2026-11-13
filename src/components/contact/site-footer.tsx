import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { site } from "@/data/site";

const links = [
  ...(site.email ? [{ label: "Email", href: `mailto:${site.email}` }] : []),
  { label: "GitHub", href: site.githubUrl },
  { label: "DMOJ", href: site.dmojUrl },
];

export function SiteFooter() {
  return (
    <footer id="contact" aria-labelledby="contact-heading" className="bg-surface pt-20 pb-10 sm:pt-32">
      <Container>
        <h2
          id="contact-heading"
          className="font-display text-6xl leading-none sm:text-8xl"
        >
          Say hi<span className="text-accent">.</span>
        </h2>
        <ul className="mt-10 border-b border-rule-strong">
          {links.map((link) => (
            <li key={link.label} className="border-t border-rule-strong">
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group flex items-baseline justify-between py-4 font-display text-2xl transition-colors hover:text-accent sm:text-3xl"
              >
                <span>
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </span>
                <span
                  aria-hidden="true"
                  className="text-2xl transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1"
                >
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-12 text-xs text-muted">
          © {new Date().getFullYear()} Sri · <TextLink href="https://github.com/SiriWastaken/sri-portfolio">source</TextLink>
        </p>
      </Container>
    </footer>
  );
}
