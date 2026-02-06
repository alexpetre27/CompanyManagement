import { auth } from "@/auth";
import { User } from "@/types/user";

export async function getUsers(): Promise<User[]> {
  const session = await auth();

  // Verificam daca userul e logat
  if (!session?.user?.email) return [];

  // Folosim URL-ul intern (docker) sau localhost
  const baseUrl = process.env.INTERNAL_API_URL || "http://localhost:8080/api";
  const endpoint = `${baseUrl}/users`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 👇 AICI ESTE FIX-UL: Trebuie sa spui backend-ului cine esti!
        "X-User-Email": session.user.email,
      },
      cache: "no-store", // Foarte bine: vrem date fresh, nu din cache
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
