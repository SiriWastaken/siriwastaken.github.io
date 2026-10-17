import { getProjectAssets } from "@/assets/projects";
import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/data/types";
import { HighlightList } from "./highlight-list";
import { ProjectImage } from "./project-image";
import { ProjectLinks } from "./project-links";
import { ProjectTitle } from "./project-title";
import { SystemFlow } from "./system-flow";
import { TechList } from "./tech-list";

/** The largest treatment: a centered headline, the product at full width, then the details beneath it. */
export function FlagshipProject({ project }: { project: Project }) {
  const { hero } = getProjectAssets(project.slug);

  return (
    <article aria-labelledby={`project-${project.slug}`} className="pb-24 sm:pb-36">
      <Reveal y={28}>
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm text-muted">{project.year.replace(" season", "")}</p>
          <ProjectTitle project={project} className="mt-3 text-4xl sm:text-6xl" />
          <p className="mt-5 text-xl leading-snug text-muted text-pretty sm:text-2xl">{project.summary}</p>
          <ProjectLinks project={project} className="mt-6 justify-center" />
        </div>

        <div className="group/card mt-12 overflow-hidden rounded-3xl bg-surface sm:mt-16">
          {hero ? (
            <ProjectImage image={hero} sizes="(min-width: 1280px) 1100px, 100vw" className="mx-auto" />
          ) : project.flow ? (
            <SystemFlow flow={project.flow} />
          ) : null}
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-2">
          <HighlightList items={project.highlights} limit={2} className="text-muted" />
          <TechList technologies={project.technologies} className="content-start md:justify-end" />
        </div>
      </Reveal>
    </article>
  );
}
