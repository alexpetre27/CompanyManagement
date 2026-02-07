import { auth } from "@/auth";
import { Project } from "@/types/project";

export async function getProjects(): Promise<Project[]> {
  const session = await auth();

  if (!session?.accessToken) return [];

  const baseUrl = process.env.INTERNAL_API_URL || "http://localhost:8080/api";
  const endpoint = `${baseUrl}/projects/microservices`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Projects fetch error: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch projects", error);
    return [];
  }
}
