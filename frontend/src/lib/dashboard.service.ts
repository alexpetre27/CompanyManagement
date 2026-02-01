import { auth } from "@/auth";

export interface DashboardData {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  stats: {
    activeProjects: number;
    teamMembers: number;
    hoursWorked: number;
    productivity: number;
  };
  recentProjects: Array<{
    id: string;
    name: string;
    version: string;
    updatedAt: string;
    teamCount: number;
  }>;
  todayTasks: Array<{
    id: string;
    title: string;
    projectName: string;
    isCompleted: boolean;
  }>;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await auth();

  if (!session?.user?.email) return null;

  const apiUrl =
    process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(
      `${apiUrl}/dashboard/summary?email=${session.user.email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    if (!res.ok) {
      return null;
    }

    const backendData = await res.json();

    return {
      user: {
        name: session.user.name || "User",
        email: session.user.email,
        image: session.user.image || undefined,
      },
      stats: backendData.stats,
      recentProjects: backendData.recentProjects,
      todayTasks: backendData.todayTasks,
    };
  } catch (error) {
    return null;
  }
}
