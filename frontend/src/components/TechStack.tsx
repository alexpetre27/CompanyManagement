export function TechStack({ technologies }: { technologies: string[] }) {
  if (!technologies || technologies.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
        Tech Stack
      </h3>
      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <span
            key={tech}
            className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-100"
          >
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
