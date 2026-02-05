import { ChevronRight } from "lucide-react";
import { Task } from "@/types/dashboard";

export function TaskItemMini({ title, projectName, isCompleted }: Task) {
  return (
    <div
      className="flex items-center gap-3 p-3 border
                  border-slate-50 rounded-2xl hover:border-indigo-100
                  hover:bg-slate-50/50 transition-all duration-200 
                   cursor-pointer group bg-white active:scale-[0.98]"
    >
      <div
        className={`w-1 h-8 rounded-full ${
          isCompleted ? "bg-green-500" : "bg-indigo-500"
        }`}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-[12px] font-bold truncate ${
            isCompleted ? "text-slate-400 line-through" : "text-slate-700"
          }`}
        >
          {title}
        </p>
        <p className="text-[10px] text-slate-400 truncate">{projectName}</p>
      </div>
      <ChevronRight
        size={14}
        className="text-slate-200 group-hover:text-indigo-300 transition-colors"
      />
    </div>
  );
}
