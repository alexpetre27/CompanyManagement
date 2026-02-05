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
import { Plus, Github, Globe, Loader2, AlertTriangle } from "lucide-react";

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
    if (isOpen && isAdmin) {
      setIsLoadingMembers(true);
      fetch(`${apiUrl}/users`, {
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => (res.ok ? res.json() : []))
        .then((data: User[]) => setAvailableMembers(data))
        .catch(() => setAvailableMembers([]))
        .finally(() => setIsLoadingMembers(false));
    }
  }, [isOpen, isAdmin, apiUrl]);

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
        onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                  className="h-9 text-xs"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Auth Service"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-slate-700">
                  Version
                </Label>
                <Input
                  className="h-9 text-xs"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                  placeholder="v1.0.0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                Description
              </Label>
              <Textarea
                className="min-h-[80px] text-xs resize-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Describe..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">Port</Label>
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
                placeholder="8080"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-slate-700">
                Tech Stack
              </Label>
              <Input
                className="h-9 text-xs"
                value={formData.techStack}
                onChange={(e) =>
                  setFormData({ ...formData, techStack: e.target.value })
                }
                placeholder="Java, Docker..."
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
                    <span className="text-[10px]">Loading users...</span>
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
                        checked={formData.teamMembers.includes(member.name)}
                        className="border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                      <div className="flex-1 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white border border-slate-100 text-[9px] font-bold flex items-center justify-center text-slate-600">
                            {member.avatar || member.name.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-slate-700">
                            {member.name}
                          </span>
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
                  <Github size={12} /> Repo URL
                </Label>
                <Input
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
              onClick={() => onOpenChange(false)}
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
              )}{" "}
              Create Project
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
