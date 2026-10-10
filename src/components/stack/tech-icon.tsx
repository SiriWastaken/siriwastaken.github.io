import type { TechIconData } from "@/assets/icons/types";

/** True when the brand colour is too dark to read as a tile background. */
function isNearBlack(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
}

/**
 * An app-icon style tile: the official brand mark (Simple Icons, or vendored in src/assets/icons) in white on its
 * brand colour. Near-black brands use the page ink instead so they stay visible in both themes.
 * The parent should be a `group`; the tile pops on hover or focus.
 */
export function TechTile({ icon, className = "size-11" }: { icon: TechIconData; className?: string }) {
  const background = isNearBlack(icon.hex) ? "var(--ink)" : `#${icon.hex}`;
  const glyph = isNearBlack(icon.hex) ? "var(--bg)" : "#fff";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-[22%] shadow-sm transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-safe:group-hover:-translate-y-1 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-110 motion-safe:group-focus-visible:-translate-y-1 ${className}`}
      style={{ background, color: glyph }}
    >
      <svg viewBox={icon.viewBox ?? "0 0 24 24"} focusable="false" fill="currentColor" className="size-[55%]">
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
