"use server";

import { BACKEND_API_URL } from "@/lib/server/backend";

export async function registerAction(data: {
  username: string;
  email: string;
  password: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (res.ok) return { success: true, message: "Account created" };

    const body = await res.json().catch(() => null);
    return {
      success: false,
      message: body?.message || "Registration failed. Please try again.",
    };
  } catch {
    return { success: false, message: "Could not reach the server. Please try again." };
  }
}
