import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  FolderOpen,
  CalendarDays,
  ArrowUpRight,
} from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { ProjectRow } from "@/components/projects/RowProject";
import { TasksCard } from "@/components/TasksCard";
import { getDashboardData } from "@/lib/dashboard.service";
import { getProjectsServer } from "@/types/data";
import { StatTile } from "@/components/StatTitle";
export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) redirect("/login");

  const [dashboardData, projects] = await Promise.all([
    getDashboardData(),
    getProjectsServer(),
  ]);

  const data = dashboardData || {
    user: { name: session.user.name || "User" },
    stats: {
      activeProjects: 0,
      teamMembers: 0,
      hoursWorked: 0,
      productivity: 0,
    },
    recentProjects: [],
    todayTasks: [],
  };

  const firstName = data.user.name.split(" ")[0];
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <PageContainer className="space-y-8 pb-10">
      <header className="flex items-center justify-between pt-4 pb-2">
        <div>
          <h1 className="text-3xl font-black text-[#1a1f36] tracking-tight">
            Hello,{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-violet-600">
              {firstName}
            </span>
            !
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Let's make today productive.
          </p>
        </div>

        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
          <CalendarDays size={16} className="text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {today}
          </span>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          icon={<Briefcase size={20} />}
          label="Active Projects"
          value={data.stats.activeProjects}
          color="indigo"
          trend="+2.5%"
        />
        <StatTile
          icon={<Users size={20} />}
          label="Team Members"
          value={data.stats.teamMembers}
          color="purple"
          trend="+1 new"
        />
        <StatTile
          icon={<Clock size={20} />}
          label="Hours Tracked"
          value={`${data.stats.hoursWorked}h`}
          color="emerald"
          trend="12% more"
        />
        <StatTile
          icon={<TrendingUp size={20} />}
          label="Productivity"
          value={`${data.stats.productivity}%`}
          color="orange"
          trend="+5.4%"
        />
      </div>

      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <Card className="rounded-[24px] border-none shadow-sm bg-white overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
              <div className="flex items-center gap-2">
                <FolderOpen size={16} className="text-indigo-600" />
                <h2 className="text-sm font-bold text-[#1a1f36]">
                  Recent Projects
                </h2>
              </div>
              <Link
                href="/projects"
                className="text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                View All <ArrowUpRight size={12} />
              </Link>
            </div>

            <div className="p-2">
              {data.recentProjects.length > 0 ? (
                <div className="space-y-1">
                  {data.recentProjects.map((p) => (
                    <div
                      key={p.id}
                      className="hover:bg-slate-50 rounded-xl transition-colors px-2 py-1"
                    >
                      <ProjectRow {...p} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center text-slate-300 bg-slate-50/30 rounded-xl m-1 border border-dashed border-slate-100">
                  <span className="text-xs font-medium mb-1">
                    No recent projects
                  </span>
                  <Link
                    href="/projects"
                    className="text-[10px] font-bold text-indigo-500 hover:underline"
                  >
                    + Create Project
                  </Link>
                </div>
              )}
            </div>
          </Card>

          <TasksCard tasks={data.todayTasks} projects={projects} />
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6 rounded-[24px] border-none shadow-lg shadow-indigo-100 bg-linear-to-br from-[#6366f1] to-[#8b5cf6] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/10">
                  Status
                </span>
                <TrendingUp size={16} className="text-white/80" />
              </div>

              <h3 className="text-lg font-bold leading-tight mb-1">
                On track for today
              </h3>
              <p className="text-xs text-indigo-100 font-medium opacity-90 mb-4">
                You have completed{" "}
                <span className="text-white font-bold">3 tasks</span>. Keep
                going!
              </p>

              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div className="h-full w-3/4 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
              </div>
            </div>
          </Card>

          <Card className="p-4 rounded-4xl border border-slate-100 shadow-sm bg-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase">
                System Status
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-600">
                  Stable
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Database</span>
                <span className="font-mono text-slate-700">99.9%</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">API</span>
                <span className="font-mono text-slate-700">14ms</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
