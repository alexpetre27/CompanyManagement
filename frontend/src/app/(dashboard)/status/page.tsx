import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Server,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  Globe,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";
import { PageContainer } from "@/components/PageContainer";

interface Service {
  id: string;
  name: string;
  type: string;
  status: "operational" | "degraded" | "offline";
  latency: string;
}

async function getSystemHealth(): Promise<Service[]> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  try {
    const res = await fetch(`${appUrl}/api/health`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

export default async function StatusPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user?.role !== "ADMIN") return notFound();
  const services = await getSystemHealth();

  const issues = services.filter(
    (s: Service) => s.status !== "operational",
  ).length;
  const dbService = services.find((s: Service) => s.type === "Database");
  const apiService = services.find((s: Service) => s.type === "Core Backend");

  return (
    <PageContainer className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex justify-between items-end pt-4">
        <div>
          <h1 className="text-3xl font-black text-[#1a1f36] flex items-center gap-3">
            System Status
            {issues === 0 ? (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase border border-emerald-100 flex items-center gap-1">
                <CheckCircle2 size={14} /> Operational
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase border border-rose-100 flex items-center gap-1">
                <AlertTriangle size={14} /> Critical Issues
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Live telemetry from Spring Boot Actuator.
          </p>
        </div>
        <form
          action={async () => {
            "use server";
            redirect("/status");
          }}
        >
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw size={14} /> Refresh
          </Button>
        </form>
      </div>

      {/* Quick Infrastructure Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend Status */}
        <Card className="p-6 rounded-[24px] border-none shadow-sm bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${apiService?.status === "operational" ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"}`}
            >
              <Server size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Spring Boot Core
              </p>
              <p className="text-lg font-black text-slate-800">
                {apiService?.status === "operational" ? "Online" : "Offline"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400">Latency</p>
            <p className="text-sm font-mono font-bold text-slate-700">
              {apiService?.latency || "-"}
            </p>
          </div>
        </Card>

        {/* Database Status */}
        <Card className="p-6 rounded-[24px] border-none shadow-sm bg-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${dbService?.status === "operational" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
            >
              <Database size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                PostgreSQL
              </p>
              <p className="text-lg font-black text-slate-800">
                {dbService?.status === "operational"
                  ? "Connected"
                  : "Disconnected"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400">Health</p>
            <p className="text-sm font-mono font-bold text-slate-700">100%</p>
          </div>
        </Card>
      </div>

      {/* Detailed List */}
      <Card className="border-none shadow-sm rounded-[24px] bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2 bg-slate-50/30">
          <Activity size={16} className="text-indigo-500" />
          <h3 className="text-sm font-bold text-slate-700 uppercase">
            Service Registry
          </h3>
        </div>
        <div className="divide-y divide-slate-50">
          {services.map((s: Service) => (
            <div
              key={s.id}
              className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {s.status === "operational" ? (
                  <div className="text-emerald-500">
                    <CheckCircle2 size={18} />
                  </div>
                ) : (
                  <div className="text-rose-500">
                    <XCircle size={18} />
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-800">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${s.status === "operational" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                >
                  {s.status}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 w-16 text-right">
                  {s.latency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageContainer>
  );
}
