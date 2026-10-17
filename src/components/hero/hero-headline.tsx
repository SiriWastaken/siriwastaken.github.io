"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/** Things I'm actually learning or heading into, each in its own colour. */
const words = [
  { text: "Swift.", className: "text-pop-orange" },
  { text: "Java.", className: "text-pop-teal" },
  { text: "TypeScript.", className: "text-accent" },
  { text: "C#.", className: "text-pop-purple" },
  { text: "open source.", className: "text-pop-green" },
  { text: "as I go.", className: "text-pop-pink" },
];

/** Line one rises out of a mask on load; line two cycles through what I'm learning. */
export function HeroHeadline() {
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [reduced]);

  const word = words[reduced ? words.length - 1 : index];

  return (
    <h1 id="hero-heading" className="font-display text-[clamp(2.6rem,8vw,6rem)] leading-[1.02]">
      <span className="sr-only">Still learning. Building as I go.</span>
      <span aria-hidden="true" className="block overflow-hidden pb-[0.14em]">
        <motion.span
          className="block"
          initial={{ y: "105%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        >
          Still learning
        </motion.span>
      </span>
      <span aria-hidden="true" className="block h-[1.14em] overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={word.text}
            className={`block ${word.className}`}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {word.text}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  );
}
