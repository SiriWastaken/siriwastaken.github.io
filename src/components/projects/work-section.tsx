import { getProjectsByTier } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { FeaturedProject } from "./featured-project";
import { FlagshipProject } from "./flagship-project";
import { ProjectListItem } from "./project-list-item";

export function WorkSection() {
  const flagship = getProjectsByTier("flagship");
  const featured = getProjectsByTier("featured");
  const additional = getProjectsByTier("additional");

  return (
    <Section
      id="work"
      title="Things I've built"
      intro={
        <p>
          Scouting and design tools for FRC Team 610, a performance benchmark, a developer tool, and a few smaller
          projects, from mobile apps to command-line utilities.
        </p>
      }
    >
      <div className="grid gap-5">
        {flagship.map((project) => (
          <FlagshipProject key={project.slug} project={project} />
        ))}
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((project) => (
            <FeaturedProject key={project.slug} project={project} />
          ))}
        </div>
        <ul className="grid gap-5">
          {additional.map((project) => (
            <ProjectListItem key={project.slug} project={project} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
