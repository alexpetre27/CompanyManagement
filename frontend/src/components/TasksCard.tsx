"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Coffee } from "lucide-react";
import { TaskItemMini } from "@/components/MiniTaskItem";
import { CreateTaskDialog } from "@/components/CreateTaskDialog";
import { Task } from "@/types/dashboard";
import { Project } from "@/types/project";

interface TasksCardProps {
  tasks: Task[];
  projects: Project[];
}

export function TasksCard({ tasks, projects }: TasksCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Card className="p-0 border-none bg-white rounded-[24px] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center">
              <Coffee size={14} className="text-indigo-500" />
            </div>
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Today’s Tasks
            </h2>
          </div>

          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="h-8 px-3 text-[10px] font-bold rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white gap-1 shadow-sm"
          >
            <Plus size={12} /> Add
          </Button>
        </div>

        <div className="p-4">
          {tasks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-50/60 rounded-xl p-2 hover:bg-slate-50 transition"
                >
                  <TaskItemMini {...task} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-[180px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3">
                <Coffee size={18} className="text-indigo-400" />
              </div>

              <p className="text-xs font-bold text-slate-700">
                You’re all clear ☕
              </p>
              <p className="text-[11px] text-slate-400 mb-4 max-w-[220px] text-center">
                No tasks scheduled for today. Enjoy the calm or add a new one.
              </p>

              <Button
                size="sm"
                onClick={() => setIsDialogOpen(true)}
                className="h-8 px-4 text-[10px] font-bold rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
              >
                + Create Task
              </Button>
            </div>
          )}
        </div>
      </Card>

      <CreateTaskDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        projects={projects}
      />
    </>
  );
}
