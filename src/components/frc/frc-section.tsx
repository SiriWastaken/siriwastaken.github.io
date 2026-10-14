import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

const areas = [
  {
    title: "Scouting",
    body: "The app scouts use in the stands to record every robot in every match, with a local-first database and the Toaster, a switch-and-LTE box, keeping the tablets in sync.",
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
    <Section id="frc" index="03" title="The team">
      <dl className="border-b border-rule-strong">
        {areas.map((area, i) => (
          <Reveal
            key={area.title}
            y={10}
            className="grid gap-x-10 gap-y-2 border-t border-rule-strong py-6 lg:grid-cols-12"
          >
            <dt className="font-display text-3xl tracking-tight lg:col-span-5">
              <span aria-hidden="true" className="mr-4 font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              {area.title}
            </dt>
            <dd className="leading-relaxed text-muted lg:col-span-6 lg:col-start-7">{area.body}</dd>
          </Reveal>
        ))}
      </dl>
    </Section>
  );
}
