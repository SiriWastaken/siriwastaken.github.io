import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/data/types";
import { ProjectLinks } from "./project-links";
import { ProjectTitle } from "./project-title";
import { TechList } from "./tech-list";

/** A ruled row for smaller and earlier projects. */
export function ProjectListItem({ project }: { project: Project }) {
  return (
    <li>
      <Reveal y={10}>
        <article
          aria-labelledby={`project-${project.slug}`}
          className="grid gap-x-12 gap-y-4 border-t border-rule-strong py-8 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <p className="font-mono text-xs text-muted">{project.year}</p>
            <ProjectTitle project={project} className="mt-3 text-3xl sm:text-4xl" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="leading-relaxed text-muted">{project.summary}</p>
            <TechList technologies={project.technologies} className="mt-4" />
            <ProjectLinks project={project} className="mt-4" />
          </div>
        </article>
      </Reveal>
    </li>
  );
}
