import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { TextLink } from "@/components/ui/text-link";
import { site } from "@/data/site";
import { HeroHeadline } from "./hero-headline";

const now = [
  { label: "Learning Swift and SwiftUI", dot: "bg-pop-orange" },
  { label: "Building Scouting Web 2027", dot: "bg-pop-pink" },
  { label: "Heading into open source", dot: "bg-pop-green" },
];

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="pt-20 pb-24 text-center sm:pt-32 sm:pb-36">
      <Container>
        <HeroHeadline />
        <Reveal delay={0.4} className="mx-auto mt-8 max-w-2xl">
          <p className="text-xl leading-snug text-muted text-pretty sm:text-2xl">
            I&apos;m Sri, a high-school student. I learn by building: scouting tools for our robotics team, a database
            benchmark, and some developer tooling.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <ButtonLink href="/#work" variant="primary">
              See what I&apos;ve built
            </ButtonLink>
            <TextLink href={site.githubUrl}>GitHub</TextLink>
            <TextLink href={site.dmojUrl}>DMOJ</TextLink>
          </div>
          <ul aria-label="Right now" className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
            {now.map((item) => (
              <li key={item.label} className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2">
                <span aria-hidden="true" className={`size-2 rounded-full ${item.dot}`} />
                {item.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
