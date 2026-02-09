"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, ChevronDown, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectSelectorProps } from "@/types/project";
import { createPortal } from "react-dom";

export function ProjectSelectorPortal({
  projects,
  selectedId,
  onSelect,
  themeRing,
}: ProjectSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const toggleOpen = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  const selectedProject = projects.find((p) => p.id.toString() === selectedId);
  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [projects, search]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={toggleOpen}
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

      <AnimatePresence>
        {isOpen &&
          typeof document !== "undefined" &&
          createPortal(
            <>
              <div
                className="fixed inset-0 z-[9998]"
                onClick={() => setIsOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                style={{
                  position: "absolute",
                  top: coords.top + 8,
                  left: coords.left,
                  width: coords.width,
                  zIndex: 9999,
                }}
                className="bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden"
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
                      className="w-full h-9 pl-9 pr-3 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-indigo-400"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto p-1">
                  {filteredProjects.map((project) => (
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
                  ))}
                </div>
              </motion.div>
            </>,
            document.body,
          )}
      </AnimatePresence>
    </div>
  );
}
