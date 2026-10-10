/** Shape shared by Simple Icons and the few logos vendored in this folder. */
export type TechIconData = {
  title: string;
  hex: string;
  /** Filled path. Simple Icons and most logos. */
  path?: string;
  /** Stroked paths, for logos drawn with lines instead of fills. */
  strokes?: string[];
  strokeWidth?: number;
  /** Simple Icons are drawn on a 24×24 grid; vendored icons may differ. */
  viewBox?: string;
};
