"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, X, LayoutGrid, List } from "lucide-react";
import { ProjectsToolbarProps } from "@/types/project";
export function ProjectsToolbar({
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  viewMode,
  setViewMode,
}: ProjectsToolbarProps) {
  const filters = ["ALL", "ACTIVE", "ON_HOLD", "COMPLETED"];

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-linear-to-r from-indigo-50/50 via-white to-white rounded-2xl -z-10" />
      <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-2xl shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] border border-slate-100 items-center">
        <div className="relative flex-1 w-full md:w-auto group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <Search size={18} />
          </div>
          <Input
            placeholder="Search projects..."
            className="pl-10 h-10 border-none bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all rounded-xl text-sm font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="hidden md:block w-px h-8 bg-slate-100 mx-2" />

        <div className="flex p-1 bg-slate-50/80 rounded-xl w-full md:w-auto overflow-x-auto no-scrollbar">
          {filters.map((status) => {
            const isActive = filterStatus === status;
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`relative px-4 py-1.5 rounded-lg text-xs font-bold transition-colors z-10 whitespace-nowrap ${
                  isActive
                    ? "text-indigo-700"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeFilter"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm border border-slate-200/50 -z-10"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {status.replace("_", " ")}
              </button>
            );
          })}
        </div>

        <div className="hidden md:flex gap-1 ml-2 border-l border-slate-100 pl-4 pr-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "text-indigo-600 bg-indigo-50 shadow-sm"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <LayoutGrid size={18} />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "text-indigo-600 bg-indigo-50 shadow-sm"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
