import Image from "next/image";
import Link from "next/link";
import { getProjectAssets } from "@/assets/projects";
import type { Project } from "@/data/types";
import { ProjectLinks } from "./project-links";
import { StatusLabel } from "./status-label";
import { TechList } from "./tech-list";

/** Compact card for smaller and earlier projects. */
export function ProjectListItem({ project }: { project: Project }) {
  const { hero } = getProjectAssets(project.slug);
  const titleId = `project-${project.slug}`;

  return (
    <li>
      <article
        aria-labelledby={titleId}
        className="card reveal grid gap-5 p-5 sm:p-6 md:grid-cols-12 md:items-center md:gap-x-8"
      >
        <div className="flex items-start gap-4 md:col-span-4">
          {hero ? (
            <Image
              src={hero.src}
              alt=""
              width={56}
              height={56}
              className="size-14 shrink-0 rounded-2xl border border-rule object-cover object-top"
            />
          ) : null}
          <div>
            <h4 id={titleId} className="text-lg font-semibold tracking-tight">
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
            <div className="mt-2 text-ink">
              <StatusLabel status={project.status} />
            </div>
          </div>
        </div>
        <div className="md:col-span-8">
          <p className="leading-relaxed text-muted">{project.summary}</p>
          <TechList technologies={project.technologies} className="mt-4" />
          <ProjectLinks project={project} className="mt-4" />
        </div>
      </article>
    </li>
  );
}
