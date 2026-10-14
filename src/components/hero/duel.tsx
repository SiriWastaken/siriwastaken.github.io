"use client";

import { motion } from "motion/react";
import Link from "next/link";

/*
 * Real numbers from my benchmark (src/data/projects.ts, scouting-benchmark): median tap latency on the
 * Fire tablet. Bar widths are drawn to scale against the slower one.
 */
const rows = [
  { label: "Native Java", ms: 32, color: "bg-ink", text: "text-ink" },
  { label: "React Native", ms: 75, color: "bg-accent", text: "text-accent" },
];
const slowest = Math.max(...rows.map((r) => r.ms));

export function Duel() {
  return (
    <figure>
      <ul className="grid gap-5">
        {rows.map((row, i) => (
          <li key={row.label}>
            <div className="flex items-baseline justify-between font-mono text-sm">
              <span>{row.label}</span>
              <span className={`font-display text-4xl leading-none ${row.text}`}>
                {row.ms}
                <span className="font-mono text-sm"> ms</span>
              </span>
            </div>
            <div className="mt-2 h-10 border border-rule-strong sm:h-12">
              <motion.div
                className={`h-full origin-left ${row.color}`}
                style={{ width: `${(row.ms / slowest) * 100}%` }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5 + i * 0.15, ease: [0.2, 0.7, 0.2, 1] }}
              />
            </div>
          </li>
        ))}
      </ul>
      <figcaption className="mt-5 max-w-md text-sm leading-snug text-muted">
        Median tap latency on our scouting tablet, same scripted workload on both. I wanted to know if a rewrite was
        worth it.{" "}
        <Link href="/projects/scouting-benchmark" className="text-ink underline decoration-accent underline-offset-4 hover:text-accent">
          What else I found
        </Link>
      </figcaption>
    </figure>
  );
}
