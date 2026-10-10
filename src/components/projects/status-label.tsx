import type { ProjectStatus } from "@/data/types";

export const statusText: Record<ProjectStatus, string> = {
  "in-development": "In development",
  completed: "Completed",
  archived: "Archived",
  planned: "Planned",
};

const markers: Record<ProjectStatus, string> = {
  "in-development": "bg-accent motion-safe:animate-[pulse-ring_1.8s_ease-out_infinite]",
  completed: "bg-ink",
  archived: "border border-muted",
  planned: "border border-dashed border-muted",
};

export function StatusLabel({ status }: { status: ProjectStatus }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-xs">
      <span aria-hidden="true" className={`size-1.5 shrink-0 rounded-full ${markers[status]}`} />
      {statusText[status]}
    </span>
  );
}
