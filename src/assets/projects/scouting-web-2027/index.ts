import type { ProjectAssets } from "../types";
import teams from "./hero/teams-dashboard.png";
import coverage from "./screenshots/coverage.png";
import teamsDark from "./screenshots/teams-dark.png";
import strategy from "./screenshots/strategy-head-to-head.png";

// Screenshots come from the test bench's fake Sync Gateway and sample event, not real scouting data.
//
// To add an image: save it at the path in `file`, import it, add it to
// hero/screenshots/diagrams with real alt text, and delete its slot below.
//
//   import averages from "./screenshots/averages-day2.png";
//   screenshots: [{ src: averages, alt: "What the screenshot shows" }],

const assets: ProjectAssets = {
  hero: {
    src: teams,
    alt: "The Teams page: a team's averages, a scouted match, and the auto path viewer, with the Live updates on indicator",
  },
  screenshots: [
    {
      src: teamsDark,
      alt: "The Teams page in dark mode with the team picker, averages, and auto path viewer",
      caption: "Dark mode (sample event data).",
    },
    {
      src: strategy,
      alt: "Strategy page comparing two teams' averages side by side, with the leader in each row shaded",
      caption: "Head to head (sample event data): two teams' averages side by side.",
    },
    {
      src: coverage,
      alt: "Coverage page showing teams with aggregates, observed matches, and which teams' records are ready",
      caption: "Coverage (sample event data): which teams still need scouting.",
    },
  ],
  planned: [
    {
      kind: "screenshot",
      file: "screenshots/box-plot-board.png",
      subject: "Averages / Box Plot board with real event data.",
      caption: "The metric board: averages and distributions per team.",
      aspect: "16/10",
    },
    {
      kind: "screenshot",
      file: "screenshots/admin-overview.png",
      subject: "Admin overview: health checks, sync status, and API metrics all green.",
      caption: "The operations panel: health checks, sync status, and API metrics.",
      aspect: "16/10",
    },
    {
      kind: "screenshot",
      file: "screenshots/realtime-self-test.png",
      subject: "Admin Realtime tab after running the WebSocket self-test.",
      caption: "Realtime monitoring and the WebSocket self-test.",
      aspect: "16/10",
    },
    {
      kind: "screenshot",
      file: "screenshots/users-and-roles.png",
      subject: "Users page showing roles and approval states (blur names and emails).",
      caption: "Accounts, roles, and approvals, enforced on the server.",
      aspect: "16/10",
    },
    {
      kind: "screenshot",
      file: "screenshots/ci-all-green.png",
      subject: "GitHub Actions run for a pull request with every check passing.",
      caption: "Every pull request runs the full test bench in CI.",
      aspect: "16/10",
    },
  ],
};

export default assets;
