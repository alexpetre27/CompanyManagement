import { auth } from "@/auth";

const API_URL = process.env.INTERNAL_API_URL || "http://backend:8080/api";

async function getServerToken() {
  const session = await auth();
  return session?.accessToken;
}

export async function getUsersServer() {
  const token = await getServerToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Server Error fetching users:", error);
    return [];
  }
}

export async function getProjectsServer() {
  const token = await getServerToken();
  if (!token) return [];

  try {
    const res = await fetch(`${API_URL}/projects/microservices`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Server Error fetching projects:", error);
    return [];
  }
}

export async function getProjectByIdServer(id: string) {
  const token = await getServerToken();
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error(`Server Error fetching project ${id}:`, error);
    return null;
  }
}
