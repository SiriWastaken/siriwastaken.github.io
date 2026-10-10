import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { TechTile } from "@/components/stack/tech-icon";
import { site } from "@/data/site";
import { stack } from "@/data/stack";

// One tile per distinct brand mark (React and React Native share a logo).
const tiles = [...new Map(stack.flatMap((group) => group.items).map((tech) => [tech.icon.title, tech])).values()];

export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden pt-20 pb-16 text-center sm:pt-32 sm:pb-24"
    >
      <div aria-hidden="true" className="hero-glow" />
      <Container className="flex flex-col items-center">
        <h1
          id="hero-heading"
          className="enter max-w-4xl text-6xl font-semibold tracking-tighter text-balance sm:text-8xl"
        >
          Hi, I&apos;m {site.shortName}.
        </h1>
        <p className="enter [--i:1] mt-8 max-w-2xl text-xl leading-snug text-balance text-muted sm:text-2xl">
          I&apos;m a student developer building full-stack software, robotics tools, and systems that solve real
          problems, from FRC Team 610&apos;s scouting tablets to the web.
        </p>

        <div className="enter [--i:2] mt-10 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/#work" variant="primary">
            View projects
          </ButtonLink>
          <ButtonLink href={site.githubUrl}>GitHub</ButtonLink>
          {site.linkedinUrl ? <ButtonLink href={site.linkedinUrl}>LinkedIn</ButtonLink> : null}
          <ButtonLink href={site.dmojUrl}>DMOJ</ButtonLink>
        </div>

        <ul
          aria-label="Technologies I use"
          className="enter [--i:3] mt-16 flex max-w-2xl flex-wrap justify-center gap-3"
        >
          {tiles.map((tech) => (
            <li key={tech.icon.title} title={tech.name} className="group">
              <TechTile icon={tech.icon} className="size-12" />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
