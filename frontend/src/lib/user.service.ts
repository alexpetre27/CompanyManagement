import { auth } from "@/auth";
import { User } from "@/types/user";

export async function getUsers(): Promise<User[]> {
  const session = await auth();

  if (!session?.accessToken) return [];

  const baseUrl = process.env.INTERNAL_API_URL || "http://localhost:8080/api";
  const endpoint = `${baseUrl}/users`;

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
      console.error(`Error fetching users: ${res.status} ${res.statusText}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch users", error);
    return [];
  }
}
