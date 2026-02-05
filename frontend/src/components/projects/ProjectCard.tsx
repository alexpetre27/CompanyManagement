"use client";

import { Card } from "@/components/ui/card";
import { MoreVertical, Users, Globe, Github } from "lucide-react";
import { ProjectCardProps } from "@/types/project";

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-blue-50 text-blue-600 border-blue-100",
    COMPLETED: "bg-green-50 text-green-600 border-green-100",
    ON_HOLD: "bg-orange-50 text-orange-600 border-orange-100",
    DEFAULT: "bg-slate-50 text-slate-600 border-slate-100",
  };

  const statusStyle = statusColors[project.status] || statusColors.DEFAULT;

  return (
    <Card
      onClick={() => onClick(project)}
      className="p-5 border-none shadow-sm rounded-4xl bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-1 group cursor-pointer h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-3">
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${statusStyle}`}
        >
          {project.status.replace("_", " ")}
        </span>
        <div className="text-slate-300">
          <MoreVertical size={16} />
        </div>
      </div>

      <h3 className="text-sm font-bold text-[#1a1f36] mb-1 group-hover:text-[#6366f1] transition-colors">
        {project.name}
      </h3>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 line-clamp-2 flex-1">
        {project.description || "No description provided."}
      </p>

      <div className="flex gap-1 flex-wrap mb-4">
        {project.techStack?.slice(0, 3).map((tech) => (
          <span
            key={tech}
            className="text-[9px] bg-slate-50 text-slate-500 px-1.5 py-0.5 rounded border border-slate-100"
          >
            {tech}
          </span>
        ))}
        {(project.techStack?.length || 0) > 3 && (
          <span className="text-[9px] text-slate-400">
            +{(project.techStack?.length || 0) - 3}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Users size={14} />
          <span className="text-[11px] font-medium">
            {project.teamCount || 0}
          </span>
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          {project.repoUrl && (
            <Github size={14} className="hover:text-black transition-colors" />
          )}
          {project.liveUrl && (
            <Globe
              size={14}
              className="hover:text-blue-500 transition-colors"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
