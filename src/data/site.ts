export const site = {
  name: "SiriWasTaken (Sri)",
  shortName: "Sri",
  title: "SiriWasTaken (Sri) - Student Developer",
  description:
    "Student developer building full-stack software, robotics tools, and developer tooling. Projects include scouting and design tools for FRC Team 610 and a performance benchmark.",
  githubUrl: "https://github.com/SiriWastaken",
  dmojUrl: "https://dmoj.ca/user/SiriWastaken",
  // TODO: add the contact email. The mailto row stays hidden until this is set.
  email: undefined as string | undefined,
  // Shared by the About section and the About window on the desk.
  about: [
    "I'm a high-school student who likes building things and figuring out how they work. I started with Java, took ICS3U, and built a Swing game for the Grade 11 final. Now it's mostly TypeScript: React Native on our team's scouting tablets, Next.js for the web.",
    "I like software that has to cope with messy conditions, like tablets syncing through a network box we built ourselves, or a benchmark that has to back up its own numbers. Next up is my first open-source contribution, starting with The Blue Alliance.",
  ],
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
