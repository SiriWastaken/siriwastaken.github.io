"use client";

import { MotionConfig } from "motion/react";

/** Reduced-motion visitors keep opacity changes but lose all movement. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
