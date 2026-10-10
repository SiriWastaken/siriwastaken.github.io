import Link from "next/link";
import type { Project } from "@/data/types";
import { ProjectLinks } from "@/components/projects/project-links";
import { StatusLabel } from "@/components/projects/status-label";

export function ProjectHeader({ project }: { project: Project }) {
  return (
    <header className="mx-auto max-w-3xl pt-10 pb-10 text-center sm:pt-14">
      <Link
        href="/#work"
        className="group inline-flex items-center gap-2 rounded-full bg-surface-2 px-4 py-1.5 text-sm text-muted transition-colors hover:text-ink"
      >
        <span aria-hidden="true" className="inline-block transition-transform group-hover:-translate-x-1">
          ←
        </span>
        All work
      </Link>
      <p className="mt-8 font-mono text-xs text-muted">{project.category}</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">{project.title}</h1>
      <p className="mt-5 text-lg leading-relaxed text-balance text-muted">{project.summary}</p>
      <dl className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 font-mono text-xs">
        <div className="flex gap-2">
          <dt className="text-muted">When</dt>
          <dd>{project.year}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">Status</dt>
          <dd className="flex flex-wrap items-center gap-x-2">
            <StatusLabel status={project.status} />
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">Role</dt>
          <dd>{project.role}</dd>
        </div>
      </dl>
      {project.statusNote ? <p className="mt-3 text-sm text-muted">{project.statusNote}</p> : null}
      <ProjectLinks project={project} showDetails={false} className="mt-8 justify-center" />
    </header>
  );
}
