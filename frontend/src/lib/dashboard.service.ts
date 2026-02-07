import { auth } from "@/auth";
import { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await auth();

  if (!session?.accessToken) {
    console.log("⚠️ No active session or token found.");
    return null;
  }

  const baseUrl = process.env.INTERNAL_API_URL || "http://localhost:8080/api";
  const endpoint = `${baseUrl}/dashboard/summary`;

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
      console.error(`Dashboard fetch error: ${res.status}`);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("🔥 Error fetching dashboard data:", error);
    return null;
  }
}
