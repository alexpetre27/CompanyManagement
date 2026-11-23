"use server";

import { revalidatePath } from "next/cache";
import { backendFetch, toActionResult } from "@/lib/server/backend";
import type { DifficultyLevel } from "@/types/dashboard";

export interface CreateTaskInput {
  title: string;
  projectId: number;
  difficulty: DifficultyLevel;
  assigneeId?: number | null;
}

export async function createTaskAction(input: CreateTaskInput) {
  const result = await toActionResult(
    () => backendFetch<{ id: number }>("/tasks", { method: "POST", body: JSON.stringify(input) }),
    "Task created",
  );
  if (result.success) revalidatePath("/");
  return result;
}

export async function toggleTaskAction(taskId: string) {
  const result = await toActionResult(() =>
    backendFetch<{ id: number; isCompleted: boolean }>(`/tasks/${encodeURIComponent(taskId)}/toggle`, {
      method: "PATCH",
    }),
  );
  if (result.success) revalidatePath("/");
  return result;
}
