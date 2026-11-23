"use server";

import { auth } from "@/auth";
import { backendFetch, toActionResult } from "@/lib/server/backend";

const ENDPOINTS = {
  restart: "/admin/restart",
  flush: "/admin/flush-cache",
  lock: "/admin/lockdown",
  kill: "/admin/shutdown",
} as const;

export type AdminActionKey = keyof typeof ENDPOINTS;

export async function adminAction(actionKey: AdminActionKey) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return { success: false as const, message: "Unauthorized access." };
  }

  const endpoint = ENDPOINTS[actionKey];
  if (!endpoint) return { success: false as const, message: "Unknown command." };

  const result = await toActionResult(() =>
    backendFetch<{ message?: string }>(endpoint, { method: "POST" }),
  );
  if (!result.success) return result;
  return {
    success: true as const,
    data: undefined,
    message: result.data?.message || "Command executed.",
  };
}
