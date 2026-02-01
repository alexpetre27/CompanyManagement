import { auth } from "@/auth";
import { Sidebar } from "@/components/Sidebar";
import { Briefcase, Users, Clock, TrendingUp } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { name, email, image } = session.user;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 px-10 py-8 max-w-7xl mx-auto">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Hello, {name || "User"}!
            </h1>
            <p className="text-slate-500 mt-1">
              Logged in as{" "}
              <span className="font-medium text-slate-700">{email}</span>. Here
              is an overview of your activity.
            </p>
          </div>
          {image && (
            <img
              src={image}
              alt={name || "User avatar"}
              className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
            />
          )}
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Kpi icon={<Briefcase />} label="Active Projects" value="12" />
          <Kpi icon={<Users />} label="Team Members" value="48" />
          <Kpi icon={<Clock />} label="Hours Worked" value="124h" />
          <Kpi icon={<TrendingUp />} label="Productivity" value="+14%" />
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
              {["v1.0", "v2.0", "v3.0"].map((v) => (
                <div
                  key={v}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      Project Management System {v}
                    </p>
                    <p className="text-xs text-slate-500">
                      Last updated: 2 hours ago
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white" />
                    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white text-white text-xs flex items-center justify-center">
                      +5
                    </div>
                  </div>
                </div>
              ))}
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
              <h3 className="font-semibold mb-4">Tasks Today</h3>
              <ul className="space-y-3">
                <li className="border-l-2 border-indigo-500 pl-3">
                  <p className="text-sm font-medium">Code Review</p>
                  <p className="text-xs text-slate-500">License Project</p>
                </li>
                <li className="border-l-2 border-indigo-500 pl-3">
                  <p className="text-sm font-medium">Deployment Setup</p>
                  <p className="text-xs text-slate-500">License Project</p>
                </li>
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
