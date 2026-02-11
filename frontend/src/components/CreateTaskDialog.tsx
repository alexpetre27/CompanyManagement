"use client";

import { useState, useEffect } from "react";
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
  Zap,
  Check,
  ChevronsUpDown,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import { createTask, CreateTaskDTO } from "@/lib/task.service";
import { User } from "@/types/user";
import { cn } from "@/lib/utils";
import {
  themeConfig,
  DifficultyLevel,
  CreateTaskDialogProps,
} from "@/types/dashboard";
import { ProjectSelector } from "@/components/ProjectSelector";
import { DifficultySelector } from "@/components/DifficultySelector";

interface ExtendedProps extends CreateTaskDialogProps {
  users: User[];
  currentUser?: { role?: string };
}

export function CreateTaskDialog({
  isOpen,
  onOpenChange,
  projects,
  users,
  currentUser,
}: ExtendedProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isAssigneeOpen, setIsAssigneeOpen] = useState(false);
  const [formData, setFormData] = useState<
    CreateTaskDTO & { assigneeId?: string }
  >({
    title: "",
    projectId: "",
    difficulty: "LOW",
    assigneeId: "",
  });

  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: "",
        projectId: "",
        difficulty: "LOW",
        assigneeId: "",
      });
      setIsAssigneeOpen(false);
    }
  }, [isOpen]);

  const currentTheme = themeConfig[formData.difficulty as DifficultyLevel];

  const selectedUser = users.find(
    (u) => u.id.toString() === formData.assigneeId,
  );

  const getInitials = (name?: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.projectId) {
      toast.error("Please fill in all required fields");
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
      <DialogContent className="sm:max-w-115 p-0 overflow-visible border-none shadow-2xl rounded-[28px]">
        <motion.div
          initial={false}
          animate={{
            backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
          }}
          className={`relative h-full w-full bg-white p-6 md:p-8 transition-colors duration-500 bg-linear-to-br ${currentTheme.gradient} rounded-[28px]`}
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

            <div
              className={cn(
                "grid gap-4",
                isAdmin ? "grid-cols-2" : "grid-cols-1",
              )}
            >
              <div className="space-y-2">
                <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">
                  Project
                </Label>
                <ProjectSelector
                  projects={projects}
                  selectedId={formData.projectId}
                  onSelect={(id) => setFormData({ ...formData, projectId: id })}
                  themeRing={currentTheme.ring}
                />
              </div>

              {isAdmin && (
                <div className="space-y-2 relative">
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pl-1">
                    Assignee
                  </Label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsAssigneeOpen(!isAssigneeOpen)}
                      className={cn(
                        "w-full h-14 pl-3 pr-4 flex items-center justify-between rounded-2xl bg-white/80 border border-slate-200/60 shadow-sm font-semibold text-slate-700 transition-all outline-none",
                        "hover:bg-white",
                        isAssigneeOpen
                          ? `ring-4 bg-white ${currentTheme.ring}`
                          : "",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white shadow-sm",
                            selectedUser
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-slate-100 text-slate-400",
                          )}
                        >
                          {selectedUser ? (
                            getInitials(selectedUser.name || selectedUser.email)
                          ) : (
                            <UserIcon size={14} />
                          )}
                        </div>
                        <span className="truncate max-w-25 text-sm">
                          {selectedUser
                            ? selectedUser.name || selectedUser.email
                            : "Unassigned"}
                        </span>
                      </div>
                      <ChevronsUpDown size={16} className="text-slate-400" />
                    </button>

                    <AnimatePresence>
                      {isAssigneeOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-20"
                            onClick={() => setIsAssigneeOpen(false)}
                          />
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-2 p-1 bg-white rounded-2xl shadow-xl border border-slate-100 z-30 max-h-60 overflow-y-auto"
                          >
                            <div
                              onClick={() => {
                                setFormData({ ...formData, assigneeId: "" });
                                setIsAssigneeOpen(false);
                              }}
                              className={cn(
                                "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors",
                                !formData.assigneeId
                                  ? "bg-slate-50 text-slate-900"
                                  : "hover:bg-slate-50 text-slate-600",
                              )}
                            >
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                                <UserIcon
                                  size={14}
                                  className="text-slate-400"
                                />
                              </div>
                              <span className="text-sm font-medium flex-1">
                                Unassigned
                              </span>
                              {!formData.assigneeId && (
                                <Check size={16} className="text-emerald-500" />
                              )}
                            </div>

                            {users.map((user) => (
                              <div
                                key={user.id}
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    assigneeId: user.id.toString(),
                                  });
                                  setIsAssigneeOpen(false);
                                }}
                                className={cn(
                                  "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors",
                                  formData.assigneeId === user.id.toString()
                                    ? "bg-indigo-50 text-indigo-900"
                                    : "hover:bg-slate-50 text-slate-700",
                                )}
                              >
                                <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center border border-white shadow-sm text-xs font-bold text-indigo-600">
                                  {getInitials(user.name || user.email)}
                                </div>
                                <span className="text-sm font-medium flex-1 truncate">
                                  {user.name || user.email}
                                </span>
                                {formData.assigneeId === user.id.toString() && (
                                  <Check
                                    size={16}
                                    className="text-indigo-600"
                                  />
                                )}
                              </div>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
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
