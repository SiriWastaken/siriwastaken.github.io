import { Reveal } from "@/components/motion/reveal";
import { Container } from "./container";

type SectionProps = {
  id: string;
  title: string;
  /** Sit on the raised surface tone to change the page rhythm. */
  tone?: "surface";
  children: React.ReactNode;
};

/** Every home page section: a large title, then the content. */
export function Section({ id, title, tone, children }: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`py-20 sm:py-32 ${tone === "surface" ? "bg-surface" : ""}`}
    >
      <Container>
        <Reveal y={12}>
          <h2 id={headingId} className="text-center font-display text-5xl leading-none text-balance sm:text-7xl">
            {title}
          </h2>
        </Reveal>
        <div className="mt-12 sm:mt-20">{children}</div>
      </Container>
    </section>
  );
}
