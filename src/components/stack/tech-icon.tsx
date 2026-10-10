import type { TechIconData } from "@/assets/icons/types";

/** Brand colours too dark to read on the dark theme hover to the page ink instead. */
function isNearBlack(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60;
}

/**
 * Official brand mark (Simple Icons, or vendored in src/assets/icons), muted at rest.
 * The parent should be a `group`; on hover or focus every icon lights up, in its brand colour
 * (or the page ink for near-black brands).
 */
export function TechIcon({ icon, className = "size-6" }: { icon: TechIconData; className?: string }) {
  const brand = isNearBlack(icon.hex) ? "var(--ink)" : `#${icon.hex}`;
  return (
    <svg
      viewBox={icon.viewBox ?? "0 0 24 24"}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      className={`shrink-0 text-muted transition duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:text-(--brand) motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:-rotate-6 motion-safe:group-hover:scale-125 group-focus-visible:text-(--brand) ${className}`}
      style={{ "--brand": brand } as React.CSSProperties}
    >
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
  );
}
