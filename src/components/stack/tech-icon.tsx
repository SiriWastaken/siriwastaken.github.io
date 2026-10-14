import type { TechIconData } from "@/assets/icons/types";

/**
 * One icon style throughout: the official brand mark as a single-colour glyph in a hairline square. It takes
 * the accent on hover or focus. The parent should be a `group`.
 */
export function TechTile({ icon, className = "size-11" }: { icon: TechIconData; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center border border-rule-strong text-ink transition-colors duration-150 group-hover:border-accent group-hover:text-accent group-focus-visible:border-accent ${className}`}
    >
      <svg viewBox={icon.viewBox ?? "0 0 24 24"} focusable="false" fill="currentColor" className="size-[50%]">
        {icon.path ? <path d={icon.path} /> : null}
        {icon.strokes?.map((d) => (
          <path
            key={d}
            d={d}
            fill="none"
            stroke="currentColor"
            strokeWidth={icon.strokeWidth ?? 2}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </span>
  );
}
