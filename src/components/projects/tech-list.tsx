type TechListProps = {
  technologies: string[];
  className?: string;
};

export function TechList({ technologies, className = "" }: TechListProps) {
  return (
    <ul aria-label="Technologies" className={`flex flex-wrap gap-2 font-mono text-xs ${className}`}>
      {technologies.map((tech) => (
        <li
          key={tech}
          className="cursor-default rounded-full border border-rule bg-bg/40 px-3 py-1 text-muted transition duration-200 hover:border-accent hover:text-accent motion-safe:hover:-translate-y-0.5"
        >
          {tech}
        </li>
      ))}
    </ul>
  );
}
