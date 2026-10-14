import type { ProjectAssets } from "../types";
import autoDark from "./hero/auto-scouting-dark.png";
import autoLight from "./screenshots/auto-scouting-light.png";
import scoutHome from "./screenshots/scout-home-dark.png";
import averagesDay2 from "./screenshots/averages-day2.png";
import matchLog from "./screenshots/match-performance-log.png";
import strategyCompare from "./screenshots/strategy-compare.png";
import teamStats from "./screenshots/team-stats.png";
import teleop from "./screenshots/teleop-counters.png";

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
    {
      src: teleop,
      alt: "The Teleop screen in dark mode: tap counters for fuel scored, passes, plowed and fed, plus bump and trench crossings",
      caption: "Teleop: big tap counters scouts use during a match.",
    },
    {
      src: averagesDay2,
      alt: "The Leaderboards table with Day 2 mode on, showing each team's averages and a trend column of risers and fallers in green and red",
      caption: "Averages with Day 2 on: green and red trend values show who is rising or falling (sample data).",
    },
    {
      src: teamStats,
      alt: "Team Stats and Analytics for one team: auto, teleop and endgame points per game, fuel statistics and climb accuracy",
      caption: "One team's stats (sample data).",
    },
    {
      src: matchLog,
      alt: "A match performance log listing each scouted match with auto, teleop and endgame results and defense flags",
      caption: "Every scouted match for a team (sample data).",
    },
    {
      src: strategyCompare,
      alt: "Strategy Tools comparing two teams side by side, with the better value in each row highlighted in green",
      caption: "Comparing two teams head to head (sample data).",
    },
  ],
};

export default assets;
