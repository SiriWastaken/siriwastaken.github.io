import Link from "next/link";
import { getProjectAssets } from "@/assets/projects";
import type { Project } from "@/data/types";
import { HighlightList } from "./highlight-list";
import { ImagePlaceholder } from "./image-placeholder";
import { ProjectImage } from "./project-image";
import { ProjectLinks } from "./project-links";
import { StatusLabel } from "./status-label";
import { TechList } from "./tech-list";

/** Mid-weight treatment: shown two-up beneath the flagship projects. */
export function FeaturedProject({ project }: { project: Project }) {
  const { hero, heroSlot } = getProjectAssets(project.slug);
  const titleId = `project-${project.slug}`;

  return (
    <article aria-labelledby={titleId} className="card reveal flex flex-col p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 font-mono text-xs text-muted">
        <span>
          {project.category} · {project.year}
        </span>
        <span className="text-ink">
          <StatusLabel status={project.status} />
        </span>
      </div>

      <h4 id={titleId} className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
        {project.details ? (
          <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-accent">
            {project.title}
          </Link>
        ) : (
          project.title
        )}
      </h4>
      <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>

      {hero ? (
        <div className="mt-6 overflow-hidden rounded-2xl">
          <ProjectImage image={hero} sizes="(min-width: 768px) 45vw, 100vw" />
        </div>
      ) : heroSlot ? (
        <ImagePlaceholder slug={project.slug} slot={heroSlot} className="mt-6" />
      ) : null}

      <HighlightList items={project.highlights} className="mt-6" />
      <div className="mt-auto pt-8">
        <TechList technologies={project.technologies} />
        <ProjectLinks project={project} className="mt-5" />
      </div>
    </article>
  );
}
