import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";
import { stack } from "@/data/stack";
import { TechTile } from "./tech-icon";

export function StackSection() {
  return (
    <Section id="stack" index="02" title="What I use">
      <div className="border-b border-rule-strong">
        {stack.map((group) => (
          <Reveal key={group.label} y={12}>
            <div className="grid gap-x-10 gap-y-6 border-t border-rule-strong py-8 lg:grid-cols-12">
              <h3 className="kicker lg:col-span-3">{group.label}</h3>
              <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:col-span-9">
                {group.items.map((tech) => (
                  <li key={tech.name}>
                    <a href={tech.url} target="_blank" rel="noreferrer" className="group flex items-start gap-4">
                      <TechTile icon={tech.icon} />
                      <div>
                        <p className="font-medium transition-colors group-hover:text-accent">
                          {tech.name}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">{tech.usedIn}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
