import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PageContainer } from "@/components/PageContainer";
import { Project } from "@/types/project";
import { ProjectsView } from "@/components/ProjectsView";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  const ADMIN_EMAIL = "petrealexandru1152@gmail.com";
  const isAdmin = session.user.email === ADMIN_EMAIL;

  let projects: Project[] = [];
  const apiUrl = process.env.INTERNAL_API_URL || "http://backend:8080/api";

  try {
    const res = await fetch(`${apiUrl}/projects/microservices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-User-Email": session.user.email || "",
      },
      next: { revalidate: 0 },
    });

    if (res.ok) {
      projects = await res.json();
    } else {
      console.error(`Error fetching projects: ${res.status}`);
    }
  } catch (error) {
    console.error("Backend connection failed. Is the Java server running?");
  }

  return (
    <PageContainer>
      <ProjectsView initialProjects={projects} isAdmin={isAdmin} />
    </PageContainer>
  );
}
