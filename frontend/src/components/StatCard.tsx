import { Card } from "@/components/ui/card";
import { StatCardProps } from "@/types/dashboard";

export function StatCard({ icon, label, value, trend, color }: StatCardProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-500",
    purple: "bg-purple-50 text-purple-500",
    green: "bg-green-50 text-green-500",
    orange: "bg-orange-50 text-orange-500",
  };

  return (
    <Card className="p-3 border-none shadow-none bg-transparent h-full flex flex-col justify-between">
      <div className="flex justify-between items-start mb-1">
        <div className={`p-2 rounded-xl ${colors[color]}`}>{icon}</div>
        <span className="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 py-0.5 rounded-md">
          {trend}
        </span>
      </div>
      <div className="px-1 mt-1">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
          {label}
        </p>
        <p className="text-lg font-black text-slate-800 tracking-tight leading-none mt-0.5">
          {value}
        </p>
      </div>
    </Card>
  );
}
