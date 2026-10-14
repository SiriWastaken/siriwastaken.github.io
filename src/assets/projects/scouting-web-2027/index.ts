import type { ProjectAssets } from "../types";
import teams from "./hero/teams-dashboard.png";
import coverage from "./screenshots/coverage.png";
import teamsDark from "./screenshots/teams-dark.png";
import strategy from "./screenshots/strategy-head-to-head.png";
import boxPlot from "./screenshots/box-plot-board.png";
import realtime from "./screenshots/realtime-self-test.png";
import users from "./screenshots/users-and-roles.png";

// Screenshots come from the test bench's fake Sync Gateway and sample event, not real scouting data.
//
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
    {
      src: boxPlot,
      alt: "The Box Plot page ranking 26 teams by fuel scored per match, with columns for accuracy, crossings and defense",
      caption: "Ranking the whole event by any stat (sample event data).",
    },
    {
      src: users,
      alt: "The Admin Users tab listing accounts with their roles (Owner, Mentor, Scout lead, Scout, Member), status and session count",
      caption: "Admin → Users: five roles, sign-in status, and sessions (made-up accounts).",
    },
    {
      src: realtime,
      alt: "The Admin Realtime tab after running the WebSocket self-test, showing a Passed result and connection metrics",
      caption: "The WebSocket self-test passing, with live connection metrics.",
    },
  ],
};

export default assets;
