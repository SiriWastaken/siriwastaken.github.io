import Link from "next/link";
import type { Project } from "@/data/types";

const linkClass =
  "group inline-flex items-center gap-1.5 text-base text-accent transition-opacity duration-150 hover:underline hover:underline-offset-4";
const primaryClass = `${linkClass} font-medium`;

function Arrow({ external = false }: { external?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block transition-transform duration-150 ${external ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "group-hover:translate-x-1"}`}
    >
      {external ? "↗" : "→"}
    </span>
  );
}

type ProjectLinksProps = {
  project: Project;
  showDetails?: boolean;
  className?: string;
};

export function ProjectLinks({ project, showDetails = true, className = "" }: ProjectLinksProps) {
  const hasDetails = showDetails && project.details;
  return (
    <div className={`flex flex-wrap items-center gap-x-6 gap-y-3 ${className}`}>
      {hasDetails ? (
        <Link href={`/projects/${project.slug}`} className={primaryClass}>
          How it works<span className="sr-only"> for {project.title}</span> <Arrow />
        </Link>
      ) : null}
      {project.githubUrl ? (
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className={linkClass}>
          Code<span className="sr-only"> for {project.title} on GitHub (opens in a new tab)</span> <Arrow external />
        </a>
      ) : null}
      {project.liveUrl ? (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className={linkClass}>
          Live<span className="sr-only"> version of {project.title} (opens in a new tab)</span> <Arrow external />
        </a>
      ) : null}
      {!project.githubUrl && project.sourceNote ? (
        <span className="text-sm text-muted">{project.sourceNote}</span>
      ) : null}
    </div>
  );
}
