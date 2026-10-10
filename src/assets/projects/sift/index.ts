import type { ProjectAssets } from "../types";
import check from "./hero/check.png";
import diff from "./screenshots/diff.png";
import doctor from "./screenshots/doctor.png";
import inspect from "./screenshots/inspect.png";
import unknown from "./screenshots/unknown.png";

const assets: ProjectAssets = {
  hero: {
    src: check,
    alt: "sift check run on SIFT itself: a git warning, a passing build, 101 passing tests, and PROJECT HEALTHY",
  },
  screenshots: [
    {
      src: inspect,
      alt: "sift inspect on a Next.js project: language, framework, build tool, test runner, and git state",
      caption: "inspect: what am I looking at?",
    },
    {
      src: doctor,
      alt: "sift doctor reporting eight passing checks and one git warning",
      caption: "doctor: problems, each with its evidence.",
    },
    {
      src: diff,
      alt: "sift diff summarising one modified test file with two lines added and two removed",
      caption: "diff: changes grouped by file role.",
    },
    {
      src: unknown,
      alt: "sift inspect on a folder it can't identify, reporting unknown for language, build, and tests",
      caption: "Anything it can't identify is reported as unknown, not guessed.",
    },
  ],
};

export default assets;
