import Link from "next/link";
import { getProjectAssets } from "@/assets/projects";
import type { Project } from "@/data/types";
import { HighlightList } from "./highlight-list";
import { ImagePlaceholder } from "./image-placeholder";
import { ProjectImage } from "./project-image";
import { ProjectLinks } from "./project-links";
import { StatusLabel } from "./status-label";
import { SystemFlow } from "./system-flow";
import { TechList } from "./tech-list";

/** The largest project treatment: reserved for the scouting and design systems. */
export function FlagshipProject({ project }: { project: Project }) {
  const { hero, heroSlot } = getProjectAssets(project.slug);
  const titleId = `project-${project.slug}`;

  return (
    <article aria-labelledby={titleId} className="card reveal p-6 sm:p-10">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-muted">
        <span>{project.category}</span>
        <span aria-hidden="true">·</span>
        <span>{project.year}</span>
        <span className="text-ink">
          <StatusLabel status={project.status} />
        </span>
      </div>

      <h4 id={titleId} className="mt-6 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
        {project.details ? (
          <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h4>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>

      <div className="mt-8 overflow-hidden rounded-2xl">
        {hero ? (
          <ProjectImage image={hero} sizes="(min-width: 1152px) 1000px, 100vw" />
        ) : heroSlot ? (
          <ImagePlaceholder slug={project.slug} slot={heroSlot} />
        ) : project.flow ? (
          <SystemFlow flow={project.flow} />
        ) : null}
      </div>

      <HighlightList items={project.highlights} columns={2} className="mt-8" />
      <TechList technologies={project.technologies} className="mt-8" />
      <ProjectLinks project={project} className="mt-6" />
    </article>
  );
}
