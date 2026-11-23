import "server-only";
import { BACKEND_API_URL, backendFetchOrNull } from "@/lib/server/backend";

/** Public flag; false if the backend cannot be reached (the status page covers that case). */
export async function getMaintenanceMode(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/system/status`, {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    return Boolean((await res.json())?.maintenance);
  } catch {
    return false;
  }
}
import { checkSpringBootBackend } from "@/lib/health-check";
import type { User, BackendUser } from "@/types/user";
import type { Project } from "@/types/project";
import type { AdminStats, DashboardData, Log } from "@/types/dashboard";

export function toUser(u: BackendUser): User {
  return {
    id: u.id,
    name: u.username,
    email: u.email,
    role: u.role,
    avatar: u.avatar ?? undefined,
    projectId: u.projectId ?? null,
    project: u.projectName ?? "",
    projectRole: u.projectRole ?? null,
    notificationsEnabled: u.notificationsEnabled ?? true,
    themePreference: u.themePreference ?? "LIGHT",
  };
}

export async function getUsersServer(): Promise<User[]> {
  const users = await backendFetchOrNull<BackendUser[]>("/users");
  return (users ?? []).map(toUser);
}

export async function getCurrentUserServer(): Promise<User | null> {
  const user = await backendFetchOrNull<BackendUser>("/users/me");
  return user ? toUser(user) : null;
}

export async function getProjectsServer(): Promise<Project[]> {
  return (await backendFetchOrNull<Project[]>("/projects/microservices")) ?? [];
}

export async function getProjectServer(id: string): Promise<Project | null> {
  if (!/^\d+$/.test(id)) return null;
  return backendFetchOrNull<Project>(`/projects/${id}`);
}

export async function getDashboardData(): Promise<DashboardData | null> {
  return backendFetchOrNull<DashboardData>("/dashboard/summary");
}

export async function getSystemStats(): Promise<AdminStats | null> {
  return backendFetchOrNull<AdminStats>("/admin/stats");
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

  const formattedTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

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
      type: backendStatus === "Online" ? ("SUCCESS" as const) : ("ERROR" as const),
      msg: `System Health Check: ${backendStatus}`,
      time: formattedTime,
    },
  ];

  return {
    stats: {
      users: users.length,
      projects: projects.length,
      backendStatus,
    },
    recentUsers: users.slice(0, 5),
    logs,
    serverTime: formattedTime,
  };
}
