import Link from "next/link";
import { getProjectAssets } from "@/assets/projects";
import type { Project } from "@/data/types";
import { MetaList } from "@/components/ui/meta-list";
import { HighlightList } from "./highlight-list";
import { ImagePlaceholder } from "./image-placeholder";
import { ProjectImage } from "./project-image";
import { ProjectLinks } from "./project-links";
import { StatusLabel } from "./status-label";
import { SystemFlow } from "./system-flow";
import { TechList } from "./tech-list";

/** The largest project treatment: reserved for the scouting systems. */
export function FlagshipProject({ project, position }: { project: Project; position: number }) {
  const { hero, heroSlot } = getProjectAssets(project.slug);
  const titleId = `project-${project.slug}`;

  return (
    <article aria-labelledby={titleId} className="reveal card-fx grid gap-8 border-t border-rule py-12 first:border-t-0 first:pt-0 md:grid-cols-12 md:gap-x-8">
      <div className="md:col-span-3">
        <p aria-hidden="true" className="font-mono text-5xl font-medium tracking-tight text-rule-strong">
          {String(position).padStart(2, "0")}
        </p>
        <MetaList
          className="mt-6"
          items={[
            { label: "When", value: project.year },
            { label: "Type", value: project.category },
            { label: "Status", value: <StatusLabel status={project.status} /> },
            { label: "Role", value: project.role },
          ]}
        />
      </div>

      <div className="min-w-0 md:col-span-9">
        <h4 id={titleId} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {project.details ? (
            <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-accent">
              {project.title}
            </Link>
          ) : (
            project.title
          )}
        </h4>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-8">
          {hero ? (
            <ProjectImage image={hero} sizes="(min-width: 1152px) 820px, (min-width: 768px) 75vw, 100vw" />
          ) : heroSlot ? (
            <ImagePlaceholder slug={project.slug} slot={heroSlot} />
          ) : project.flow ? (
            <SystemFlow flow={project.flow} />
          ) : null}
        </div>

        <HighlightList items={project.highlights} columns={2} className="mt-8" />
        <TechList technologies={project.technologies} className="mt-8" />
        <ProjectLinks project={project} className="mt-6" />
      </div>
    </article>
  );
}
