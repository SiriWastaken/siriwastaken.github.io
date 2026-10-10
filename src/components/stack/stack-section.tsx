import { Section } from "@/components/ui/section";
import { stack } from "@/data/stack";
import { TechIcon } from "./tech-icon";

export function StackSection() {
  return (
    <Section
      id="stack"
      index="02"
      label="Stack"
      title="What I work with"
      intro={<p>The tools I reach for, and where each one shows up in the projects above.</p>}
    >
      <div className="border-b border-rule">
        {stack.map((group) => (
          <div key={group.label} className="reveal grid gap-y-2 border-t border-rule py-6 md:grid-cols-12 md:gap-x-8">
            <h3 className="font-mono text-xs tracking-wide text-muted uppercase md:col-span-3 md:pt-1">
              {group.label}
            </h3>
            <ul className="grid gap-x-8 sm:grid-cols-2 md:col-span-9">
              {group.items.map((tech) => (
                <li key={tech.name}>
                  <a
                    href={tech.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-4 py-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <TechIcon icon={tech.icon} className="mt-0.5 size-5" />
                    <div>
                      <p className="flex flex-wrap items-baseline gap-x-2 font-medium">
                        <span className="underline decoration-transparent decoration-1 underline-offset-4 transition-colors group-hover:decoration-rule-strong">
                          {tech.name}
                        </span>
                        <span className="sr-only">(opens {tech.name} site in a new tab)</span>
                        {tech.learning ? (
                          <span className="font-mono text-[11px] font-normal tracking-wide text-accent uppercase">
                            Learning
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-muted">{tech.usedIn}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
