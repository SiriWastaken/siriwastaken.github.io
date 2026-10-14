import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

export function AboutSection() {
  return (
    <Section id="about" index="04" title="About me">
      <Reveal className="grid lg:grid-cols-12">
        <div className="max-w-3xl space-y-6 lg:col-span-7 lg:col-start-6">
          <p className="text-lg leading-relaxed">
            I&apos;m a high-school student who likes building things and figuring out how they work. I started with
            Java, took ICS3U, and built a Swing game for the Grade 11 final. Now it&apos;s mostly TypeScript: React
            Native on our team&apos;s scouting tablets, Next.js for the web.
          </p>
          <p className="text-lg leading-relaxed text-muted">
            I like software that has to survive something messy: tablets syncing through a network box we built
            ourselves, scouts who need to enter data faster, a benchmark that has to back up its own numbers. Next up is
            my first open-source contribution, starting with The Blue Alliance.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
