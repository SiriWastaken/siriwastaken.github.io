type HighlightListProps = {
  items: string[];
  /** Show only the first few; the case study has the rest. */
  limit?: number;
  className?: string;
};

export function HighlightList({ items, limit, className = "" }: HighlightListProps) {
  return (
    <ul className={`grid gap-y-4 text-sm leading-relaxed ${className}`}>
      {items.slice(0, limit).map((item) => (
        <li key={item} className="relative pl-5">
          <span aria-hidden="true" className="absolute top-[0.7em] left-0 h-px w-3 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}
