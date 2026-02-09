import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { ShieldCheck, Users, Activity, Server, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/types/data";
import { ControlPanel } from "@/components/ControlPanel";
import { AuditTerminal } from "@/components/AuditTerminal";
import { User, AdminStatProps } from "@/types/user";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string }).role || "USER";
  if (role !== "ADMIN") return notFound();

  const { stats, recentUsers, logs } = await getAdminDashboardData();

  return (
    <div className="space-y-6 pb-10">
      <div className="relative rounded-[32px] overflow-hidden bg-white border border-slate-200 p-8 md:p-10 shadow-xl shadow-slate-200/50">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 opacity-60" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4 opacity-60" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-mono font-bold tracking-wider">
              <ShieldCheck size={14} /> ADMIN_ROOT_ACCESS
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">
              System Command Center
            </h1>
            <p className="text-slate-500 text-sm max-w-lg font-medium leading-relaxed">
              Real-time monitoring infrastructure, user management, and critical
              system controls.
            </p>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50">
            <div className="relative flex h-3 w-3">
              {stats.backendStatus === "Online" ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 shadow-[0_0_10px_#f43f5e]"></span>
              )}
            </div>
            <span
              className={`text-xs font-mono font-bold tracking-wide ${
                stats.backendStatus === "Online"
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {stats.backendStatus === "Online"
                ? "SYSTEM ONLINE"
                : "SYSTEM CRITICAL"}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AdminStat
          icon={<Users size={18} />}
          label="Total Users"
          value={stats.users}
          accent="text-blue-600 bg-blue-50"
        />
        <AdminStat
          icon={<Activity size={18} />}
          label="Active Projects"
          value={stats.projects}
          accent="text-purple-600 bg-purple-50"
        />
        <AdminStat
          icon={<Server size={18} />}
          label="API Status"
          value={stats.backendStatus}
          accent={
            stats.backendStatus === "Online"
              ? "text-emerald-600 bg-emerald-50"
              : "text-red-600 bg-red-50"
          }
        />
        <AdminStat
          icon={<Clock size={18} />}
          label="Server Time"
          value={new Date().toLocaleTimeString("ro-RO", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          accent="text-orange-600 bg-orange-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6">
          <Card className="bg-white border-none shadow-sm rounded-[24px] overflow-hidden h-full flex flex-col ring-1 ring-slate-100">
            <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Recent Users
              </h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/50 text-slate-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3 text-right">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((u: User) => (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-3.5 font-bold text-slate-700">
                          {u.email || u.name}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-400 text-[10px]">
                          {u.id}
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <span className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-indigo-100">
                            {u.role || "USER"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-8 text-center text-slate-400"
                      >
                        No users found in database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <ControlPanel />
        </div>

        <div className="lg:col-span-3">
          <AuditTerminal
            logs={
              logs as Array<{
                type: "INFO" | "SUCCESS" | "ERROR";
                msg: string;
                time: string;
              }>
            }
          />
        </div>
      </div>
    </div>
  );
}

function AdminStat({ label, value, icon, accent }: AdminStatProps) {
  return (
    <div className="bg-white p-5 rounded-[24px] shadow-sm border border-slate-100 flex justify-between items-center hover:shadow-md transition-all duration-200">
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-black text-slate-800 tracking-tight">
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-2xl ${accent}`}>{icon}</div>
    </div>
  );
}
