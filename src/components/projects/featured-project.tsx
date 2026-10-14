import { getProjectAssets } from "@/assets/projects";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/data/types";
import { HighlightList } from "./highlight-list";
import { ImagePlaceholder } from "./image-placeholder";
import { ProjectImage } from "./project-image";
import { ProjectLinks } from "./project-links";
import { ProjectTitle } from "./project-title";
import { TechList } from "./tech-list";

/** Mid-weight treatment: shown two-up beneath the flagship projects. */
export function FeaturedProject({ project }: { project: Project }) {
  const { hero, heroSlot } = getProjectAssets(project.slug);

  return (
    <Reveal className="h-full">
      <article
        aria-labelledby={`project-${project.slug}`}
        className="flex h-full flex-col border-t border-ink pt-6"
      >
        <p className="font-mono text-xs text-muted">{project.year}</p>
        <ProjectTitle project={project} className="mt-4 text-4xl sm:text-5xl" />
        <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>

        {hero ? (
          <div className="mt-6 border border-rule-strong bg-surface transition-colors duration-200 hover:border-accent">
            <ProjectImage image={hero} sizes="(min-width: 1024px) 540px, 100vw" />
          </div>
        ) : heroSlot ? (
          <ImagePlaceholder slug={project.slug} slot={heroSlot} className="mt-6" />
        ) : null}

        <HighlightList items={project.highlights} limit={2} className="mt-6 text-muted" />
        <div className="pt-8">
          <TechList technologies={project.technologies} />
          <ProjectLinks project={project} className="mt-5" />
        </div>
      </article>
    </Reveal>
  );
}
