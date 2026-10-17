"use client";

import { motion } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Distance travelled in px. Smaller for small things, larger for big features. */
  y?: number;
  delay?: number;
};

/** Content eases up into place once, the first time it scrolls into view. */
export function Reveal({
  children,
  className,
  y = 16,
  delay = 0,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
