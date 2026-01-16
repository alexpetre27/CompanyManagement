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
    <div className="space-y-8 animate-in fade-in duration-700">
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
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}
              >
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
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-900">
              Proiecte Recente
            </h3>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
              Vezi tot
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100 hover:border-slate-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-all">
                    <LayoutDashboard
                      className="text-slate-400 group-hover:text-white transition-colors"
                      size={20}
                    />
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
                  {[1, 2, 3, 4].map((u) => (
                    <div
                      key={u}
                      className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 shadow-sm"
                    />
                  ))}
                  <div className="w-9 h-9 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold shadow-sm">
                    +5
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Upgrade la Pro</h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Obține acces la rapoarte avansate și workspace-uri nelimitate.
              </p>
              <button className="bg-white text-indigo-600 font-bold py-3.5 px-6 rounded-2xl text-sm shadow-lg hover:bg-indigo-50 transition-all w-full active:scale-95">
                Vezi Oferta
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500 rounded-full opacity-30 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-4">Task-uri Azi</h3>
            <div className="space-y-4">
              {[1, 2].map((t) => (
                <div key={t} className="flex gap-3">
                  <div className="w-1 bg-indigo-600 rounded-full mt-1" />
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Review Code
                    </p>
                    <p className="text-xs text-slate-500">Proiect Licență</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
