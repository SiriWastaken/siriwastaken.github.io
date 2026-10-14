"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const links = [
  { id: "work", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "about", label: "About" },
  { id: "contact", label: "Say hi", wideOnly: true },
];

/** Main nav. A single underline slides to whichever section is under the middle of the viewport. */
export function NavLinks() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const { id } of links) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Main">
      <ul className="flex items-center gap-5 font-mono text-xs tracking-wide uppercase sm:gap-7">
        {links.map((link) => (
          <li
            key={link.id}
            className={link.wideOnly ? "hidden sm:block" : undefined}
          >
            <Link
              href={`/#${link.id}`}
              aria-current={active === link.id ? "location" : undefined}
              className={`relative block py-2 transition-colors hover:text-ink ${active === link.id ? "text-ink" : "text-muted"}`}
            >
              {link.label}
              {active === link.id ? (
                <motion.span
                  layoutId="nav-underline"
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0.5 h-0.5 bg-accent"
                  transition={{ type: "spring", stiffness: 500, damping: 40 }}
                />
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
