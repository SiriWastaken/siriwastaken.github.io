import { Container } from "./container";

type SectionProps = {
  id: string;
  index: string;
  label: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Every home page section shares the same frame: a hairline rule, a mono
 * label in the left rail, and content in the remaining nine columns.
 */
export function Section({ id, index, label, title, intro, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="py-12 sm:py-16">
      <Container>
        <div className="reveal grid gap-y-4 border-t border-rule-strong pt-6 md:grid-cols-12 md:gap-x-8">
          <p className="font-mono text-xs tracking-wide text-muted uppercase md:col-span-3">
            <span className="text-accent">{index}</span>
            <span aria-hidden="true"> / </span>
            {label}
          </p>
          <div className="md:col-span-9">
            <h2 id={headingId} className="max-w-2xl text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {title}
            </h2>
            {intro ? <div className="mt-4 max-w-2xl text-muted">{intro}</div> : null}
          </div>
        </div>
        <div className="mt-10 sm:mt-12">{children}</div>
      </Container>
    </section>
  );
}
