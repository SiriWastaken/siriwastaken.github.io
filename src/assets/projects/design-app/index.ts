import type { ProjectAssets } from "../types";
import home from "./hero/home.png";
import compare from "./screenshots/compare.png";
import logPhone from "./screenshots/log-phone.png";
import prototype from "./screenshots/prototype.png";

const assets: ProjectAssets = {
  hero: {
    src: home,
    alt: "The 610 Design App home page in dark mode, listing the season's subsystems and prototypes",
  },
  screenshots: [
    {
      src: logPhone,
      alt: "The log-a-test form on a phone, with fields for the test's metrics and a photo or video button",
      caption: "Logging a test from a phone.",
    },
    {
      src: compare,
      alt: "The Compare tab showing progress graphs across a prototype's iterations",
      caption: "Progress across iterations.",
    },
    {
      src: prototype,
      alt: "A prototype's page listing its test entries by iteration",
      caption: "A prototype and its iteration history.",
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
