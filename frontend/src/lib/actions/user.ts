"use server";

import { revalidatePath } from "next/cache";
import { backendFetch, toActionResult } from "@/lib/server/backend";
import type { BackendUser, ProjectRole } from "@/types/user";

export async function updateProfileAction(data: { username: string; email: string }) {
  const result = await toActionResult(
    () => backendFetch<BackendUser>("/users/me", { method: "PATCH", body: JSON.stringify(data) }),
    "Profile updated",
  );
  if (result.success) revalidatePath("/", "layout");
  return result;
}

export async function updatePreferencesAction(data: {
  notificationsEnabled?: boolean;
  themePreference?: string;
}) {
  return toActionResult(() =>
    backendFetch<BackendUser>("/users/me/preferences", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  );
}

export async function changePasswordAction(data: { oldPassword: string; newPassword: string }) {
  return toActionResult(
    () => backendFetch<{ message: string }>("/users/me/password", { method: "PATCH", body: JSON.stringify(data) }),
    "Password changed",
  );
}

export async function uploadAvatarAction(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { success: false as const, message: "Please choose an image." };
  }
  const body = new FormData();
  body.append("file", file);

  const result = await toActionResult(
    () => backendFetch<{ avatar: string }>("/users/me/avatar", { method: "POST", body }),
    "Avatar updated",
  );
  if (result.success) revalidatePath("/", "layout");
  return result;
}

export async function assignUserAction(userId: number, projectId: number, projectRole: ProjectRole) {
  const result = await toActionResult(
    () =>
      backendFetch<BackendUser>(`/users/${userId}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ projectId, projectRole }),
      }),
    "User assigned",
  );
  if (result.success) {
    revalidatePath("/users");
    revalidatePath("/projects");
  }
  return result;
}

export async function unassignUserAction(userId: number) {
  const result = await toActionResult(
    () => backendFetch<BackendUser>(`/users/${userId}/unassign`, { method: "PATCH" }),
    "User removed from project",
  );
  if (result.success) {
    revalidatePath("/users");
    revalidatePath("/projects");
  }
  return result;
}
