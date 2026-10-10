import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pt-16 pb-8 sm:pt-24">
      <Container>
        <div className="grid gap-y-6 md:grid-cols-12 md:gap-x-8">
          <p className="enter font-mono text-xs leading-relaxed text-muted md:col-span-3 md:pt-4">
            Student developer
            <br />
            FRC Team 610
          </p>

          <div className="md:col-span-9">
            <h1 id="hero-heading" className="enter [--i:1] bg-linear-to-b from-ink from-60% to-muted bg-clip-text text-5xl font-semibold tracking-tight text-transparent sm:text-6xl">
              Hi, I&apos;m {site.shortName}.
            </h1>
            <p className="enter [--i:2] mt-6 max-w-3xl text-xl leading-snug text-balance sm:text-2xl">
              I&apos;m a student developer building full-stack software, robotics tools, and systems that solve real
              problems.
            </p>
            <p className="enter [--i:3] mt-6 max-w-2xl leading-relaxed text-muted">
              A lot of my work comes from FIRST Robotics Competition Team 610, where I build software that supports the team beyond the robot itself. 
              I work across scouting, data analysis, strategy, and internal tools; building projects and systems
               that have to work reliably in the middle of a competition, not just in a fancy demo.

            </p>

            <div className="enter [--i:4] mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/#work" variant="primary">
                View projects
              </ButtonLink>
              <ButtonLink href={site.githubUrl}>GitHub</ButtonLink>
              {site.linkedinUrl ? <ButtonLink href={site.linkedinUrl}>LinkedIn</ButtonLink> : null}
              <ButtonLink href={site.dmojUrl}>DMOJ</ButtonLink>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
