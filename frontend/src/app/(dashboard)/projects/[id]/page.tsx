import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  Github,
  Globe,
  Layers,
  MoreHorizontal,
} from "lucide-react";
import { Project } from "@/types/project";
import { TechStack } from "@/components/TechStack";
import { TeamList } from "@/components/TeamList";

async function getProjectData(
  id: string,
  token: string,
): Promise<Project | null> {
  const apiUrl = process.env.INTERNAL_API_URL || "http://localhost:8080/api";

  try {
    const res = await fetch(`${apiUrl}/projects/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user || !session.accessToken) {
    redirect("/login");
  }

  const project = await getProjectData(params.id, session.accessToken);

  if (!project) {
    return notFound();
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-blue-50 text-blue-600 border-blue-100",
      COMPLETED: "bg-green-50 text-green-600 border-green-100",
      ON_HOLD: "bg-orange-50 text-orange-600 border-orange-100",
    };
    return colors[status?.toUpperCase()] || "bg-slate-100 text-slate-500";
  };

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center gap-4 pt-2">
        <Link href="/projects">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-slate-100 text-slate-500"
          >
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-extrabold text-[#1a1f36]">
              {project.name}
            </h1>
            <span
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${getStatusColor(project.status)}`}
            >
              {project.status ? project.status.replace("_", " ") : "UNKNOWN"}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Version {project.version || "1.0.0"}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex gap-2 rounded-xl text-xs font-bold"
        >
          <MoreHorizontal size={16} /> Actions
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border-none shadow-sm rounded-[24px] bg-white">
            <h2 className="text-sm font-bold text-[#1a1f36] mb-3 flex items-center gap-2">
              <Layers size={16} className="text-[#6366f1]" /> Description
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {project.description || "No description provided."}
            </p>

            <TechStack technologies={project.techStack || []} />
          </Card>

          <Card className="p-6 border-none shadow-sm rounded-[24px] bg-white">
            <TeamList team={project.team || []} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 border-none shadow-sm rounded-[24px] bg-white space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Last Updated
              </p>
              <div className="flex items-center gap-2 mt-1 text-slate-700 font-medium text-sm">
                <Calendar size={16} className="text-slate-400" />{" "}
                {project.updatedAt || "N/A"}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-50 space-y-3">
              {project.repoUrl && (
                <Link href={project.repoUrl} target="_blank">
                  <Button className="w-full justify-start gap-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-10 text-xs font-bold mb-3">
                    <Github size={16} /> Repository
                  </Button>
                </Link>
              )}

              {project.liveUrl && (
                <Link href={project.liveUrl} target="_blank">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 rounded-xl h-10 text-xs font-bold border-slate-200 text-slate-600"
                  >
                    <Globe size={16} /> Live Preview
                  </Button>
                </Link>
              )}
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
