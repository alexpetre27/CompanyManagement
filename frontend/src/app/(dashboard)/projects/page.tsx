import { auth } from "@/auth";
import api from "@/lib/api";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface Project {
  id: string;
  name: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  createdAt: string;
  userIds: string[];
}

export default async function ProjectsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  let projects: Project[] = [];
  try {
    const response = await api.get("/projects");
    projects = response.data;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Proiecte
          </h1>
          <p className="text-slate-500 font-medium">
            Gestionează și monitorizează progresul echipei tale.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
          <Plus size={20} />
          Proiect Nou
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row gap-4 justify-between bg-slate-50/50">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-4 top-3 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Caută proiect..."
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Filter size={16} />
              Filtre
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Informații Proiect
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Membri
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Creat la
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">
                  Acțiuni
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects.length > 0 ? (
                projects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {project.name}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                          project.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-600"
                            : project.status === "ON_HOLD"
                              ? "bg-orange-50 text-orange-600"
                              : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex -space-x-2">
                        {project.userIds.slice(0, 3).map((id) => (
                          <div
                            key={id}
                            className="w-8 h-8 rounded-full border-2 border-white bg-slate-200"
                          />
                        ))}
                        {project.userIds.length > 3 && (
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                            +{project.userIds.length - 3}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm font-medium text-slate-500">
                      {formatDate(project.createdAt)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                          <ExternalLink size={18} />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <Briefcase size={48} className="mb-4 opacity-20" />
                      <p className="font-bold">
                        Nu există proiecte disponibile
                      </p>
                      <p className="text-sm">
                        Începe prin a crea primul tău proiect.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
