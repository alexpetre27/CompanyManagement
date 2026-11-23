import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { getProjectsServer } from "@/lib/server/data";

export default async function ProjectsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const isAdmin = session.user.role === "ADMIN";
  const projects = await getProjectsServer();

  return (
    <PageContainer>
      <ProjectsView initialProjects={projects} isAdmin={isAdmin} />
    </PageContainer>
  );
}
