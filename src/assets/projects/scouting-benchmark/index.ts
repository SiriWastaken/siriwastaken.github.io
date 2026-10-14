import type { ProjectAssets } from "../types";
import summary from "./hero/final-summary.jpg";
import dbLatency from "./screenshots/db-latency.jpg";
import latencyCdf from "./screenshots/latency-cdf.jpg";
import latencyMedians from "./screenshots/latency-medians.jpg";
import reliability from "./screenshots/reliability-matrix.jpg";

const assets: ProjectAssets = {
  hero: {
    src: summary,
    alt: "Summary chart comparing the React Native and native Java scouting apps across latency, throughput, CPU and memory",
  },
  screenshots: [
    {
      src: latencyMedians,
      alt: "Median UI latency for taps, screen changes and submits in each app",
      caption: "Median UI latency.",
    },
    {
      src: latencyCdf,
      alt: "Cumulative distribution of counter tap latency for each app",
      caption: "Counter tap latency distribution.",
    },
    {
      src: dbLatency,
      alt: "Database operation latency for each app",
      caption: "Database latency.",
    },
    {
      src: reliability,
      alt: "Matrix of crashes, freezes and lost counters for each app and run",
      caption: "Reliability across runs.",
    },
  ],
};

export default assets;
