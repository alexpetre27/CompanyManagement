import { Check, Loader2 } from "lucide-react";
import type { Task } from "@/types/dashboard";

interface TaskItemMiniProps extends Task {
  onToggle?: () => void;
  pending?: boolean;
}

export function TaskItemMini({
  title,
  projectName,
  isCompleted,
  onToggle,
  pending,
}: TaskItemMiniProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={pending}
      aria-pressed={isCompleted}
      title={isCompleted ? "Mark as not done" : "Mark as done"}
      className="w-full text-left flex items-center gap-3 p-3 border
                  border-slate-50 rounded-2xl hover:border-indigo-100
                  hover:bg-slate-50/50 transition-all duration-200
                   cursor-pointer group bg-white active:scale-[0.98] disabled:opacity-60"
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
      <div
        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
          isCompleted
            ? "bg-green-500 border-green-500 text-white"
            : "border-slate-200 text-transparent group-hover:border-indigo-300"
        }`}
      >
        {pending ? (
          <Loader2 size={12} className="animate-spin text-slate-400" />
        ) : (
          <Check size={12} />
        )}
      </div>
    </button>
  );
}
