type DetailSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

/** One titled block of a project page, in a centered reading column. */
export function DetailSection({ id, title, children }: DetailSectionProps) {
  return (
    <section aria-labelledby={id} className="mx-auto max-w-3xl border-t border-rule py-10 sm:py-12">
      <h2 id={id} className="text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-5 min-w-0">{children}</div>
    </section>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4 leading-relaxed">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
