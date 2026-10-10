import { getProjectsByTier } from "@/data/projects";
import { Section } from "@/components/ui/section";
import { FeaturedProject } from "./featured-project";
import { FlagshipProject } from "./flagship-project";
import { ProjectListItem } from "./project-list-item";

function GroupLabel({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h3 id={id} className="mb-8 font-mono text-xs tracking-wide text-muted uppercase">
      {children}
    </h3>
  );
}

export function WorkSection() {
  const flagship = getProjectsByTier("flagship");
  const featured = getProjectsByTier("featured");
  const additional = getProjectsByTier("additional");

  return (
    <Section
      id="work"
      index="01"
      label="Work"
      title="Things I've built"
      intro={
        <p>
          Most of this is software for FRC Team 610, built for scouts and strategists to use at competitions. The rest is
          independent work: a benchmark, a developer tool, and a few smaller projects.
        </p>
      }
    >
      <section aria-labelledby="work-scouting">
        <GroupLabel id="work-scouting">Scouting systems · Team 610</GroupLabel>
        {flagship.map((project, index) => (
          <FlagshipProject key={project.slug} project={project} position={index + 1} />
        ))}
      </section>

      <section aria-labelledby="work-major" className="mt-20">
        <GroupLabel id="work-major">Hardware &amp; software</GroupLabel>
        {featured.length > 1 ? (
          <div className="grid gap-12 md:grid-cols-2 md:gap-8">
            {featured.map((project) => (
              <FeaturedProject key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <div className="md:grid md:grid-cols-12 md:gap-x-8">
            {featured.map((project) => (
              <div key={project.slug} className="md:col-span-9 md:col-start-4">
                <FeaturedProject project={project} />
              </div>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="work-more" className="mt-20">
        <GroupLabel id="work-more">More projects</GroupLabel>
        <ul className="border-b border-rule">
          {additional.map((project) => (
            <ProjectListItem key={project.slug} project={project} />
          ))}
        </ul>
      </section>
    </Section>
  );
}
