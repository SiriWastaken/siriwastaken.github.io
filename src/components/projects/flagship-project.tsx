import { getProjectAssets } from "@/assets/projects";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/data/types";
import { HighlightList } from "./highlight-list";
import { ProjectImage } from "./project-image";
import { ProjectLinks } from "./project-links";
import { ProjectTitle } from "./project-title";
import { SystemFlow } from "./system-flow";
import { TechList } from "./tech-list";

type FlagshipProps = { project: Project; index: number };

/** The largest treatment: copy on one side, the product on the other, flipping sides down the page. */
export function FlagshipProject({ project, index }: FlagshipProps) {
  const { hero } = getProjectAssets(project.slug);
  const flip = index % 2 === 1;

  return (
    <article
      aria-labelledby={`project-${project.slug}`}
      className="border-t border-ink pt-6 pb-20 sm:pb-28"
    >
      <Reveal y={28} className="grid gap-x-12 gap-y-8 lg:grid-cols-12">
        <div className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
          <p className="font-mono text-xs text-muted">
            <span className="text-accent">{String(index + 1).padStart(2, "0")}</span> · {project.year.replace(" season", "")}
          </p>
          <ProjectTitle project={project} className="mt-4 text-4xl sm:text-5xl" />
          <p className="mt-5 text-lg leading-relaxed">{project.summary}</p>
          <HighlightList items={project.highlights} limit={2} className="mt-6 text-muted" />
          <TechList technologies={project.technologies} className="mt-6" />
          <ProjectLinks project={project} className="mt-6" />
        </div>

        <div className={`min-w-0 lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
          <div className="border border-rule-strong bg-surface transition-colors duration-200 hover:border-accent">
            {hero ? (
              <ProjectImage image={hero} sizes="(min-width: 1280px) 700px, (min-width: 1024px) 55vw, 100vw" />
            ) : project.flow ? (
              <SystemFlow flow={project.flow} />
            ) : null}
          </div>
        </div>
      </Reveal>
    </article>
  );
}
