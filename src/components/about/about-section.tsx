import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { site } from "@/data/site";

export function AboutSection() {
  return (
    <Section id="about" title="About me">
      <Reveal className="grid lg:grid-cols-12">
        <div className="max-w-3xl space-y-6 lg:col-span-7 lg:col-start-6">
          {site.about.map((text, i) => (
            <p key={i} className={`text-lg leading-relaxed ${i > 0 ? "text-muted" : ""}`}>
              {text}
            </p>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
