import { getProjectAssets } from "@/assets/projects";
import { projects } from "@/data/projects";
import { site } from "@/data/site";
import { stack } from "@/data/stack";
import { Experience } from "./experience";

/** Builds the data the 3D desk needs from the same sources as the plain page. */
export function ExperienceSection() {
  const links = [
    ...(site.email ? [{ label: "Email", href: `mailto:${site.email}` }] : []),
    { label: "GitHub", href: site.githubUrl },
    { label: "DMOJ", href: site.dmojUrl },
  ];
  return (
    <Experience
      owner={{
        name: site.name,
        shortName: site.shortName,
        description: site.description,
        githubUrl: site.githubUrl,
        dmojUrl: site.dmojUrl,
        email: site.email,
      }}
      projects={projects.map((p) => ({ ...p, hero: getProjectAssets(p.slug).hero }))}
      stack={stack.map((g) => ({
        label: g.label,
        items: g.items.map(({ name, url, usedIn, learning }) => ({ name, url, usedIn, learning })),
      }))}
      about={site.about}
      links={links}
    />
  );
}
