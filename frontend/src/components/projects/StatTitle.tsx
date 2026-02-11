import React from "react";

interface IconProps {
  size?: string | number;
  className?: string;
}

interface StatTileProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: "indigo" | "purple" | "emerald" | "orange";
  trend?: string;
}

export function StatTile({ icon, label, value, color, trend }: StatTileProps) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    purple: "bg-purple-50 text-purple-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="group bg-white rounded-[24px] p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full">
      <div className="flex justify-between items-start">
        <div
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${colors[color]}`}
        >
          {React.isValidElement<IconProps>(icon)
            ? React.cloneElement(icon, { size: 20 })
            : icon}
        </div>

        {trend && (
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-lg border border-current opacity-80 ${colors[color]}`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <div className="text-2xl font-black text-slate-800 tracking-tight leading-none">
          {value}
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
          {label}
        </div>
      </div>
    </div>
  );
}
