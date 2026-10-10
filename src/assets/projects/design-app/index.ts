import type { ProjectAssets } from "../types";
import compare from "./hero/compare.png";
import home from "./screenshots/home.png";
import logPhone from "./screenshots/log-phone.png";
import prototype from "./screenshots/prototype.png";

// Captured from the app running on sample data.
const assets: ProjectAssets = {
  hero: {
    src: compare,
    alt: "The Compare tab in dark mode: a line graph of a prototype's cycle time across its test entries",
  },
  screenshots: [
    {
      src: home,
      alt: "The home page listing the season's prototypes with their latest test results",
      caption: "Every prototype and its latest test.",
    },
    {
      src: logPhone,
      alt: "The log-a-test form on a phone, with fields for the test's metrics and a photo or video button",
      caption: "Logging a test from a phone.",
    },
    {
      src: prototype,
      alt: "A prototype's page showing what it measures and its logged tests",
      caption: "A prototype and what it measures.",
    },
  ],
  planned: [
    {
      kind: "screenshot",
      file: "screenshots/camera-capture.png",
      subject: "Phone mid-capture of a photo or video inside the app.",
      caption: "Capturing media inside the app; files are named automatically.",
      aspect: "9/19.5",
    },
    {
      kind: "diagram",
      file: "diagrams/architecture.png",
      subject: "app/ → features/ (authedAction) → lib/db → Couchbase, plus browser → presigned URL → R2 for media.",
      aspect: "16/10",
    },
  ],
};

export default assets;
