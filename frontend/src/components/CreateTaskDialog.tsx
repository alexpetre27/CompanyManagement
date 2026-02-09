"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
import { Loader2, Zap } from "lucide-react";
import { toast } from "sonner";
import { createTask, CreateTaskDTO } from "@/lib/task.service";
import { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import {
  themeConfig,
  DifficultyLevel,
  CreateTaskDialogProps,
} from "@/types/dashboard";
import { ProjectSelector } from "@/components/ProjectSelector";
import { DifficultySelector } from "@/components/DifficultySelector";

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

  const currentTheme = themeConfig[formData.difficulty as DifficultyLevel];

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

            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">
                Impact / Difficulty
              </Label>
              <DifficultySelector
                value={formData.difficulty as DifficultyLevel}
                onChange={(level) =>
                  setFormData({ ...formData, difficulty: level })
                }
              />
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
