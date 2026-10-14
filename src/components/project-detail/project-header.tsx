import Link from "next/link";
import { ProjectLinks } from "@/components/projects/project-links";
import { Wip } from "@/components/projects/project-title";
import type { Project } from "@/data/types";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="pt-8 pb-12 sm:pt-12">
      <Link
        href="/#work"
        className="group inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent"
      >
        <span aria-hidden="true" className="inline-block transition-transform group-hover:-translate-x-1">
          ←
        </span>
        All work
      </Link>
      <h1 className="mt-10 max-w-5xl font-display text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.95] tracking-tight text-balance">
        {project.title}
        <Wip project={project} />
      </h1>
      <div className="mt-8 grid gap-x-12 gap-y-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-xl leading-relaxed text-balance">{project.summary}</p>
          <p className="mt-4 font-mono text-xs text-muted">
            {project.role} · {project.year.replace(" season", "")}
          </p>
          <ProjectLinks project={project} showDetails={false} className="mt-6" />
        </div>
      </div>
    </header>
  );
}
