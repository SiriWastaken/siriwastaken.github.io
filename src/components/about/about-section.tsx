import { Section } from "@/components/ui/section";

export function AboutSection() {
  return (
    <Section id="about" title="A bit about me">
      <div className="card reveal mx-auto max-w-3xl p-6 sm:p-10">
        <div className="space-y-5 text-lg leading-relaxed">
          <p>
            I’m a high-school student who builds software, mostly for FRC Team 610 and partly because I like making
            things and figuring out how they work. I started coding in Java before taking ICS3U (Introduction to
            Computer Science - Grade 11), where I learned more of the language and built a bunch of smaller projects.
            From there, I moved on to larger projects like a Swing game for my Grade 11 CS final. These days, I mostly
            write TypeScript, using React Native for our team’s scouting tablets and Next.js for the web.
          </p>
          <p className="text-muted">
            The problems I like best are where software meets something messy: a competition with bad Wi-Fi, scouts who
            need to enter data faster, a benchmark that has to prove its own numbers. I&apos;m also working toward my
            first open-source contributions, starting with The Blue Alliance.
          </p>
        </div>
      </div>
    </Section>
  );
}
