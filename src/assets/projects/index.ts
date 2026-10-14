import type { ProjectAssets } from "./types";
import claudeium from "./claudeium";
import designApp from "./design-app";
import millionaire from "./millionaire";
import scoutingBenchmark from "./scouting-benchmark";
import scoutingApp2026 from "./scouting-app-2026";
import scoutingWeb2027 from "./scouting-web-2027";
import sift from "./sift";

export type { ProjectAssets, ProjectImage } from "./types";

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
};

export function getProjectAssets(slug: string): ResolvedProjectAssets {
  const assets = registry[slug] ?? {};
  return {
    ...assets,
    screenshots: assets.screenshots ?? [],
    diagrams: assets.diagrams ?? [],
  };
}
