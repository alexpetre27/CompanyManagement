import { Card } from "@/components/ui/card";
import { checkSpringBootBackend } from "@/lib/health-check";

export async function SystemHealthCard() {
  const healthData = await checkSpringBootBackend();
  const backend = healthData.find((s) => s.id === "spring-backend");
  const isOnline = backend?.status === "operational";

  return (
    <Card className="p-4 rounded-[24px] border border-slate-100 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-slate-700 uppercase">
          System Status
        </h3>
        <div className="flex items-center gap-1.5">
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
            }`}
          />
          <span
            className={`text-[10px] font-bold ${
              isOnline ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isOnline ? "Operational" : "Critical"}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">API Latency</span>
          <span className="font-mono text-slate-700">
            {backend?.latency || "-"}
          </span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Uptime</span>
          <span className="font-mono text-slate-700">
            {backend?.uptime || "0%"}
          </span>
        </div>
      </div>
    </Card>
  );
}
