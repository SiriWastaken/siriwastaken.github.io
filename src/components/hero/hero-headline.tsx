"use client";

import { motion } from "motion/react";

const lines = [
  { text: "Human by Design", className: "" },
  { text: "Buggy by Human.", className: "text-accent" },
];

/** Two lines rise out of a mask, once, on load. The only staggered text on the site. */
export function HeroHeadline() {
  return (
    <h1
      id="hero-heading"
      className="font-display text-[clamp(2.4rem,6.6vw,6.25rem)] leading-[0.98] tracking-tight"
    >
      {lines.map((line, i) => (
        <span key={line.text} className="block overflow-hidden pb-[0.12em]">
          <motion.span
            className={`block ${line.className}`}
            initial={{ y: "105%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.8, delay: 0.05 + i * 0.09, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {line.text}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}
