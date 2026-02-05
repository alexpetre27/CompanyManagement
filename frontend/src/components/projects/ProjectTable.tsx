"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import {
  Search,
  MoreVertical,
  ExternalLink,
  RefreshCw,
  Layers,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ProjectsTableProps {
  initialProjects: Project[];
  currentUserRole?: string;
}

export function ProjectsTable({
  initialProjects,
  currentUserRole,
}: ProjectsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = initialProjects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === "active" || s === "running")
      return "bg-emerald-50 text-emerald-600";
    if (s === "inactive" || s === "stopped") return "bg-rose-50 text-rose-600";
    if (s === "starting") return "bg-orange-50 text-orange-600";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden transition-shadow duration-300 hover:shadow-md">
      <div className="p-4 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/30">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-2.5 text-slate-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Project Name
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Details
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Uptime
              </th>
              <th className="px-6 py-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.tr
                  key={project.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <Layers size={18} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700 text-sm">
                          {project.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          v{project.version}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(project.status)}`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                      <Globe size={12} />
                      <span>{project.port}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-500">
                    {project.uptime}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {currentUserRole === "ADMIN" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-orange-600 hover:bg-orange-50 active:scale-95 transition-all"
                          title="Restart Service"
                        >
                          <RefreshCw size={16} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-indigo-600 hover:bg-indigo-50 active:scale-95 transition-all"
                      >
                        <ExternalLink size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:text-slate-900 active:scale-95 transition-all"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-3">
                      <Layers size={24} className="opacity-20" />
                    </div>
                    <p className="font-bold text-slate-600 text-sm">
                      No projects found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
