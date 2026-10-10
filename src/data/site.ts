export const site = {
  name: "SiriWasTaken (Sri)",
  shortName: "Sri",
  title: "SiriWasTaken (Sri) - Student Developer",
  description:
    "Student developer building full-stack software, robotics tools, and systems that solve real problems. Software for FRC Team 610 and hardware experiments.",
  githubUrl: "https://github.com/SiriWastaken",
  dmojUrl: "https://dmoj.ca/user/SiriWastaken",
  // TODO: add your LinkedIn profile URL. The LinkedIn button stays hidden until this is set.
  linkedinUrl: undefined as string | undefined,
} as const;

/**
 * Canonical site URL: the GitHub Pages user site. Override with NEXT_PUBLIC_SITE_URL;
 * `next dev` falls back to localhost.
 */
export function getSiteUrl(): URL {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return new URL(explicit);
  return new URL(process.env.NODE_ENV === "production" ? "https://siriwastaken.github.io" : "http://localhost:3000");
}
