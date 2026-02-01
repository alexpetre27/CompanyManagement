import { Sidebar } from "@/components/Sidebar";
import { getDashboardData } from "@/lib/dashboard.service";
import { auth } from "@/auth";
import {
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const user = session?.user;

  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 px-10 py-8 max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-900">
            Backend Unreachable
          </h1>
          <p className="text-slate-500 mt-2">
            Logged in as {user?.email}, but unable to connect to the backend
            server.
          </p>
          <p className="text-sm text-slate-400 mt-4 bg-slate-200 p-2 rounded">
            Please check if the backend container is running and
            INTERNAL_API_URL is correct.
          </p>
        </main>
      </div>
    );
  }

  const { stats, recentProjects, todayTasks } = data;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 px-10 py-8 max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Hello, {user?.name || "User"}! 👋
            </h1>
            <p className="text-slate-500 mt-1">
              Logged in as{" "}
              <span className="font-medium text-slate-700">{user?.email}</span>.
              Here is your activity overview.
            </p>
          </div>
          {user?.image && (
            <img
              src={user.image}
              alt={user.name || "User"}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
          )}
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Kpi
            icon={<Briefcase />}
            label="Active Projects"
            value={stats.activeProjects.toString()}
          />
          <Kpi
            icon={<Users />}
            label="Team Members"
            value={stats.teamMembers.toString()}
          />
          <Kpi
            icon={<Clock />}
            label="Hours Worked"
            value={`${stats.hoursWorked}h`}
          />
          <Kpi
            icon={<TrendingUp />}
            label="Productivity"
            value={`+${stats.productivity}%`}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Recent Projects</h2>
              <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700 transition">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {recentProjects.map((project) => (
                <div
                  key={project.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {project.name} {project.version}
                    </p>
                    <p className="text-xs text-slate-500">
                      Last updated: {project.updatedAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                      <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center font-medium">
                      +{project.teamCount}
                    </div>
                  </div>
                </div>
              ))}
              {recentProjects.length === 0 && (
                <p className="text-sm text-slate-400 py-4 text-center">
                  No active projects found.
                </p>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-md">
              <h3 className="font-semibold text-lg mb-2">Upgrade to Pro</h3>
              <p className="text-sm opacity-90 mb-4">
                Get access to advanced reports and unlimited workspaces.
              </p>
              <button className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-xl hover:bg-indigo-50 transition">
                View Offer
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Tasks Today</h3>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                  {todayTasks.length} pending
                </span>
              </div>

              <ul className="space-y-3">
                {todayTasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition"
                  >
                    <div className="mt-1 text-indigo-500">
                      {task.isCompleted ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <Circle size={16} />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          task.isCompleted
                            ? "line-through text-slate-400"
                            : "text-slate-900"
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {task.projectName}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

interface KpiProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function Kpi({ icon, label, value }: KpiProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition">
      <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
