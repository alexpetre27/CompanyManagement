import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  FolderKanban,
} from "lucide-react";

interface Project {
  id: number;
  name: string;
  description: string;
  status: "ACTIVE" | "COMPLETED" | "ON_HOLD";
  updatedAt: string;
  teamCount: number;
}

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  let projects: Project[] = [];
  const apiUrl = process.env.INTERNAL_API_URL || "http://backend:8080/api";

  try {
    const res = await fetch(`${apiUrl}/demo/projects`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Email": session.user.email || "",
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      projects = await res.json();
    }
  } catch (error) {
    console.log("Backend offline, using mock data for projects.");
  }

  if (projects.length === 0) {
    projects = [
      {
        id: 1,
        name: "Website Redesign",
        description:
          "Revamping the corporate website with Next.js 14 and Tailwind.",
        status: "ACTIVE",
        updatedAt: "2 hours ago",
        teamCount: 4,
      },
      {
        id: 2,
        name: "Mobile App API",
        description:
          "Developing REST endpoints for the new mobile application.",
        status: "ON_HOLD",
        updatedAt: "1 day ago",
        teamCount: 2,
      },
      {
        id: 3,
        name: "Q1 Marketing Campaign",
        description: "Assets and planning for the upcoming social media push.",
        status: "COMPLETED",
        updatedAt: "1 week ago",
        teamCount: 6,
      },
      {
        id: 4,
        name: "Internal Dashboard",
        description: "Admin panel for managing users and permissions.",
        status: "ACTIVE",
        updatedAt: "3 days ago",
        teamCount: 3,
      },
    ];
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        <div>
          <h1 className="text-xl font-extrabold text-[#1a1f36] flex items-center gap-2">
            <FolderKanban className="text-[#6366f1]" size={24} /> Projects
          </h1>
          <p className="text-[12px] text-slate-400 font-medium">
            Manage and track your team's ongoing work.
          </p>
        </div>
        <Button className="bg-[#6366f1] hover:bg-[#4f46e5] text-white rounded-xl shadow-lg shadow-indigo-100 transition-all hover:scale-105 active:scale-95 text-xs font-bold h-9">
          <Plus size={16} className="mr-2" /> New Project
        </Button>
      </div>

      <div className="flex gap-2 items-center bg-white p-1 rounded-xl border border-slate-100 shadow-sm max-w-md">
        <div className="pl-2 text-slate-400">
          <Search size={16} />
        </div>
        <Input
          placeholder="Search projects..."
          className="border-none shadow-none focus-visible:ring-0 text-xs h-8"
        />
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-indigo-500"
        >
          <Filter size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </PageContainer>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const statusColors = {
    ACTIVE: "bg-blue-50 text-blue-600 border-blue-100",
    COMPLETED: "bg-green-50 text-green-600 border-green-100",
    ON_HOLD: "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <Card className="p-5 border-none shadow-sm rounded-[20px] bg-white transition-all duration-200 hover:shadow-md hover:-translate-y-1 group cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <span
          className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
            statusColors[project.status]
          }`}
        >
          {project.status.replace("_", " ")}
        </span>
        <button className="text-slate-300 hover:text-slate-600 transition-colors">
          <MoreVertical size={16} />
        </button>
      </div>

      <h3 className="text-sm font-bold text-[#1a1f36] mb-1 group-hover:text-[#6366f1] transition-colors">
        {project.name}
      </h3>
      <p className="text-[11px] text-slate-400 leading-relaxed mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Users size={14} />
          <span className="text-[11px] font-medium">
            {project.teamCount} members
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400">
          <Calendar size={14} />
          <span className="text-[11px] font-medium">{project.updatedAt}</span>
        </div>
      </div>
    </Card>
  );
}
