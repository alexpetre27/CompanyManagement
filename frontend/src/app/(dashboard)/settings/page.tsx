import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/Settings"; // Asigura-te ca ai fisierul src/components/Settings.tsx

// Helper pentru a lua datele proaspete de la backend
async function getCurrentUser(token: string) {
  const apiUrl = process.env.INTERNAL_API_URL || "http://backend:8080/api";
  try {
    const res = await fetch(`${apiUrl}/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Nu cache-uim datele userului
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
  }
  return null;
}

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user || !session.accessToken) {
    redirect("/login");
  }

  // 1. Incercam sa luam datele actualizate din backend (inclusiv avatarul nou)
  const apiUser = await getCurrentUser(session.accessToken);

  // 2. Construim obiectul user combinand datele din sesiune cu cele din API
  const userData = {
    name: apiUser?.username || session.user.name || "User",
    email: apiUser?.email || session.user.email || "",
    role: apiUser?.role || session.user.role || "USER",
    avatar: apiUser?.avatar || session.user.image || null,
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="pt-2">
        <h1 className="text-xl font-extrabold text-[#1a1f36]">
          Account Settings
        </h1>
        <p className="text-[12px] text-slate-400 font-medium">
          Manage your profile and security preferences.
        </p>
      </div>

      {/* Randam componenta de client care contine formularul si logica de upload */}
      <SettingsView user={userData} />
    </div>
  );
}
