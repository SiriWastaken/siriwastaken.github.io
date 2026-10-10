import { showImagePlaceholders } from "./placeholders";
import type { ImageSlot, ProjectAssets } from "./types";
import claudeium from "./claudeium";
import designApp from "./design-app";
import millionaire from "./millionaire";
import scoutingBenchmark from "./scouting-benchmark";
import scoutingApp2026 from "./scouting-app-2026";
import scoutingWeb2027 from "./scouting-web-2027";
import sift from "./sift";

export type { ImageSlot, ProjectAssets, ProjectImage } from "./types";

/**
 * Images for each project, keyed by the project's slug in src/data/projects.ts.
 * A new project folder needs one import and one line here.
 */
const registry: Record<string, ProjectAssets> = {
  "scouting-app-2026": scoutingApp2026,
  "scouting-web-2027": scoutingWeb2027,
  millionaire,
  claudeium,
  "design-app": designApp,
  "scouting-benchmark": scoutingBenchmark,
  sift,
};

export type ResolvedProjectAssets = ProjectAssets & {
  screenshots: NonNullable<ProjectAssets["screenshots"]>;
  diagrams: NonNullable<ProjectAssets["diagrams"]>;
  /** Placeholder slots to render right now (empty on the live site by default). */
  heroSlot?: ImageSlot;
  screenshotSlots: ImageSlot[];
  diagramSlots: ImageSlot[];
};

export function getProjectAssets(slug: string): ResolvedProjectAssets {
  const assets = registry[slug] ?? {};
  const planned = showImagePlaceholders ? (assets.planned ?? []) : [];
  return {
    ...assets,
    screenshots: assets.screenshots ?? [],
    diagrams: assets.diagrams ?? [],
    heroSlot: assets.hero ? undefined : planned.find((slot) => slot.kind === "hero"),
    screenshotSlots: planned.filter((slot) => slot.kind === "screenshot"),
    diagramSlots: planned.filter((slot) => slot.kind === "diagram"),
  };
}
