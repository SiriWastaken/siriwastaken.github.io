import { Section } from "@/components/ui/section";
import { TextLink } from "@/components/ui/text-link";

const areas = [
  {
    title: "Scouting",
    body: "The app scouts use in the stands to record every robot in every match, built for tablets and for venue networks that drop out.",
  },
  {
    title: "Strategy tooling",
    body: "Match planning, third-robot selection, multi-team comparison, and the picklist board used for alliance selection.",
  },
  {
    title: "Data analysis",
    body: "Per-team averages, Day 1 versus Day 2 splits, and box plots that show how consistent a robot is, not just its best match.",
  },
  {
    title: "Team infrastructure",
    body: "Couchbase sync between devices, Vercel deployments, and sign-in with roles and an audit log for the 2027 dashboard.",
  },
  {
    title: "Engineering workflow",
    body: "Documentation for whoever works on the code next, CI on every pull request, and a test bench that fails when coverage slips.",
  },
];

export function FrcSection() {
  return (
    <Section
      id="frc"
      title="Software for FRC Team 610"
      intro={
        <p>
          I work on the software side of FRC Team 610, the Crescent Coyotes. Most of it is about getting good data
          during an event and turning it into decisions. The details are in the{" "}
          <TextLink href="/projects/scouting-app-2026">2026 scouting app</TextLink> and{" "}
          <TextLink href="/projects/scouting-web-2027">2027 scouting web</TextLink> write-ups.
        </p>
      }
    >
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <div key={area.title} className="card reveal p-6">
            <dt className="text-lg font-semibold tracking-tight">{area.title}</dt>
            <dd className="mt-3 text-sm leading-relaxed text-muted">{area.body}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
