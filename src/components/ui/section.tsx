import { Container } from "./container";

type SectionProps = {
  id: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
};

/** Every home page section: a centered heading and intro, then the content. */
export function Section({ id, title, intro, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="py-16 sm:py-24">
      <Container>
        <div className="reveal mx-auto max-w-3xl text-center">
          <h2 id={headingId} className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h2>
          {intro ? <div className="mt-5 text-lg leading-relaxed text-balance text-muted">{intro}</div> : null}
        </div>
        <div className="mt-12 sm:mt-16">{children}</div>
      </Container>
    </section>
  );
}
