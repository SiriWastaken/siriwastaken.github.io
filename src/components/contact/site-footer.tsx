import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer id="contact" aria-labelledby="contact-heading" className="pb-10">
      <Container>
        <div className="card reveal p-8 text-center sm:p-14">
          <h2 id="contact-heading" className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            Get in touch
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted">
            The best place to see what I&apos;m working on is GitHub.
            {site.linkedinUrl ? " For anything else, reach me on LinkedIn." : null}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={site.githubUrl} variant="primary">
              GitHub
            </ButtonLink>
            <ButtonLink href={site.dmojUrl}>DMOJ</ButtonLink>
            {site.linkedinUrl ? <ButtonLink href={site.linkedinUrl}>LinkedIn</ButtonLink> : null}
          </div>
        </div>
        <p className="mt-8 text-center font-mono text-xs text-muted">
          © {new Date().getFullYear()} {site.name}. Built with Next.js and Tailwind CSS.{" "}
          <TextLink href="https://github.com/SiriWastaken/sri-portfolio">Source</TextLink>
        </p>
      </Container>
    </footer>
  );
}
