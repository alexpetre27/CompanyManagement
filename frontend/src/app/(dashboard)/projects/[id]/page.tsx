import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Calendar, Github, Globe, Layers } from "lucide-react";
import { TechStack } from "@/components/projects/TechStack";
import { TeamList } from "@/components/projects/TeamList";
import { getProjectServer } from "@/lib/server/data";

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-blue-50 text-blue-600 border-blue-100",
  COMPLETED: "bg-green-50 text-green-600 border-green-100",
  ON_HOLD: "bg-orange-50 text-orange-600 border-orange-100",
};

/** Only allow http(s) links; anything else (e.g. javascript:) is dropped. */
function safeExternalUrl(url?: string | null): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();
  if (!session?.user) redirect("/login");

  const project = await getProjectServer(id);
  if (!project) notFound();

  const status = (project.status || "UNKNOWN").toUpperCase();
  const repoUrl = safeExternalUrl(project.repoUrl);
  const liveUrl = safeExternalUrl(project.liveUrl);
  const isAdmin = session.user.role === "ADMIN";

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center gap-4 pt-2">
        <Link href="/projects">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl hover:bg-slate-100 text-slate-500"
            aria-label="Back to projects"
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
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${STATUS_COLORS[status] || "bg-slate-100 text-slate-500"}`}
            >
              {status.replace("_", " ")}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Version {project.version || "1.0.0"}
          </p>
        </div>
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
            <TeamList team={project.team || []} manageHref={isAdmin ? "/users" : undefined} />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-5 border-none shadow-sm rounded-[24px] bg-white space-y-4">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase">
                Details
              </p>
              <div className="space-y-3 mt-3">
                <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-xs text-slate-500">Updated:</span>
                  {project.updatedAt || "N/A"}
                </div>
                {project.port != null && (
                  <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                    <span className="text-xs text-slate-500">Port:</span>
                    <code className="bg-slate-100 px-1 rounded text-indigo-600">
                      {project.port}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {(repoUrl || liveUrl) && (
              <div className="pt-4 border-t border-slate-50 space-y-3">
                {repoUrl && (
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button className="w-full justify-start gap-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-10 text-xs font-bold">
                      <Github size={16} /> Repository
                    </Button>
                  </a>
                )}
                {liveUrl && (
                  <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 rounded-xl h-10 text-xs font-bold border-slate-200 text-slate-600"
                    >
                      <Globe size={16} /> Live Preview
                    </Button>
                  </a>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
