import Link from "next/link";
import type { Project } from "@/data/types";

const linkBase =
  "group inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-95";
const linkClass = `${linkBase} bg-surface-2 text-ink hover:bg-rule-strong`;
const primaryClass = `${linkBase} bg-ink text-bg hover:opacity-85`;

function Arrow({ external = false }: { external?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block transition-transform ${external ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "group-hover:translate-x-1"}`}
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
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {hasDetails ? (
        <Link href={`/projects/${project.slug}`} className={primaryClass}>
          Read more<span className="sr-only"> about {project.title}</span> <Arrow />
        </Link>
      ) : null}
      {project.githubUrl ? (
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className={linkClass}>
          Source<span className="sr-only"> code for {project.title} on GitHub (opens in a new tab)</span>{" "}
          <Arrow external />
        </a>
      ) : null}
      {project.liveUrl ? (
        <a href={project.liveUrl} target="_blank" rel="noreferrer" className={linkClass}>
          Live<span className="sr-only"> version of {project.title} (opens in a new tab)</span> <Arrow external />
        </a>
      ) : null}
      {!project.githubUrl && project.sourceNote ? (
        <span className="font-mono text-xs text-muted">{project.sourceNote}</span>
      ) : null}
    </div>
  );
}
