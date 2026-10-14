import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectAssets } from "@/assets/projects";
import {
  DetailSection,
  Prose,
} from "@/components/project-detail/detail-section";
import { ProjectHeader } from "@/components/project-detail/project-header";
import { HighlightList } from "@/components/projects/highlight-list";
import { ProjectImage } from "@/components/projects/project-image";
import { SystemFlow } from "@/components/projects/system-flow";
import { TechList } from "@/components/projects/tech-list";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { getProject, getProjectsWithDetails } from "@/data/projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectsWithDetails().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}/` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project?.details) notFound();

  const { details } = project;
  const {
    hero,
    screenshots,
    diagrams,
  } = getProjectAssets(project.slug);
  const hasTopImage = Boolean(hero);

  const withDetails = getProjectsWithDetails();
  const next =
    withDetails[
      (withDetails.findIndex((p) => p.slug === project.slug) + 1) %
        withDetails.length
    ];

  return (
    <Reveal y={10}>
      <article>
        <Container>
          <ProjectHeader project={project} />

          {hasTopImage || project.flow ? (
            <div className="pb-14">
              <div className="overflow-hidden border border-rule-strong bg-surface">
                {hero ? (
                  <ProjectImage
                    image={hero}
                    eager
                    sizes="(min-width: 1152px) 1024px, 100vw"
                  />
                ) : project.flow ? (
                  <SystemFlow flow={project.flow} />
                ) : null}
              </div>
            </div>
          ) : null}

          <DetailSection id="overview" title="Overview">
            <Prose paragraphs={details.overview} />
          </DetailSection>

          {details.problem ? (
            <DetailSection id="problem" title="Problem">
              <Prose paragraphs={details.problem} />
            </DetailSection>
          ) : null}

          <DetailSection id="role" title="What I did">
            {details.role.length > 1 ? (
              <HighlightList
                items={details.role}
                className="max-w-2xl text-base"
              />
            ) : (
              <Prose paragraphs={details.role} />
            )}
          </DetailSection>

          <DetailSection id="stack" title="Built with">
            <TechList technologies={project.technologies} className="text-sm" />
          </DetailSection>

          <DetailSection id="architecture" title="Architecture">
            <Prose paragraphs={details.architecture} />
            {hasTopImage && project.flow ? (
              <div className="mt-8">
                <SystemFlow flow={project.flow} />
              </div>
            ) : null}
            {diagrams.map((diagram) => (
              <ProjectImage
                key={diagram.alt}
                image={diagram}
                sizes="(min-width: 1152px) 820px, (min-width: 768px) 75vw, 100vw"
                className="mt-8 border border-rule-strong"
              />
            ))}
          </DetailSection>

          <DetailSection id="challenges" title="The challenges">
            <div className="grid max-w-3xl gap-8">
              {details.challenges.map((challenge) => (
                <div key={challenge.title}>
                  <h3 className="font-display text-2xl tracking-tight">
                    {challenge.title}
                  </h3>
                  <p className="mt-2 text-lg leading-relaxed text-muted">
                    {challenge.body}
                  </p>
                </div>
              ))}
            </div>
          </DetailSection>

          {screenshots.length > 0 ? (
            <DetailSection id="screenshots" title="Screenshots">
              <div className="grid gap-6 sm:grid-cols-2">
                {screenshots.map((shot) => (
                  <ProjectImage
                    key={shot.alt}
                    image={shot}
                    sizes="(min-width: 1152px) 400px, (min-width: 640px) 45vw, 100vw"
                  />
                ))}
              </div>
            </DetailSection>
          ) : null}

          {details.learned ? (
            <DetailSection id="learned" title="What I learned">
              <Prose paragraphs={details.learned} />
            </DetailSection>
          ) : null}

          <nav
            aria-label="More projects"
            className="border-t border-ink py-14 sm:py-20"
          >
            <p className="font-mono text-xs text-muted">Next up</p>
            <div className="mt-3">
              <Link
                href={`/projects/${next.slug}`}
                className="group inline-flex items-baseline gap-4 font-display text-4xl tracking-tight text-balance transition-colors hover:text-accent sm:text-6xl"
              >
                {next.title}
                <span
                  aria-hidden="true"
                  className="inline-block transition-transform group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </nav>
        </Container>
      </article>
    </Reveal>
  );
}
