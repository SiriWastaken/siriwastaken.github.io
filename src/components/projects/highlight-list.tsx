type HighlightListProps = {
  items: string[];
  columns?: 1 | 2;
  className?: string;
};

export function HighlightList({ items, columns = 1, className = "" }: HighlightListProps) {
  return (
    <ul
      className={`grid gap-x-10 gap-y-4 text-sm leading-relaxed ${columns === 2 ? "sm:grid-cols-2" : ""} ${className}`}
    >
      {items.map((item) => (
        <li key={item} className="relative pl-4">
          <span aria-hidden="true" className="absolute top-[0.6em] left-0 h-px w-2 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}
