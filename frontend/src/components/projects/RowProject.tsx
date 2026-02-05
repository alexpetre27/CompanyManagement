import { LayoutGrid } from "lucide-react";
import { Project } from "@/types/project";

export function ProjectRow({ name, version, updatedAt, teamCount }: Project) {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-all duration-200 group cursor-pointer border border-transparent hover:border-slate-100 active:scale-[0.98]">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 group-hover:text-[#6366f1] transition-colors shadow-sm">
          <LayoutGrid size={16} />
        </div>
        <div>
          <h4 className="text-[13px] font-bold text-slate-700 leading-tight">
            {name}{" "}
            <span className="text-[10px] font-normal text-slate-400 ml-1">
              {version}
            </span>
          </h4>
          <p className="text-[10px] text-slate-400 mt-0.5">{updatedAt}</p>
        </div>
      </div>
      <div className="flex -space-x-1.5 items-center">
        {[...Array(Math.min(teamCount, 3))].map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 rounded-full border-2 border-white bg-slate-200"
          />
        ))}
        {teamCount > 3 && (
          <div className="w-6 h-6 rounded-full border-2 border-white bg-[#6366f1] text-[8px] text-white flex items-center justify-center font-bold">
            +{teamCount - 3}
          </div>
        )}
      </div>
    </div>
  );
}
