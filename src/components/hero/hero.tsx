import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { site } from "@/data/site";
import { Duel } from "./duel";
import { HeroHeadline } from "./hero-headline";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="border-b border-rule pt-12 pb-16 sm:pt-20 sm:pb-24">
      <Container>
        <HeroHeadline />
        <Reveal delay={0.4} className="mt-12 grid gap-x-12 gap-y-14 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="max-w-lg text-xl leading-snug text-pretty sm:text-2xl">
              I&apos;m Sri. I build scouting apps, dashboards, and CLI tools, and I benchmark my own decisions.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/#work" variant="primary">
                See the work
              </ButtonLink>
              <ButtonLink href={site.githubUrl}>GitHub</ButtonLink>
              <ButtonLink href={site.dmojUrl}>DMOJ</ButtonLink>
              {site.linkedinUrl ? <ButtonLink href={site.linkedinUrl}>LinkedIn</ButtonLink> : null}
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <Duel />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
