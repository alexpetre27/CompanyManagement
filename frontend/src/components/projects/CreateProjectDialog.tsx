"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User } from "@/types/user";
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
import { Plus, Loader2, AlertTriangle } from "lucide-react";
import { getMembersAction, createProjectAction } from "@/lib/actions/project";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isAdmin: boolean;
}
export function CreateProjectDialog({
  isOpen,
  onOpenChange,
  isAdmin,
}: CreateProjectDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<User[]>([]);

  const initialFormState = {
    name: "",
    version: "v1.0.0",
    port: 3000,
    description: "",
    repoUrl: "",
    liveUrl: "",
    techStack: "",
    teamMembers: [] as string[],
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen && isAdmin) {
      setIsLoadingMembers(true);
      getMembersAction()
        .then((data) => setAvailableMembers(data || []))
        .catch(() => setAvailableMembers([]))
        .finally(() => setIsLoadingMembers(false));
    }
  }, [isOpen, isAdmin]);

  const toggleMember = (memberName: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberName)
        ? prev.teamMembers.filter((m) => m !== memberName)
        : [...prev.teamMembers, memberName],
    }));
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
          .filter(Boolean),
      };

      await createProjectAction(payload);

      setFormData(initialFormState);
      onOpenChange(false);
      router.refresh();
    } catch (e) {
      console.error("Failed to create:", e);
      alert("Eroare la crearea proiectului. Verifică consola.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-white rounded-2xl border-none shadow-2xl p-0 overflow-hidden outline-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
              Initialize a new microservice and assign the team.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Project Name</Label>
                <Input
                  className="h-9 text-xs"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Auth Service"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-bold">Version</Label>
                <Input
                  className="h-9 text-xs"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold">Description</Label>
              <Textarea
                className="min-h-17.5 text-xs resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Service purpose..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold">Port</Label>
                <Input
                  type="number"
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
              <div className="space-y-1">
                <Label className="text-xs font-bold">
                  Tech Stack (comma separated)
                </Label>
                <Input
                  className="h-9 text-xs"
                  value={formData.techStack}
                  onChange={(e) =>
                    setFormData({ ...formData, techStack: e.target.value })
                  }
                  placeholder="Java, Docker, Redis"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold">Team Members</Label>
              <div className="border border-slate-100 rounded-xl p-2 max-h-40 overflow-y-auto bg-slate-50/50 space-y-1">
                {isLoadingMembers ? (
                  <div className="flex flex-col items-center py-4 text-slate-400 gap-2">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span className="text-[10px]">Fetching team...</span>
                  </div>
                ) : availableMembers.length === 0 ? (
                  <div className="flex flex-col items-center py-4 text-slate-400 gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="text-[10px]">No members found</span>
                  </div>
                ) : (
                  availableMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-white border border-transparent hover:border-slate-200 cursor-pointer"
                      onClick={() => toggleMember(member.name)}
                    >
                      <Checkbox
                        checked={formData.teamMembers.includes(member.name)}
                        onCheckedChange={() => toggleMember(member.name)}
                      />
                      <div className="flex-1 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-700">
                          {member.name}
                        </span>
                        <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 pt-2 border-t border-slate-100 bg-slate-50/50">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-9 px-6"
              onClick={handleCreateProject}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Project"
              )}
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
