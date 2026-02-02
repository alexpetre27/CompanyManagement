import { auth } from "@/auth";
import { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const session = await auth();

  if (!session?.user?.email) return [];

  const baseUrl = process.env.INTERNAL_API_URL || "http://localhost:8080/api";
  const endpoint = `${baseUrl}/projects/microservices`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch projects/microservices", error);
    return [];
  }
}
