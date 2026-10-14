import Link from "next/link";
import type { Project } from "@/data/types";

/** The only status tag on the site: (WIP) after the name of anything still in progress. */
export function Wip({ project }: { project: Project }) {
  return project.status === "in-development" ? (
    <span className="whitespace-nowrap text-accent"> (WIP)</span>
  ) : null;
}

/** A project's heading, linked to its case study when one exists. The id is the home page anchor. */
export function ProjectTitle({ project, className = "" }: { project: Project; className?: string }) {
  return (
    <h3
      id={`project-${project.slug}`}
      className={`scroll-mt-20 font-display leading-[1.02] tracking-tight text-balance ${className}`}
    >
      {project.details ? (
        <Link
          href={`/projects/${project.slug}`}
          className="underline decoration-transparent decoration-2 underline-offset-[0.12em] transition-colors hover:decoration-accent"
        >
          {project.title}
        </Link>
      ) : (
        project.title
      )}
      <Wip project={project} />
    </h3>
  );
}
