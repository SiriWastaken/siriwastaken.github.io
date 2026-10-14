type TechListProps = {
  technologies: string[];
  className?: string;
};

/** Stack as one line of mono metadata rather than a wall of badges. */
export function TechList({ technologies, className = "" }: TechListProps) {
  return (
    <ul aria-label="Technologies" className={`flex flex-wrap gap-x-3 gap-y-1 font-mono text-xs text-muted ${className}`}>
      {technologies.map((tech) => (
        <li key={tech} className="after:ml-3 after:text-rule-strong after:content-['/'] last:after:hidden">
          {tech}
        </li>
      ))}
    </ul>
  );
}
