import { auth } from "@/auth";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const stats = [
    {
      label: "Proiecte Active",
      value: "12",
      icon: Briefcase,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Membri Echipa",
      value: "48",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Ore Lucrate",
      value: "124h",
      icon: Clock,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Productivitate",
      value: "+14%",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Salut, {session.user?.name || "Utilizator"}! 👋
        </h1>
        <p className="text-slate-500 font-medium">
          Iată o privire de ansamblu asupra activității proiectelor tale.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                <ArrowUpRight size={14} className="mr-1" />
                2.4%
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              Proiecte Recente
            </h3>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
              Vezi tot
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm">
                    <LayoutDashboard className="text-slate-400" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      Sistem Gestiune Proiecte v{i}.0
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      Ultima actualizare: acum 2 ore
                    </p>
                  </div>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((u) => (
                    <div
                      key={u}
                      className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-2">Upgrade la Pro</h3>
            <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
              Obține acces la rapoarte avansate și un număr nelimitat de
              utilizatori.
            </p>
            <button className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-2xl text-sm shadow-lg hover:bg-indigo-50 transition-colors">
              Află mai multe
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500 rounded-full opacity-50" />
        </div>
      </div>
    </div>
  );
}
