import type { TechIconData } from "@/assets/icons/types";

/**
 * One icon style throughout: the official brand mark as a single-colour glyph , coloured by its stack group, with no tile behind it.
 */
const tints = [
  "text-pop-orange",
  "text-pop-pink",
  "text-pop-purple",
  "text-pop-green",
  "text-pop-teal",
];

export function TechTile({
  icon,
  tint = 0,
  className = "size-6",
}: {
  icon: TechIconData;
  tint?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center ${tints[tint % tints.length]} ${className}`}
    >
      <svg viewBox={icon.viewBox ?? "0 0 24 24"} focusable="false" fill="currentColor" className="size-full">
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
