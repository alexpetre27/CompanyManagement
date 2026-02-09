"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectSelectorProps } from "@/types/project";
export function ProjectSelector({
  projects,
  selectedId,
  onSelect,
  themeRing,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedProject = projects.find((p) => p.id.toString() === selectedId);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [projects, search]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full h-12 px-4 rounded-xl bg-white/80 border border-slate-200/60 shadow-sm flex items-center justify-between transition-all",
          "focus:outline-none focus:ring-4 hover:bg-white",
          isOpen ? themeRing : "",
          !selectedProject ? "text-slate-400" : "text-slate-700 font-bold",
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <LayoutGrid
            size={18}
            className={selectedProject ? "text-indigo-500" : "text-slate-300"}
          />
          {selectedProject ? selectedProject.name : "Select a project..."}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "text-slate-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <div className="p-2 border-b border-slate-50 bg-slate-50/50">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search projects..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-400 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="max-h-50 overflow-y-auto p-1 scrollbar-hide">
              {filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      onSelect(project.id.toString());
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors",
                      project.id.toString() === selectedId
                        ? "bg-indigo-50 text-indigo-700 font-bold"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          project.status === "ACTIVE"
                            ? "bg-emerald-500"
                            : "bg-slate-300",
                        )}
                      />
                      {project.name}
                    </span>
                    {project.id.toString() === selectedId && (
                      <Check size={14} />
                    )}
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No projects found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
