import { Section } from "@/components/ui/section";
import { stack } from "@/data/stack";
import { TechTile } from "./tech-icon";

export function StackSection() {
  return (
    <Section
      id="stack"
      title="What I work with"
      intro={<p>The tools I reach for, and where each one shows up in the projects above.</p>}
    >
      <div className="grid gap-5 md:grid-cols-2">
        {stack.map((group) => (
          <div key={group.label} className="card reveal p-6 sm:p-8">
            <h3 className="font-mono text-xs tracking-wide text-muted uppercase">{group.label}</h3>
            <ul className="mt-4 grid gap-1">
              {group.items.map((tech) => (
                <li key={tech.name}>
                  <a
                    href={tech.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group -mx-3 flex items-start gap-4 rounded-2xl p-3 transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent"
                  >
                    <TechTile icon={tech.icon} />
                    <div>
                      <p className="flex flex-wrap items-baseline gap-x-2 font-medium">
                        {tech.name}
                        {tech.learning ? (
                          <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-normal tracking-wide text-accent uppercase">
                            Learning
                          </span>
                        ) : null}
                        <span className="sr-only">(opens {tech.name} site in a new tab)</span>
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
