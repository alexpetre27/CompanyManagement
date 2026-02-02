import { auth } from "@/auth";
import { DashboardData } from "@/types/dashboard";

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await auth();

  if (!session?.user?.email) {
    console.log("⚠️ No active session found.");
    return null;
  }

  const baseUrl = process.env.INTERNAL_API_URL || "http://localhost:8080/api";
  const endpoint = `${baseUrl}/dashboard/summary?email=${session.user.email}`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return await res.json();
  } catch (error) {
    console.error("🔥 Error fetching dashboard data:", error);
    return null;
  }
}
