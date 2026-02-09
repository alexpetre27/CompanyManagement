"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";

const API_URL = process.env.INTERNAL_API_URL || "http://backend:8080/api";

export type ActionResponse = {
  success: boolean;
  message: string;
};

export type SessionWithRole = Session & {
  user: {
    role?: string;
  };
};

export async function adminAction(actionKey: string): Promise<ActionResponse> {
  const session = (await auth()) as SessionWithRole | null;
  const token = session?.accessToken;

  const role = session?.user?.role;

  if (!token || role !== "ADMIN") {
    return { success: false, message: "Unauthorized access." };
  }

  let endpoint = "";
  switch (actionKey) {
    case "restart":
      endpoint = "/admin/restart";
      break;
    case "flush":
      endpoint = "/admin/flush-cache";
      break;
    case "lock":
      endpoint = "/admin/lockdown";
      break;
    case "kill":
      endpoint = "/admin/shutdown";
      break;
    default:
      return { success: false, message: "Unknown command." };
  }

  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (actionKey === "kill") {
      return { success: true, message: "Shutdown signal sent successfully." };
    }

    if (!res.ok) {
      return { success: false, message: `Server error: ${res.status}` };
    }

    const data = await res.json();
    return { success: true, message: data.message || "Command executed." };
  } catch (error) {
    console.error("Admin Action Error:", error);
    return { success: false, message: "Failed to connect to backend." };
  }
}
