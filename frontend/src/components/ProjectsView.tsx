"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/ProjectCard";
import { ProjectListItem } from "@/components/ProjectListItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  FolderKanban,
  Users,
  Globe,
  Github,
  Layers,
  LayoutGrid,
  List,
  X,
  CheckCircle2,
  Clock,
  Activity,
  AlertCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Project } from "@/types/project";
import { User } from "@/types/user";

export function ProjectsView({
  initialProjects,
  isAdmin,
}: {
  initialProjects: Project[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    version: "v1.0.0",
    port: 3000,
    description: "",
    repoUrl: "",
    liveUrl: "",
    techStack: "",
    teamMembers: [] as string[],
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    if (isCreateOpen && isAdmin) {
      setIsLoadingMembers(true);
      fetch(`${apiUrl}/users`, {
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Failed to fetch users");
        })
        .then((data: User[]) => setAvailableMembers(data))
        .catch(() => setAvailableMembers([]))
        .finally(() => setIsLoadingMembers(false));
    }
  }, [isCreateOpen, isAdmin, apiUrl]);

  const filteredProjects = initialProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter =
      filterStatus === "ALL" || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filters = ["ALL", "ACTIVE", "ON_HOLD", "COMPLETED"];

  const getStatusDetails = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          icon: <CheckCircle2 size={28} />,
          color: "text-green-500",
          bg: "bg-green-50",
        };
      case "ON_HOLD":
        return {
          icon: <Clock size={28} />,
          color: "text-orange-500",
          bg: "bg-orange-50",
        };
      case "INACTIVE":
        return {
          icon: <AlertCircle size={28} />,
          color: "text-red-500",
          bg: "bg-red-50",
        };
      case "ACTIVE":
      default:
        return {
          icon: <Activity size={28} />,
          color: "text-blue-500",
          bg: "bg-blue-50",
        };
    }
  };

  const toggleMember = (memberName: string) => {
    setFormData((prev) => {
      const exists = prev.teamMembers.includes(memberName);
      if (exists) {
        return {
          ...prev,
          teamMembers: prev.teamMembers.filter((m) => m !== memberName),
        };
      } else {
        return { ...prev, teamMembers: [...prev.teamMembers, memberName] };
      }
    });
  };

  const handleCreateProject = async () => {
    if (!formData.name || !formData.port) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        techStack: formData.techStack
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""),
        teamMembers: formData.teamMembers,
      };

      const sessionUserEmail = "petrealexandru1152@gmail.com";

      const res = await fetch(`${apiUrl}/projects/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Email": sessionUserEmail,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsCreateOpen(false);
        setFormData({
          name: "",
          version: "v1.0.0",
          port: 3000,
          description: "",
          repoUrl: "",
          liveUrl: "",
          techStack: "",
          teamMembers: [],
        });
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
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
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "text-indigo-600 bg-indigo-50 shadow-sm" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "text-indigo-600 bg-indigo-50 shadow-sm" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>

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
                onClick={(p) => setSelectedProject(p)}
              />
            ) : (
              <ProjectListItem
                key={project.id}
                project={project}
                onClick={(p) => setSelectedProject(p)}
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

      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent className="max-w-3xl bg-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden outline-none">
          <AnimatePresence mode="wait">
            {selectedProject && (
              <motion.div
                key={selectedProject.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col h-full"
              >
                <DialogHeader
                  className={`p-8 pb-6 bg-linear-to-b ${getStatusDetails(selectedProject.status).bg}/30 to-white relative overflow-hidden`}
                >
                  <div
                    className={`absolute -top-6 -right-6 opacity-10 rotate-12 ${getStatusDetails(selectedProject.status).color}`}
                  >
                    {getStatusDetails(selectedProject.status).icon}
                  </div>
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-4 items-center">
                      <div
                        className={`p-3 rounded-2xl bg-white shadow-sm shadow-indigo-100/50 border border-slate-100 ${getStatusDetails(selectedProject.status).color}`}
                      >
                        {getStatusDetails(selectedProject.status).icon}
                      </div>
                      <div>
                        <DialogTitle className="text-2xl font-black text-[#1a1f36] tracking-tight">
                          {selectedProject.name}
                        </DialogTitle>
                        <DialogDescription className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-3">
                          <span>v{selectedProject.version}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span>
                            Port:{" "}
                            <span className="font-mono text-slate-600">
                              {selectedProject.port}
                            </span>
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="uppercase text-[10px] font-bold tracking-wider">
                            {selectedProject.status.replace("_", " ")}
                          </span>
                        </DialogDescription>
                      </div>
                    </div>
                  </div>
                </DialogHeader>

                <div className="p-8 pt-2 space-y-8 bg-white flex-1">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative group hover:border-indigo-100 transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-2xl group-hover:bg-indigo-600 transition-colors" />
                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 ml-3">
                      About Project
                    </h4>
                    <p className="text-sm text-slate-600 leading-7 ml-3">
                      {selectedProject.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Layers size={16} className="text-indigo-500" /> Tech
                        Stack
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {selectedProject.techStack?.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1.5 bg-white border border-slate-200/60 text-slate-700 text-[11px] font-bold rounded-xl shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition-all cursor-default"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                        <Users size={16} className="text-indigo-500" /> Team
                        Members
                      </h4>
                      <div className="space-y-3">
                        {selectedProject.team?.map((member, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-100 to-white border border-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-black shadow-sm">
                                {member.avatar || member.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-800">
                                  {member.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium">
                                  {member.role}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex gap-4 sticky bottom-0 w-full">
                  {selectedProject.repoUrl && (
                    <a
                      href={selectedProject.repoUrl}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button className="w-full bg-slate-900 hover:bg-black text-white rounded-xl gap-2 text-xs font-bold h-11 shadow-md shadow-slate-200 hover:-translate-y-0.5 transition-transform">
                        <Github size={16} /> Repository
                      </Button>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a
                      href={selectedProject.liveUrl}
                      target="_blank"
                      className="flex-1"
                    >
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 text-xs font-bold h-11 shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-transform">
                        <Globe size={16} /> Live Preview
                      </Button>
                    </a>
                  )}
                  {!selectedProject.repoUrl && !selectedProject.liveUrl && (
                    <p className="text-xs text-slate-400 font-medium italic w-full text-center">
                      No external links available.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-xl bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden outline-none">
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col h-full"
          >
            <DialogHeader className="p-6 pb-2 border-b border-slate-100 bg-slate-50/50">
              <DialogTitle className="text-lg font-bold text-[#1a1f36] flex items-center gap-2">
                <div className="bg-indigo-100 text-indigo-600 p-1.5 rounded-lg">
                  <Plus className="w-5 h-5" />
                </div>
                Create New Project
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Fill in the details below to initialize a new microservice.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    Project Name
                  </Label>
                  <Input
                    placeholder="e.g. Auth Service"
                    className="h-9 text-xs"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    Version
                  </Label>
                  <Input
                    placeholder="v1.0.0"
                    className="h-9 text-xs"
                    value={formData.version}
                    onChange={(e) =>
                      setFormData({ ...formData, version: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">
                  Description
                </Label>
                <Textarea
                  placeholder="Describe the purpose of this microservice..."
                  className="min-h-20 text-xs resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700">
                    Port
                  </Label>
                  <Input
                    type="number"
                    placeholder="8080"
                    className="h-9 text-xs"
                    value={formData.port}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        port: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">
                  Tech Stack (comma separated)
                </Label>
                <Input
                  placeholder="Java, Spring Boot, Docker..."
                  className="h-9 text-xs"
                  value={formData.techStack}
                  onChange={(e) =>
                    setFormData({ ...formData, techStack: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700 mb-1 block">
                  Assign Team Members
                </Label>
                <div className="border border-slate-100 rounded-xl p-2 max-h-40 overflow-y-auto bg-slate-50/50 space-y-1">
                  {isLoadingMembers ? (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
                      <Loader2 className="animate-spin w-5 h-5" />
                      <span className="text-[10px]">
                        Loading users from database...
                      </span>
                    </div>
                  ) : availableMembers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-slate-400 gap-2">
                      <AlertTriangle className="w-5 h-5 opacity-50" />
                      <span className="text-[10px]">No users found.</span>
                    </div>
                  ) : (
                    availableMembers.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-all cursor-pointer border ${
                          formData.teamMembers.includes(member.name)
                            ? "bg-indigo-50 border-indigo-100"
                            : "bg-white border-transparent hover:bg-white hover:border-slate-100"
                        }`}
                        onClick={() => toggleMember(member.name)}
                      >
                        <Checkbox
                          id={`member-${member.id}`}
                          checked={formData.teamMembers.includes(member.name)}
                          className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                        />
                        <div className="flex-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white border border-slate-100 text-[9px] font-bold flex items-center justify-center text-slate-600">
                              {member.avatar || member.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-slate-700 leading-none">
                                {member.name}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {member.role || "User"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <p className="text-[10px] text-slate-400 text-right">
                  {formData.teamMembers.length} members selected
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Github size={12} /> Repository URL
                  </Label>
                  <Input
                    placeholder="https://github.com/..."
                    className="h-9 text-xs"
                    value={formData.repoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, repoUrl: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Globe size={12} /> Live URL
                  </Label>
                  <Input
                    placeholder="https://api.example.com"
                    className="h-9 text-xs"
                    value={formData.liveUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, liveUrl: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 pt-2 border-t border-slate-100 bg-slate-50/50">
              <Button
                variant="ghost"
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                Cancel
              </Button>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleCreateProject}
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Project
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
