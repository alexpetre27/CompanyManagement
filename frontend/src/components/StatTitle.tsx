import React from "react";

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "indigo" | "purple" | "emerald" | "orange";
  trend: string;
}

export function StatTile({ icon, label, value, color, trend }: StatTileProps) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="group bg-white rounded-4xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start mb-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-full ${colors[color]}`}
        >
          {trend}
        </span>
      </div>
      <div>
        <div className="text-xl font-black text-slate-800 tracking-tight">
          {value}
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}
