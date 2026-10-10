import type { ProjectFlow } from "@/data/types";

/**
 * A project's data path drawn as a sequence of stages. Horizontal on wide
 * screens, vertical on narrow ones. Built from data, so it stays honest:
 * each stage corresponds to real code in the project.
 */
export function SystemFlow({ flow }: { flow: ProjectFlow }) {
  return (
    <figure className="bg-surface px-5 py-6 sm:px-8 sm:py-8">
      <ol className="grid md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        {flow.steps.map((step, index) => (
          <li
            key={step.label}
            className="relative border-l border-rule-strong pb-6 pl-5 last:pb-0 md:border-t md:border-l-0 md:pt-5 md:pr-5 md:pb-0 md:pl-0"
          >
            <span
              aria-hidden="true"
              className="absolute top-1 -left-[4px] size-[7px] bg-accent md:-top-[4px] md:left-0"
            />
            <span className="font-mono text-[11px] text-muted">{String(index + 1).padStart(2, "0")}</span>
            <p className="mt-1 text-sm font-medium">{step.label}</p>
            <p className="mt-1 text-sm text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
      {flow.aside ? (
        <p className="mt-6 border-t border-dashed border-rule-strong pt-4 text-sm">
          <span className="font-medium">{flow.aside.label}</span>
          <span className="text-muted">: {flow.aside.detail}</span>
        </p>
      ) : null}
      <figcaption className="mt-5 font-mono text-xs text-muted">{flow.caption}</figcaption>
    </figure>
  );
}
