"use server";

import { revalidatePath } from "next/cache";
import { backendFetch, toActionResult } from "@/lib/server/backend";
import { getUsersServer } from "@/lib/server/data";
import type { CreateProjectPayload } from "@/types/project";

export async function getMembersAction() {
  return getUsersServer();
}

export async function createProjectAction(payload: CreateProjectPayload) {
  const result = await toActionResult(
    () =>
      backendFetch<{ id: number }>("/projects/create", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    "Project created",
  );
  if (result.success) {
    revalidatePath("/projects");
    revalidatePath("/");
  }
  return result;
}
