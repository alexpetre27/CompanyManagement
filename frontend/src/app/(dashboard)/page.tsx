import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  Zap,
  ChevronRight,
} from "lucide-react";
import { PageContainer, CardHover } from "@/components/PageContainer";
import { StatCard } from "@/components/StatCard";
import { ProjectRow } from "@/components/projects/RowProject";
import { TasksCard } from "@/components/TasksCard";
import { getDashboardData } from "@/lib/dashboard.service";
import { getProjectsServer } from "@/types/data";
export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const [dashboardData, projects] = await Promise.all([
    getDashboardData(),
    getProjectsServer(),
  ]);

  const data = dashboardData || {
    user: { name: session.user.name || "User", email: "", image: null },
    stats: {
      activeProjects: 0,
      teamMembers: 0,
      hoursWorked: 0,
      productivity: 0,
    },
    recentProjects: [],
    todayTasks: [],
  };

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
          className="bg-[#6366f1] hover:bg-indigo-600 text-white rounded-xl px-4 py-2 gap-2 shadow-lg shadow-indigo-100 transition-all duration-200 hover:scale-105 active:scale-95 font-bold text-xs h-9"
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
                data.recentProjects.map((project) => (
                  <ProjectRow key={project.id} {...project} />
                ))
              ) : (
                <p className="text-xs text-slate-400 p-2 text-center">
                  No active projects found.
                </p>
              )}
            </div>
          </Card>

          <TasksCard tasks={data.todayTasks} projects={projects} />
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

          <Card className="p-5 border-none shadow-sm rounded-[24px] bg-white min-h-45 transition-shadow duration-300 hover:shadow-md">
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
