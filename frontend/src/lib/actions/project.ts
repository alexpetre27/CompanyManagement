"use server";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { getUsersServer } from "@/types/data";

const API_URL = process.env.INTERNAL_API_URL || "http://backend:8080/api";

export async function getMembersAction() {
  return await getUsersServer();
}

export async function createProjectAction(payload: any) {
  const session = await auth();

  if (!session?.accessToken || !session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(`${API_URL}/projects/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.accessToken}`,
      "X-User-Email": session.user.email,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.text();
    throw new Error(errorData || "Failed to create project");
  }

  revalidatePath("/projects");
  return { success: true };
}

export async function unassignUserAction(userId: number) {
  const session = await auth();
  if (!session?.accessToken) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/users/${userId}/unassign`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to unassign");

  revalidatePath("/users");
  return { success: true };
}
