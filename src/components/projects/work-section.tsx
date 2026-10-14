import { Section } from "@/components/ui/section";
import { getProjectsByTier } from "@/data/projects";
import { FeaturedProject } from "./featured-project";
import { FlagshipProject } from "./flagship-project";
import { ProjectListItem } from "./project-list-item";

export function WorkSection() {
  const flagship = getProjectsByTier("flagship");
  const featured = getProjectsByTier("featured");
  const additional = getProjectsByTier("additional");

  return (
    <Section id="work" index="01" title="Stuff I've built">
      <div>
        {flagship.map((project, i) => (
          <FlagshipProject key={project.slug} project={project} index={i} />
        ))}
        <div className="grid gap-x-14 gap-y-16 pb-24 md:grid-cols-2">
          {featured.map((project) => (
            <FeaturedProject key={project.slug} project={project} />
          ))}
        </div>
        <ul>
          {additional.map((project) => (
            <ProjectListItem key={project.slug} project={project} />
          ))}
        </ul>
      </div>
    </Section>
  );
}
