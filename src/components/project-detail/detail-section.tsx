type DetailSectionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
};

/** One titled block of a project page: the title in a left rail, content to its right. */
export function DetailSection({ id, title, children }: DetailSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-x-10 gap-y-4 border-t border-rule-strong py-10 sm:py-12 lg:grid-cols-12"
    >
      <h2 id={id} className="font-display text-2xl tracking-tight lg:col-span-3">
        {title}
      </h2>
      <div className="min-w-0 lg:col-span-9">{children}</div>
    </section>
  );
}

export function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="max-w-3xl space-y-4 text-lg leading-relaxed">
      {paragraphs.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  );
}
