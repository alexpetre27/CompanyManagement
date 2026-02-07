import { auth } from "@/auth"; // Folosit doar în Server Components
import { getSession } from "next-auth/react"; // Folosit în Client Components (Browser)
import { User } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// =========================================================
// 1. SERVER-SIDE: Obtine lista de useri (Admin Dashboard)
// =========================================================
export async function getUsers(): Promise<User[]> {
  const session = await auth();

  if (!session?.accessToken) return [];

  try {
    // Nota: Pe server (Docker container to Docker container), URL-ul poate fi diferit
    // Dar folosim BASE_URL pentru simplitate. Daca da eroare de conexiune,
    // trebuie folosit http://backend:8080/api
    const res = await fetch(`${BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch (error) {
    console.error("Failed to fetch users server-side", error);
    return [];
  }
}

// =========================================================
// 2. CLIENT-SIDE: Update Text Profil (Nume, Email)
// =========================================================
export async function updateUserProfile(data: {
  username: string;
  email: string;
}) {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token) throw new Error("Unauthorized: No token found");

  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Update Profile Error:", errorText);
    throw new Error("Failed to update profile");
  }

  return res.json();
}

// =========================================================
// 3. CLIENT-SIDE: Upload Avatar (Multipart File)
// =========================================================
export async function uploadUserAvatar(file: File) {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token) throw new Error("Unauthorized: No token found");

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${BASE_URL}/users/me/avatar`, {
    method: "POST",
    headers: {
      // NU punem Content-Type manual la FormData! Browserul il pune automat.
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Upload Avatar Error:", errorText);
    throw new Error("Failed to upload avatar");
  }

  return res.json();
}

// =========================================================
// 4. CLIENT-SIDE: Schimbare Parola
// =========================================================
export async function changeUserPassword(data: {
  oldPassword: string;
  newPassword: string;
}) {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token) throw new Error("Unauthorized: No token found");

  const res = await fetch(`${BASE_URL}/users/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    // Backend-ul poate returna 401 sau 400 (parola gresita)
    const errorData = await res.json().catch(() => null);
    console.error("Change Password Error:", errorData);
    throw new Error(
      errorData?.message ||
        "Failed to change password. Check current password.",
    );
  }
}

// =========================================================
// 5. CLIENT-SIDE: Actualizare Preferinte (Dark Mode, Notificari)
// =========================================================
export async function updateUserPreferences(data: {
  notificationsEnabled?: boolean;
  themePreference?: string;
}) {
  const session = await getSession();
  const token = session?.accessToken;

  // Debugging critic pentru eroarea 401
  console.log("Saving preferences. Token present?", !!token);

  if (!token) throw new Error("Unauthorized: No token found in session");

  const res = await fetch(`${BASE_URL}/users/me/preferences`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Preferences Error:", res.status, errorText);
    if (res.status === 401) {
      throw new Error("Session expired. Please login again.");
    }
    throw new Error("Failed to update preferences");
  }

  return res.json();
}
