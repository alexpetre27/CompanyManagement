import { auth } from "@/auth";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  Zap,
  LayoutGrid,
  ChevronRight,
} from "lucide-react";
import { PageContainer, CardHover } from "@/components/PageContainer";
import { StatCardProps } from "@/types/dashboard";

interface Task {
  id: number;
  title: string;
  projectName: string;
  isCompleted: boolean;
}

interface Project {
  id: number;
  name: string;
  version: string;
  updatedAt: string;
  teamCount: number;
}

interface DashboardData {
  user: { name: string };
  stats: {
    activeProjects: number;
    teamMembers: number;
    hoursWorked: number;
    productivity: number;
  };
  recentProjects: Project[];
  todayTasks: Task[];
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-red-500 font-bold">Access Denied</p>
      </div>
    );
  }

  let data: DashboardData | null = null;
  const apiUrl = process.env.INTERNAL_API_URL || "http://backend:8080/api";

  try {
    const res = await fetch(`${apiUrl}/demo/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Email": session.user.email || "",
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error(error);
  }

  if (!data) {
    data = {
      user: { name: session.user.name || "User" },
      stats: {
        activeProjects: 12,
        teamMembers: 5,
        hoursWorked: 140,
        productivity: 85,
      },
      recentProjects: [],
      todayTasks: [
        {
          id: 1,
          title: "Review Java Backend",
          projectName: "Management App",
          isCompleted: false,
        },
        {
          id: 2,
          title: "Fix Docker Network",
          projectName: "DevOps",
          isCompleted: true,
        },
      ],
    };
  }

  return (
    <PageContainer className="space-y-4">
      <header className="flex justify-between items-center pt-2">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1f36]">
            Welcome back,{" "}
            {data.user.name ? data.user.name.split(" ")[0] : "User"}! 👋
          </h1>
          <p className="text-[12px] text-slate-400 font-medium">
            Here is an overview of your projects.
          </p>
        </div>
        <Button
          size="sm"
          className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl px-4 py-2 gap-2 shadow-lg shadow-indigo-100 transition-all duration-200 hover:scale-105 active:scale-95 font-bold text-xs h-9"
        >
          <Zap size={14} fill="currentColor" /> Boost Active
        </Button>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <CardHover>
          <StatCard
            icon={<Briefcase size={16} />}
            label="ACTIVE"
            value={data.stats.activeProjects}
            trend="2.4%"
            color="blue"
          />
        </CardHover>
        <CardHover>
          <StatCard
            icon={<Users size={16} />}
            label="TEAM"
            value={data.stats.teamMembers}
            trend="5.1%"
            color="purple"
          />
        </CardHover>
        <CardHover>
          <StatCard
            icon={<Clock size={16} />}
            label="HOURS"
            value={`${data.stats.hoursWorked}h`}
            trend="12%"
            color="green"
          />
        </CardHover>
        <CardHover>
          <StatCard
            icon={<TrendingUp size={16} />}
            label="PROD."
            value={`+${data.stats.productivity}%`}
            trend="8.2%"
            color="orange"
          />
        </CardHover>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 space-y-4">
          <Card className="p-4 border-none shadow-sm rounded-[24px] bg-white transition-shadow duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-3 px-1">
              <h2 className="text-sm font-bold text-[#1a1f36]">
                Recent Projects
              </h2>
              <Link
                href="/projects"
                className="text-[11px] font-bold text-[#6366f1] hover:underline transition-all active:scale-95 cursor-pointer"
              >
                View All
              </Link>
            </div>
            <div className="space-y-2">
              {data.recentProjects.length > 0 ? (
                data.recentProjects.map((project: Project) => (
                  <ProjectRow
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    version={project.version}
                    updatedAt={project.updatedAt}
                    teamCount={project.teamCount}
                  />
                ))
              ) : (
                <p className="text-xs text-slate-400 p-2 text-center">
                  No active projects found.
                </p>
              )}
            </div>
          </Card>

          <Card className="p-4 border-none shadow-sm rounded-[24px] bg-white transition-shadow duration-300 hover:shadow-md">
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
              TODAY'S TASKS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.todayTasks.map((task: Task) => (
                <TaskItemMini
                  key={task.id}
                  label={task.title}
                  sub={task.projectName}
                  isCompleted={task.isCompleted}
                />
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-4">
          <Card className="p-5 bg-[#6366f1] text-white border-none shadow-xl rounded-[28px] relative overflow-hidden group transition-transform duration-300 hover:-translate-y-1">
            <div className="relative z-10">
              <h3 className="text-base font-bold mb-1">Upgrade to Pro</h3>
              <p className="text-[11px] text-indigo-100 mb-4 font-medium leading-tight">
                Get access to advanced reports and unlimited workspaces.
              </p>
              <Button
                size="sm"
                className="w-full bg-white text-[#6366f1] hover:bg-white/90 font-bold rounded-xl h-9 shadow-md text-xs transition-transform duration-200 active:scale-95"
              >
                View Offer
              </Button>
            </div>
            <div className="absolute -bottom-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150" />
          </Card>

          <Card className="p-5 border-none shadow-sm rounded-[24px] bg-white min-h-[180px] transition-shadow duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase">
                ACTIVITY
              </span>
              <ChevronRight size={14} className="text-slate-300" />
            </div>
            <div className="flex items-center gap-2 px-1 py-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-slate-600">
                System is stable
              </span>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function StatCard({ icon, label, value, trend, color }: StatCardProps) {
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

function ProjectRow({ name, version, updatedAt, teamCount }: Project) {
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

interface TaskItemMiniProps {
  label: string;
  sub: string;
  isCompleted: boolean;
}

function TaskItemMini({ label, sub, isCompleted }: TaskItemMiniProps) {
  return (
    <div className="flex items-center gap-3 p-3 border border-slate-50 rounded-2xl hover:border-indigo-100 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer group bg-white active:scale-[0.98]">
      <div
        className={`w-1 h-8 rounded-full ${
          isCompleted ? "bg-green-500" : "bg-indigo-500"
        }`}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-[12px] font-bold truncate ${
            isCompleted ? "text-slate-400 line-through" : "text-slate-700"
          }`}
        >
          {label}
        </p>
        <p className="text-[10px] text-slate-400 truncate">{sub}</p>
      </div>
      <ChevronRight
        size={14}
        className="text-slate-200 group-hover:text-indigo-300 transition-colors"
      />
    </div>
  );
}
