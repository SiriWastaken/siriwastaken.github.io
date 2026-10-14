import { Reveal } from "@/components/motion/reveal";
import { Container } from "./container";

type SectionProps = {
  id: string;
  /** Two-digit section number. */
  index: string;
  title: string;
  children: React.ReactNode;
};

/** Every home page section: its number and a serif title, then the content. */
export function Section({ id, index, title, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="border-b border-rule py-16 sm:py-24">
      <Container>
        <Reveal y={12} className="flex items-end gap-4 sm:gap-6">
          <span aria-hidden="true" className="font-mono text-sm text-accent sm:pb-3">
            {index}
          </span>
          <h2 id={headingId} className="font-display text-5xl leading-none tracking-tight text-balance sm:text-7xl">
            {title}
          </h2>
        </Reveal>
        <div className="mt-12 sm:mt-16">{children}</div>
      </Container>
    </section>
  );
}
