import Image from "next/image";
import type { ProjectImage } from "@/assets/projects";
import { ProjectLinks } from "@/components/projects/project-links";
import { TechList } from "@/components/projects/tech-list";
import type { Project, ProjectStatus, ProjectTier } from "@/data/types";
import type { PortfolioInput } from "@/lib/portfolio/types";

export type DeskProject = Project & { hero?: ProjectImage };

/** The portfolio data plus the images, which only the scene and windows need. */
export type DeskData = Omit<PortfolioInput, "projects"> & { projects: DeskProject[] };

const statusLabel: Record<ProjectStatus, string> = {
  "in-development": "In development",
  completed: "Completed",
  archived: "Archived",
  planned: "Planned",
};

const tiers: { tier: ProjectTier; label: string }[] = [
  { tier: "flagship", label: "Main projects" },
  { tier: "featured", label: "Featured" },
  { tier: "additional", label: "Earlier" },
];

const rowClass = "block w-full border-t border-rule px-1 py-2.5 text-left first:border-t-0 hover:bg-surface";

export function ProjectsWindow({ projects, onOpen }: { projects: DeskProject[]; onOpen: (slug: string) => void }) {
  return (
    <div className="grid gap-5">
      {tiers.map(({ tier, label }) => {
        const items = projects.filter((p) => p.tier === tier);
        if (!items.length) return null;
        return (
          <section key={tier}>
            <h3 className="kicker mb-1">{label}</h3>
            <ul>
              {items.map((p) => (
                <li key={p.slug}>
                  <button type="button" className={rowClass} onClick={() => onOpen(p.slug)}>
                    <span className="block font-semibold">{p.title}</span>
                    <span className="block text-xs text-muted">
                      {p.year} · {p.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

export function ProjectWindow({ project }: { project: DeskProject }) {
  return (
    <div>
      {project.hero ? (
        <Image
          src={project.hero.src}
          alt={project.hero.alt}
          placeholder="blur"
          sizes="(min-width: 1024px) 432px, 100vw"
          className="mb-4 h-auto w-full rounded-sm border border-rule"
        />
      ) : null}
      <p className="text-xs text-muted">
        {project.year} · {project.category}
      </p>
      <h3 className="font-display mt-1 text-xl">{project.title}</h3>
      <p className="mt-1 text-xs text-muted">
        {statusLabel[project.status]}
        {project.statusNote ? ` · ${project.statusNote}` : ""}
      </p>
      <p className="mt-3 leading-relaxed">{project.summary}</p>
      <TechList technologies={project.technologies} className="mt-3 !text-xs" />
      <ProjectLinks project={project} className="mt-4 [&_*]:!text-sm" />
    </div>
  );
}

export function StackWindow({ stack }: { stack: DeskData["stack"] }) {
  return (
    <div className="grid gap-5">
      {stack.map((group) => (
        <section key={group.label}>
          <h3 className="kicker mb-1">{group.label}</h3>
          <ul>
            {group.items.map((t) => (
              <li key={t.name} className="border-t border-rule py-2 first:border-t-0">
                <a href={t.url} target="_blank" rel="noreferrer" className="font-semibold text-accent hover:underline">
                  {t.name}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
                {t.learning ? <span className="ml-2 text-xs text-muted">Learning</span> : null}
                <p className="text-xs text-muted">{t.usedIn}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export function AboutWindow({ about }: { about: DeskData["about"] }) {
  return (
    <div className="grid gap-3 leading-relaxed">
      {about.map((text, i) => (
        <p key={i} className={i > 0 ? "text-muted" : ""}>
          {text}
        </p>
      ))}
    </div>
  );
}

export function ContactWindow({ links }: { links: DeskData["links"] }) {
  return (
    <ul>
      {links.map((l) => (
        <li key={l.label} className="border-t border-rule first:border-t-0">
          <a href={l.href} target="_blank" rel="noreferrer" className="flex justify-between py-2.5 font-semibold hover:text-accent">
            <span>
              {l.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </span>
            <span aria-hidden="true">↗</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
