"use client";

import { motion } from "motion/react";

const lines = [
  { text: "I build software", className: "" },
  { text: "for our robotics team", className: "" },
  { text: "and love doing it.", className: "text-accent italic" },
];

/** Three lines rise out of a mask, once, on load. The only staggered text on the site. */
export function HeroHeadline() {
  return (
    <h1
      id="hero-heading"
      className="font-display text-[clamp(3.1rem,9.5vw,8.5rem)] leading-[0.92] tracking-tight"
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
