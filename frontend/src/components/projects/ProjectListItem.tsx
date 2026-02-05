"use client";

import { Users, Calendar, ChevronRight } from "lucide-react";
import { ProjectCardProps } from "@/types/project";

export function ProjectListItem({ project, onClick }: ProjectCardProps) {
  const statusColors: Record<string, string> = {
    ACTIVE: "bg-blue-500",
    COMPLETED: "bg-green-500",
    ON_HOLD: "bg-orange-500",
    DEFAULT: "bg-slate-300",
  };

  const statusColor = statusColors[project.status] || statusColors.DEFAULT;

  return (
    <div
      onClick={() => onClick(project)}
      className="group flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer"
    >
      {" "}
      <div className="flex items-center gap-4 min-w-50">
        <div
          className={`w-2.5 h-2.5 rounded-full ${statusColor}`}
          title={project.status}
        />
        <div>
          <h3 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {project.name}
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">
            {project.version}
          </p>
        </div>
      </div>
      <div className="hidden sm:block flex-1 mx-6">
        <p className="text-xs text-slate-500 truncate max-w-md">
          {project.description || "No description provided."}
        </p>
        <div className="flex gap-1 mt-1.5">
          {project.techStack?.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-500 rounded border border-slate-100"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
          <Users size={14} />
          <span className="text-xs font-bold text-slate-600">
            {project.teamCount || 0}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-slate-400">
          <Calendar size={14} />
          <span className="text-[11px] font-medium">{project.updatedAt}</span>
        </div>

        <div className="pl-2 border-l border-slate-100">
          <ChevronRight
            size={18}
            className="text-slate-300 group-hover:text-indigo-500 transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
