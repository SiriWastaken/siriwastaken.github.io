import type { TechIconData } from "@/assets/icons/types";

/**
 * One icon style throughout: the official brand mark as a single-colour glyph in a rounded tile. It takes
 * the accent on hover or focus. The parent should be a `group`.
 */
const tints = [
  "bg-pop-orange/15 text-pop-orange",
  "bg-pop-pink/15 text-pop-pink",
  "bg-pop-purple/15 text-pop-purple",
  "bg-pop-green/15 text-pop-green",
  "bg-pop-teal/15 text-pop-teal",
];

export function TechTile({
  icon,
  tint = 0,
  className = "size-11",
}: {
  icon: TechIconData;
  tint?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 motion-reduce:transition-none ${tints[tint % tints.length]} ${className}`}
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
