import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Server,
  Database,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { AutoRefresh } from "@/components/AutoRefresh";
import Service from "@/types/service";

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
  const dbHealth = dbService?.status === "operational" ? 100 : 0;

  return (
    <PageContainer className="pb-10">
      <AutoRefresh intervalMs={5000} />

      <div className="flex flex-col gap-8 pt-4 w-full">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-3xl font-black text-[#1a1f36] flex items-center gap-3">
              System Status
              {issues === 0 ? (
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase border border-emerald-100">
                  Operational
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-[10px] font-bold uppercase border border-rose-100">
                  Issues
                </span>
              )}
            </h1>
          </div>

          <form
            action={async () => {
              "use server";
              redirect("/status");
            }}
          >
            <Button variant="outline" size="sm" className="rounded-xl px-4">
              <RefreshCw size={14} className="mr-2" /> Refresh
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full">
          <Card className="p-4 md:p-6 rounded-[24px] border-none shadow-sm bg-white flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl ${apiService?.status === "operational" ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"}`}
              >
                <Server size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Core Backend
                </p>
                <p className="text-xl font-black text-slate-800">
                  {apiService?.status === "operational" ? "Online" : "Offline"}
                </p>
              </div>
            </div>
            <div className="w-full lg:w-32 rounded-2xl border border-indigo-100/80 bg-slate-50/30 p-3">
              <p className="text-[10px] font-bold text-indigo-400 uppercase">
                Latency
              </p>
              <p className="text-lg font-mono font-black text-indigo-700 leading-none">
                {apiService?.latency || "0ms"}
              </p>
              <div className="mt-2 h-1 w-full bg-indigo-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 w-[85%]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 md:p-6 rounded-[24px] border-none shadow-sm bg-white flex flex-col lg:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`p-4 rounded-2xl ${dbService?.status === "operational" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
              >
                <Database size={28} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Database
                </p>
                <p className="text-xl font-black text-slate-800">
                  {dbService?.status === "operational"
                    ? "Connected"
                    : "Disconnected"}
                </p>
              </div>
            </div>
            <div className="w-full lg:w-32 rounded-2xl border border-emerald-100/80 bg-slate-50/30 p-3">
              <p className="text-[10px] font-bold text-emerald-500 uppercase">
                Health
              </p>
              <p className="text-lg font-mono font-black text-emerald-700 leading-none">
                {dbHealth}%
              </p>
              <div className="mt-2 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500"
                  style={{ width: `${dbHealth}%` }}
                />
              </div>
            </div>
          </Card>
        </div>

        <Card className="w-full border-none shadow-sm rounded-[24px] bg-white overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
            <Activity size={16} className="text-indigo-500" />
            <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">
              Registry
            </h3>
          </div>
          <div className="divide-y divide-slate-50">
            {services.map((s: Service) => (
              <div
                key={s.id}
                className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-4">
                  {s.status === "operational" ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <XCircle size={18} className="text-rose-500" />
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-800">{s.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {s.type}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${s.status === "operational" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
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
      </div>
    </PageContainer>
  );
}
