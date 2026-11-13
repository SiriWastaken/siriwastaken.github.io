import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { site } from "@/data/site";

const now = ["Learning Swift and SwiftUI", "Building Scouting Web 2027", "Heading into open source"];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pt-20 pb-20 sm:pt-32 sm:pb-28">
      <Container>
        <h1 id="hero-heading" className="font-display max-w-4xl text-[clamp(2.6rem,7vw,5.5rem)] leading-[1.02] text-balance">
          Still learning.
          <br />
          <span className="text-accent">Building as I go.</span>
        </h1>
        <Reveal delay={0.1} className="mt-8 max-w-2xl">
          <p className="text-xl leading-snug text-muted text-pretty sm:text-2xl">
            I&apos;m Sri, a high-school student. I learn by building: scouting tools for our robotics team, a database
            benchmark, and some developer tooling.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <ButtonLink href="/#work" variant="primary">
              See what I&apos;ve built
            </ButtonLink>
            <TextLink href={site.githubUrl}>GitHub</TextLink>
            <TextLink href={site.dmojUrl}>DMOJ</TextLink>
          </div>
          <dl className="mt-12 grid max-w-xl gap-x-8 gap-y-1 border-t border-rule-strong pt-5 text-sm sm:grid-cols-[auto_1fr]">
            <dt className="kicker">Right now</dt>
            <dd>
              <ul className="grid gap-1">
                {now.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </dl>
        </Reveal>
      </Container>
    </section>
  );
}
