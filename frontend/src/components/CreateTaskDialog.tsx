"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Flame,
  LayoutGrid,
  ChevronDown,
  Search,
  Check,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { createTask, CreateTaskDTO } from "@/lib/task.service";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
}

const themeConfig = {
  LOW: {
    bg: "bg-emerald-50/30",
    border: "border-emerald-100",
    accent: "text-emerald-600",
    ring: "focus:ring-emerald-100",
    button: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200",
    icon: CheckCircle2,
    gradient: "from-emerald-50/50 to-white",
  },
  MEDIUM: {
    bg: "bg-amber-50/30",
    border: "border-amber-100",
    accent: "text-amber-600",
    ring: "focus:ring-amber-100",
    button: "bg-amber-500 hover:bg-amber-600 shadow-amber-200",
    icon: AlertCircle,
    gradient: "from-amber-50/50 to-white",
  },
  HIGH: {
    bg: "bg-rose-50/30",
    border: "border-rose-100",
    accent: "text-rose-600",
    ring: "focus:ring-rose-100",
    button: "bg-rose-600 hover:bg-rose-700 shadow-rose-200",
    icon: Flame,
    gradient: "from-rose-50/50 to-white",
  },
};

export function CreateTaskDialog({
  isOpen,
  onOpenChange,
  projects,
}: CreateTaskDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTaskDTO>({
    title: "",
    projectId: "",
    difficulty: "LOW",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({ title: "", projectId: "", difficulty: "LOW" });
    }
  }, [isOpen]);

  const currentTheme = themeConfig[formData.difficulty];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.projectId) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await createTask(formData);
      toast.success("Task created successfully!");
      onOpenChange(false);
      router.refresh();
    } catch {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-115 p-0 overflow-hidden border-none shadow-2xl rounded-[28px]">
        <motion.div
          initial={false}
          animate={{
            backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
          }}
          className={`relative h-full w-full bg-white p-6 md:p-8 transition-colors duration-500 bg-linear-to-br ${currentTheme.gradient}`}
        >
          <DialogHeader className="mb-6 relative z-10">
            <DialogTitle className="text-2xl font-black text-[#1a1f36] flex items-center gap-3">
              <motion.div
                layoutId="icon-bg"
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300 shadow-sm",
                  currentTheme.bg,
                  currentTheme.accent,
                )}
              >
                <currentTheme.icon size={20} />
              </motion.div>
              New Task
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* 1. Title Input - Mare și curat */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">
                What needs to be done?
              </Label>
              <div className="relative group">
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. Update API documentation"
                  className={cn(
                    "h-14 pl-4 pr-4 rounded-2xl bg-white/80 border-slate-200/60 shadow-sm text-lg font-semibold text-slate-700 placeholder:text-slate-300 transition-all",
                    "focus:bg-white focus:border-transparent focus:ring-4",
                    currentTheme.ring,
                  )}
                />
              </div>
            </div>

            {/* 2. Custom Project Selector */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">
                Project Context
              </Label>
              <ProjectSelector
                projects={projects}
                selectedId={formData.projectId}
                onSelect={(id) => setFormData({ ...formData, projectId: id })}
                themeRing={currentTheme.ring}
              />
            </div>

            {/* 3. Difficulty Cards */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">
                Impact / Difficulty
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {(
                  Object.keys(themeConfig) as Array<keyof typeof themeConfig>
                ).map((level) => {
                  const isSelected = formData.difficulty === level;
                  const theme = themeConfig[level];

                  return (
                    <motion.div
                      key={level}
                      onClick={() =>
                        setFormData({ ...formData, difficulty: level })
                      }
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        "cursor-pointer relative flex flex-col items-center justify-center p-3 h-24 rounded-2xl border-2 transition-all duration-300",
                        isSelected
                          ? cn("bg-white shadow-md", theme.border)
                          : "bg-white/50 border-transparent hover:bg-white hover:border-slate-100",
                      )}
                    >
                      <div
                        className={cn(
                          "mb-2 p-1.5 rounded-full transition-colors",
                          isSelected ? theme.bg : "bg-slate-100",
                        )}
                      >
                        <theme.icon
                          size={18}
                          className={
                            isSelected ? theme.accent : "text-slate-400"
                          }
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-wider transition-colors",
                          isSelected ? theme.accent : "text-slate-400",
                        )}
                      >
                        {level}
                      </span>

                      {isSelected && (
                        <motion.div
                          layoutId="active-dot"
                          className={cn(
                            "absolute top-2 right-2 w-2 h-2 rounded-full",
                            theme.button.split(" ")[0],
                          )}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <DialogFooter className="pt-4 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="flex-1 rounded-xl h-12 font-bold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex-1 text-white rounded-xl h-12 font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]",
                  currentTheme.button,
                )}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Zap size={18} className="mr-2 fill-current" />
                )}
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

// --- Custom Project Dropdown Component ---
function ProjectSelector({
  projects,
  selectedId,
  onSelect,
  themeRing,
}: {
  projects: Project[];
  selectedId: string;
  onSelect: (id: string) => void;
  themeRing: string;
}) {
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

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
