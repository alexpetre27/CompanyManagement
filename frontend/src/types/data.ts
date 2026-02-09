import { auth } from "@/auth";
import { checkSpringBootBackend } from "@/lib/health-check";
import { User } from "@/types/user";
import { Project } from "@/types/project";

const API_URL = process.env.INTERNAL_API_URL || "http://backend:8080/api";

export interface Log {
  type: "INFO" | "SUCCESS" | "ERROR";
  msg: string;
  time: string;
}

async function getServerToken() {
  const session = await auth();
  return session?.accessToken;
}

export async function getUsersServer(): Promise<User[]> {
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
    return (await res.json()) as User[];
  } catch (error) {
    console.error("Server Error fetching users:", error);
    return [];
  }
}

export async function getProjectsServer(): Promise<Project[]> {
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
    return (await res.json()) as Project[];
  } catch (error) {
    console.error("Server Error fetching projects:", error);
    return [];
  }
}

export async function getAdminDashboardData() {
  const [users, projects, health] = await Promise.all([
    getUsersServer(),
    getProjectsServer(),
    checkSpringBootBackend(),
  ]);

  const backendService = health.find((s) => s.id === "spring-backend");
  const backendStatus =
    backendService?.status === "operational" ? "Online" : "Offline";

  const recentUsers = users.slice(0, 5);

  const logs: Log[] = [
    ...users.slice(0, 3).map((u) => ({
      type: "INFO" as const,
      msg: `User registered: ${u.email || u.name || "Unknown"}`,
      time: "Recent",
    })),
    ...projects.slice(0, 3).map((p) => ({
      type: "SUCCESS" as const,
      msg: `Project active: ${p.name}`,
      time: "Active",
    })),
    {
      type:
        backendStatus === "Online" ? ("SUCCESS" as const) : ("ERROR" as const),
      msg: `System Health Check: ${backendStatus}`,
      time: new Date().toLocaleTimeString("ro-RO"),
    },
  ];

  return {
    stats: {
      users: users.length,
      projects: projects.length,
      backendStatus,
    },
    recentUsers,
    logs,
  };
}
