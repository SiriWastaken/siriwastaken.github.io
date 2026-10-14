import Link from "next/link";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button-link";
import { Container } from "@/components/ui/container";
import { site } from "@/data/site";
import { HeroHeadline } from "./hero-headline";

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="border-b border-rule pt-12 pb-16 sm:pt-20 sm:pb-24">
      <Container>
        <HeroHeadline />
        <Reveal delay={0.4} className="mt-12 grid gap-x-12 gap-y-14 lg:mt-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="max-w-xl text-xl leading-snug text-pretty sm:text-2xl">
              I&apos;m Sri. I write code: For fun and to learn. A lot of my projects are... messy. A lot of them aren&apos;t fully functional. But, they&apos;re all made with blood, sweat, tears, and lots of AI tokens!
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/#work" variant="primary">
                See my work
              </ButtonLink>
              <ButtonLink href={site.githubUrl}>GitHub</ButtonLink>
              <ButtonLink href={site.dmojUrl}>DMOJ</ButtonLink>
              {site.linkedinUrl ? <ButtonLink href={site.linkedinUrl}>LinkedIn</ButtonLink> : null}
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="font-display text-8xl leading-none tracking-tight text-accent sm:text-9xl">84.7%</p>
            <p className="mt-4 max-w-sm text-lg leading-snug">
              of winning alliances picked correctly by the app&apos;s match predictor at the 2026 Ontario Provincial
              Championships.
            </p>
            <Link
              href="/projects/scouting-app-2026"
              className="mt-4 inline-block font-mono text-sm text-ink underline decoration-accent decoration-1 underline-offset-4 transition-colors hover:text-accent"
            >
              How the app works
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
