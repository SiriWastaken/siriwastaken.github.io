import type { ProjectAssets } from "../types";
import autoDark from "./hero/auto-scouting-dark.png";
import autoLight from "./screenshots/auto-scouting-light.png";
import scoutHome from "./screenshots/scout-home-dark.png";

// To add an image: save it at the path in `file`, import it, add it to
// hero/screenshots/diagrams with real alt text, and delete its slot below.
//
//   import averages from "./screenshots/averages-day2.png";
//   screenshots: [{ src: averages, alt: "What the screenshot shows" }],

// Screenshots are the app's web build running on a tablet-sized viewport, not real scouting data.
const assets: ProjectAssets = {
  hero: {
    src: autoDark,
    alt: "The Auto scouting screen in dark mode: fuel scored and fed counters, an L1 hang selector, and the field image",
  },
  screenshots: [
    {
      src: scoutHome,
      alt: "The scout home screen in dark mode with the 610 logo, scout name, and match and team pickers",
      caption: "Starting a scouting session.",
    },
    {
      src: autoLight,
      alt: "The Auto scouting screen in light mode with counters filled in",
      caption: "The same screen in light mode.",
    },
  ],
  planned: [
    {
      kind: "screenshot",
      file: "screenshots/teleop-scoring.png",
      subject: "Teleop page mid-match, with scoring controls filled in.",
      caption: "The teleop screen, built to be used while watching a live match.",
      aspect: "16/10",
    },
    {
      kind: "screenshot",
      file: "screenshots/averages-day1-vs-day2.png",
      subject: "Averages tab with Day 2 mode on, showing risers and fallers.",
      caption: "Averages with a Day 1 / Day 2 split.",
      aspect: "16/10",
    },
    {
      kind: "screenshot",
      file: "screenshots/picklist-board.png",
      subject: "Picklist board mid-drag, with a team's radar chart open.",
      caption: "The drag-and-drop picklist used for alliance selection.",
      aspect: "16/10",
    },
    {
      kind: "screenshot",
      file: "screenshots/match-plan.png",
      subject: "Strategy tools: a match plan with climb estimates and role suggestions.",
      caption: "Match planning from synced scouting data.",
      aspect: "16/10",
    },
    {
      kind: "screenshot",
      file: "screenshots/team-stats-auto-replay.png",
      subject: "Stats tab for one team: charts plus the auto path replay.",
      caption: "Per-team stats with auto path replay.",
      aspect: "16/10",
    },
  ],
};

export default assets;
