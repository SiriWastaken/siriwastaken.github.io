import type { ProjectAssets } from "../types";
import status from "./hero/status.png";
import handoff from "./screenshots/handoff.png";

// Captured from a throwaway demo project, not a real codebase.
const assets: ProjectAssets = {
  hero: {
    src: status,
    alt: "The ledger's status output: one task verified but marked STALE after its files changed, one failed, one pending",
  },
  screenshots: [
    {
      src: handoff,
      alt: "A generated handoff in Markdown listing each task's state, what remains, known failure modes, and what to inspect first",
      caption: "A handoff another agent can resume from.",
    },
  ],
};

export default assets;
