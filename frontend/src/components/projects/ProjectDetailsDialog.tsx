"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Users,
  Globe,
  Github,
  Layers,
  CheckCircle2,
  Clock,
  Activity,
  AlertCircle,
} from "lucide-react";

interface ProjectDetailsDialogProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectDetailsDialog({
  project,
  onClose,
}: ProjectDetailsDialogProps) {
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

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-white rounded-[32px] border-none shadow-2xl p-0 overflow-hidden outline-none">
        <AnimatePresence mode="wait">
          {project && (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col h-full"
            >
              <DialogHeader
                className={`p-8 pb-6 bg-linear-to-b ${getStatusDetails(project.status).bg}/30 to-white relative overflow-hidden`}
              >
                <div
                  className={`absolute -top-6 -right-6 opacity-10 rotate-12 ${getStatusDetails(project.status).color}`}
                >
                  {getStatusDetails(project.status).icon}
                </div>
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex gap-4 items-center">
                    <div
                      className={`p-3 rounded-2xl bg-white shadow-sm shadow-indigo-100/50 border border-slate-100 ${getStatusDetails(project.status).color}`}
                    >
                      {getStatusDetails(project.status).icon}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-black text-[#1a1f36] tracking-tight">
                        {project.name}
                      </DialogTitle>
                      <DialogDescription className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-3">
                        <span>v{project.version}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span>
                          Port:{" "}
                          <span className="font-mono text-slate-600">
                            {project.port}
                          </span>
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="uppercase text-[10px] font-bold tracking-wider">
                          {project.status.replace("_", " ")}
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
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase mb-4 flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Layers size={16} className="text-indigo-500" /> Tech
                      Stack
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {project.techStack?.map((tech) => (
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
                      {project.team?.map((member, i) => (
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
                {project.repoUrl && (
                  <a href={project.repoUrl} target="_blank" className="flex-1">
                    <Button className="w-full bg-slate-900 hover:bg-black text-white rounded-xl gap-2 text-xs font-bold h-11 shadow-md shadow-slate-200 hover:-translate-y-0.5 transition-transform">
                      <Github size={16} /> Repository
                    </Button>
                  </a>
                )}
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" className="flex-1">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2 text-xs font-bold h-11 shadow-md shadow-indigo-200 hover:-translate-y-0.5 transition-transform">
                      <Globe size={16} /> Live Preview
                    </Button>
                  </a>
                )}
                {!project.repoUrl && !project.liveUrl && (
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
  );
}
