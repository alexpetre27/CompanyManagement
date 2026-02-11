import { auth } from "@/auth";
import { SessionUser } from "@/types/dashboard";
import { AdminStats } from "@/types/dashboard";

export async function getSystemStats(): Promise<AdminStats | null> {
  const session = await auth();
  const user = session?.user as SessionUser;

  if (user?.role !== "ADMIN") return null;

  const baseUrl = process.env.INTERNAL_API_URL || "http://backend:8080/api";

  try {
    const res = await fetch(`${baseUrl}/admin/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}
