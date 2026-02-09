"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
      <Card className="p-4 border-none shadow-sm rounded-[24px] bg-white transition-shadow duration-300 hover:shadow-md h-full flex flex-col">
        <div className="flex justify-between items-center mb-4 px-1">
          <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            TODAY'S TASKS
          </h2>
          <Button
            size="sm"
            onClick={() => setIsDialogOpen(true)}
            className="h-7 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded-lg text-[10px] font-bold px-3 gap-1 shadow-none"
          >
            <Plus size={12} /> Add Task
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-start">
          {tasks.length > 0 ? (
            tasks.map((task) => <TaskItemMini key={task.id} {...task} />)
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center h-32 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-xs font-medium">No tasks remaining</p>
              <p className="text-[10px]">Time to relax or add more work!</p>
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
