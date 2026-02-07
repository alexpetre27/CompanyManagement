import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { getProjects } from "@/lib/project.service";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin =
    session.user.role === "ROLE_ADMIN" ||
    session.user.email === "petrealexandru1152@gmail.com";

  const projects = await getProjects();

  return (
    <PageContainer>
      <ProjectsView initialProjects={projects} isAdmin={isAdmin} />
    </PageContainer>
  );
}
