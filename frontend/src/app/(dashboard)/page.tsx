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
  ShieldAlert,
  Server,
  Activity,
  UserPlus,
  Target,
  ArrowRight,
  Coffee,
} from "lucide-react";
import { PageContainer } from "@/components/PageContainer";
import { ProjectRow } from "@/components/projects/RowProject";
import { TasksCard } from "@/components/admin/TasksCard";
import { StatTile } from "@/components/projects/StatTitle";
import { SystemHealthCard } from "@/components/status/SystemHealthCard";
import { getDashboardData } from "@/lib/services/dashboard.service";
import { getSystemStats } from "@/lib/services/admin.service";
import { SystemEvent } from "@/types/dashboard";
import { getProjectsServer, getUsersServer } from "@/types/data";

interface SessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
  id?: string;
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as SessionUser;
  const isAdmin = user.role === "ADMIN";

  const [dashboardData, projects, users, adminStats] = await Promise.all([
    getDashboardData(),
    getProjectsServer(),
    getUsersServer(),
    isAdmin ? getSystemStats() : Promise.resolve(null),
  ]);

  const data = dashboardData || {
    user: { name: user.name || "User", email: "", image: null },
    stats: {
      activeProjects: 0,
      teamMembers: 0,
      hoursWorked: 0,
      productivity: 0,
    },
    recentProjects: [],
    todayTasks: [],
  };

  const firstName = data.user.name ? data.user.name.split(" ")[0] : "User";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const completedTasksCount =
    data.todayTasks?.filter((t) => t.isCompleted).length || 0;
  const nextPriorityTask = data.todayTasks?.find((t) => !t.isCompleted);

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
            {isAdmin
              ? "System overview and administrative controls."
              : "Let's make today productive."}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-slate-100">
          <CalendarDays size={16} className="text-indigo-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            {today}
          </span>
        </div>
      </header>

      {isAdmin && adminStats && (
        <div className="bg-slate-900 rounded-[32px] p-6 text-white shadow-xl shadow-slate-200/50">
          <div className="flex items-center gap-2 mb-6 opacity-80">
            <ShieldAlert size={18} className="text-emerald-400" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest">
              Admin Command Row
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AdminQuickStat
              label="Total Users"
              value={adminStats.totalUsers}
              sub={`+${adminStats.newUsersToday} today`}
              icon={<Users size={18} />}
            />
            <AdminQuickStat
              label="Server Load"
              value={adminStats.serverLoad}
              sub="Optimal range"
              icon={<Server size={18} />}
            />
            <AdminQuickStat
              label="Active Sessions"
              value={adminStats.activeSessions}
              sub="Currently online"
              icon={<Activity size={18} />}
            />
            <div className="bg-white/10 p-4 rounded-2xl border border-white/5 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2 text-rose-200">
                  <ShieldAlert size={18} />
                  <span className="text-xs font-bold uppercase">Alerts</span>
                </div>
                <p className="text-2xl font-black">{adminStats.errorCount}</p>
              </div>
              <Link
                href="/admin"
                className="px-3 py-1 bg-white text-slate-900 text-[10px] font-bold rounded-full hover:bg-slate-200 transition"
              >
                Console &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          icon={<Briefcase size={20} />}
          label="Active Projects"
          value={data.stats.activeProjects}
          color="indigo"
        />
        <StatTile
          icon={<Users size={20} />}
          label="Team Members"
          value={data.stats.teamMembers}
          color="purple"
        />
        <StatTile
          icon={<Clock size={20} />}
          label="Hours Tracked"
          value={`${data.stats.hoursWorked}h`}
          color="emerald"
        />
        <StatTile
          icon={<TrendingUp size={20} />}
          label="Productivity"
          value={`${data.stats.productivity}%`}
          color="orange"
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
              {data.recentProjects?.length > 0 ? (
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
                <div className="py-8 flex flex-col items-center justify-center text-slate-300 bg-slate-50/50 rounded-xl m-1 border border-dashed border-slate-100">
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

          <TasksCard
            tasks={data.todayTasks || []}
            projects={projects || []}
            users={users || []}
            currentUser={user}
          />

          {isAdmin && adminStats?.systemEvents && (
            <Card className="rounded-[24px] border-none shadow-sm bg-white p-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                System Activity Log
              </h3>
              <div className="space-y-4">
                {adminStats.systemEvents.map((event: SystemEvent) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${event.action.includes("Delete") || event.action.includes("Error") ? "bg-rose-400" : "bg-emerald-400"}`}
                      ></div>
                      <span className="font-bold text-slate-700">
                        {event.action}
                      </span>
                      <span className="text-slate-400 text-xs">
                        by {event.user}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {event.time}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <Card className="p-6 rounded-[24px] border-none shadow-lg shadow-indigo-100 bg-linear-to-br from-[#6366f1] to-[#8b5cf6] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider border border-white/10">
                  Daily Goal
                </span>
                <TrendingUp size={16} className="text-white/80" />
              </div>
              <h3 className="text-lg font-bold leading-tight mb-1">
                On track for today
              </h3>
              <p className="text-xs text-indigo-100 font-medium opacity-90 mb-4">
                You have completed{" "}
                <span className="text-white font-bold">
                  {completedTasksCount} tasks
                </span>
                .{" "}
                {data.stats.productivity === 100
                  ? "Perfect score!"
                  : "Keep going!"}
              </p>
              <div className="h-1.5 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm">
                <div
                  className="h-full bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000"
                  style={{ width: `${data.stats.productivity}%` }}
                />
              </div>
            </div>
          </Card>

          <SystemHealthCard />

          <Card className="p-5 rounded-[24px] border border-slate-100 shadow-sm bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {isAdmin ? "Quick Actions" : "Next Priority"}
              </h3>
              {!isAdmin && <Target className="text-indigo-500" size={16} />}
            </div>
            {isAdmin ? (
              <div className="grid grid-cols-2 gap-2">
                <QuickActionLink
                  href="/projects"
                  icon={<FolderOpen size={18} />}
                  label="New Project"
                  color="hover:text-indigo-600 hover:bg-indigo-50"
                />
                <QuickActionLink
                  href="/register"
                  icon={<UserPlus size={18} />}
                  label="Add User"
                  color="hover:text-emerald-600 hover:bg-emerald-50"
                />
              </div>
            ) : nextPriorityTask ? (
              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                    {nextPriorityTask.projectName}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                </div>
                <p className="font-bold text-slate-700 text-sm mb-3 line-clamp-2 leading-tight">
                  {nextPriorityTask.title}
                </p>
                <Link
                  href="/projects"
                  className="w-full flex items-center justify-center gap-1 bg-white text-indigo-600 text-[10px] font-bold py-2 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  Focus Now <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-2">
                  <Coffee size={18} className="text-emerald-500" />
                </div>
                <p className="text-xs font-bold text-slate-700">
                  All caught up!
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function AdminQuickStat({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/5">
      <div className="flex items-center gap-3 mb-2 text-indigo-200">
        {icon}
        <span className="text-xs font-bold uppercase">{label}</span>
      </div>
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[10px] text-slate-300">{sub}</p>
    </div>
  );
}

function QuickActionLink({
  href,
  icon,
  label,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 transition text-slate-600 ${color}`}
    >
      {icon}
      <span className="text-[10px] font-bold mt-1">{label}</span>
    </Link>
  );
}
