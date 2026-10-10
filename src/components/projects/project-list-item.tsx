import Image from "next/image";
import Link from "next/link";
import { getProjectAssets } from "@/assets/projects";
import type { Project } from "@/data/types";
import { ProjectLinks } from "./project-links";
import { StatusLabel } from "./status-label";
import { TechList } from "./tech-list";

/** Compact row for smaller and earlier projects. */
export function ProjectListItem({ project }: { project: Project }) {
  const { hero } = getProjectAssets(project.slug);
  const titleId = `project-${project.slug}`;

  return (
    <li>
      <article aria-labelledby={titleId} className="reveal card-fx grid gap-4 border-t border-rule py-8 md:grid-cols-12 md:gap-x-8">
        <div className="flex items-start gap-4 md:col-span-3">
          {hero ? (
            <Image
              src={hero.src}
              alt=""
              width={48}
              height={48}
              className="size-12 shrink-0 border border-rule object-cover object-top"
            />
          ) : null}
          <div>
            <h4 id={titleId} className="font-semibold tracking-tight">
              {project.details ? (
                <Link href={`/projects/${project.slug}`} className="transition-colors hover:text-accent">
                  {project.title}
                </Link>
              ) : (
                project.title
              )}
            </h4>
            <p className="mt-1 font-mono text-xs text-muted">
              {project.category} · {project.year}
            </p>
          </div>
        </div>
        <div className="md:col-span-6">
          <p className="leading-relaxed text-muted">{project.summary}</p>
          <TechList technologies={project.technologies} className="mt-4" />
        </div>
        <div className="flex flex-col gap-3 md:col-span-3 md:items-end md:text-right">
          <StatusLabel status={project.status} />
          <ProjectLinks project={project} className="md:justify-end" />
        </div>
      </article>
    </li>
  );
}
