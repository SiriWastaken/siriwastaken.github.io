import { getProjectAssets } from "@/assets/projects";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/data/types";
import { HighlightList } from "./highlight-list";
import { ProjectImage } from "./project-image";
import { ProjectLinks } from "./project-links";
import { ProjectTitle } from "./project-title";
import { TechList } from "./tech-list";

/** Mid-weight treatment: shown two-up beneath the flagship projects. */
export function FeaturedProject({ project }: { project: Project }) {
  const { hero } = getProjectAssets(project.slug);

  return (
    <Reveal className="h-full">
      <article
        aria-labelledby={`project-${project.slug}`}
        className="flex h-full flex-col rounded-3xl bg-surface p-6 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:hover:-translate-y-1 sm:p-8"
      >
        <p className="text-sm text-muted">{project.year}</p>
        <ProjectTitle project={project} className="mt-4 text-3xl sm:text-4xl" />
        <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>

        {hero ? (
          <div className="mt-6 group/card overflow-hidden rounded-2xl">
            <ProjectImage image={hero} sizes="(min-width: 1024px) 540px, 100vw" />
          </div>
        ) : null}

        <HighlightList items={project.highlights} limit={1} className="mt-6 text-muted" />
        <div className="pt-8">
          <TechList technologies={project.technologies} />
          <ProjectLinks project={project} className="mt-5" />
        </div>
      </article>
    </Reveal>
  );
}
