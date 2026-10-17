const dots = ["bg-pop-orange", "bg-pop-pink", "bg-pop-purple", "bg-pop-green"];

type HighlightListProps = {
  items: string[];
  /** Show only the first few; the case study has the rest. */
  limit?: number;
  className?: string;
};

export function HighlightList({ items, limit, className = "" }: HighlightListProps) {
  return (
    <ul className={`grid gap-y-4 text-sm leading-relaxed ${className}`}>
      {items.slice(0, limit).map((item, i) => (
        <li key={item} className="relative pl-5">
          <span aria-hidden="true" className={`absolute top-[0.6em] left-0 size-1.5 rounded-full ${dots[i % dots.length]}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}
