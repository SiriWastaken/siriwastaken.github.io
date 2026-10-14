import type { ProjectAssets } from "../types";
import audiencePoll from "./hero/audience-poll.png";
import playOrWalk from "./screenshots/play-or-walk.png";
import winScreen from "./screenshots/win-screen.png";

const assets: ProjectAssets = {
  hero: {
    src: audiencePoll,
    alt: "A first question with the Audience Poll lifeline used, showing each answer's percentage",
  },
  screenshots: [
    {
      src: playOrWalk,
      alt: "The play-or-walk decision at £32,000, with Walk Away and Continue buttons",
      caption: "Play or walk away.",
    },
    {
      src: winScreen,
      alt: "The £1,000,000 win screen with confetti falling",
      caption: "The win screen's particle system.",
    },
  ],
};

export default assets;
