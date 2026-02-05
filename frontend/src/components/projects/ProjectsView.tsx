"use client";

import { useState } from "react";
import { Project } from "@/types/project";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { ProjectListItem } from "@/components/projects/ProjectListItem";
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, Search } from "lucide-react";
import { ProjectsToolbar } from "@/components/projects/ProjectToolbar";
import { ProjectDetailsDialog } from "@/components/projects/ProjectDetailsDialog";
import { CreateProjectDialog } from "@/components/projects/ProjectDialog";

export function ProjectsView({
  initialProjects,
  isAdmin,
}: {
  initialProjects: Project[];
  isAdmin: boolean;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredProjects = initialProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterStatus === "ALL" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#1a1f36] flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
              <FolderKanban size={24} />
            </div>
            Projects
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-2 ml-1">
            Overview of your team's ongoing work and status.
          </p>
        </div>

        {isAdmin && (
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm font-bold h-10 px-6"
          >
            <Plus size={18} className="mr-2" /> New Project
          </Button>
        )}
      </div>

      <ProjectsToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {filteredProjects.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              : "flex flex-col gap-3"
          }
        >
          {filteredProjects.map((project) =>
            viewMode === "grid" ? (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={(p: Project) => setSelectedProject(p)}
              />
            ) : (
              <ProjectListItem
                key={project.id}
                project={project}
                onClick={(p: Project) => setSelectedProject(p)}
              />
            ),
          )}
        </div>
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search className="text-slate-300" size={24} />
          </div>
          <h3 className="text-slate-900 font-bold mb-1">No projects found</h3>
          <p className="text-slate-500 text-sm">
            Try adjusting your search or filters.
          </p>
          <Button
            variant="link"
            className="text-indigo-600 mt-2"
            onClick={() => {
              setSearchTerm("");
              setFilterStatus("ALL");
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Modals */}
      <ProjectDetailsDialog
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      <CreateProjectDialog
        isOpen={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isAdmin={isAdmin}
      />
    </div>
  );
}
