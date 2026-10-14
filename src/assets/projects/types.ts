import type { StaticImageData } from "next/image";

export type ProjectImage = {
  src: StaticImageData;
  /** Describe what the image shows, not what it is ("Averages table sorted by…", not "Screenshot"). */
  alt: string;
  caption?: string;
};

export type ProjectAssets = {
  /** Main image: shown on the home page and at the top of the project page. */
  hero?: ProjectImage;
  /** Shown in the Screenshots section of the project page. */
  screenshots?: ProjectImage[];
  /** Architecture or data-flow diagrams, shown in the Architecture section. */
  diagrams?: ProjectImage[];
};
