import Link from "next/link";
import { ProjectLinks } from "@/components/projects/project-links";
import { Wip } from "@/components/projects/project-title";
import type { Project } from "@/data/types";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="pt-8 pb-12 sm:pt-12 sm:pb-16">
      <Link
        href="/#work"
        className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden="true" className="inline-block transition-transform group-hover:-translate-x-1">
          ←
        </span>
        All work
      </Link>
      <h1 className="mt-10 max-w-5xl font-display text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] text-balance">
        {project.title}
        <Wip project={project} />
      </h1>
      <div className="mt-8 max-w-3xl">
        <div>
          <p className="text-xl leading-snug text-muted text-balance sm:text-2xl">{project.summary}</p>
          <p className="mt-4 text-sm text-muted">
            {project.role} · {project.year.replace(" season", "")}
          </p>
          <ProjectLinks project={project} showDetails={false} className="mt-6" />
        </div>
      </div>
    </header>
  );
}
