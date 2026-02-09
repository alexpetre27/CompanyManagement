import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export interface CreateTaskDTO {
  title: string;
  projectId: string;
  difficulty: "LOW" | "MEDIUM" | "HIGH";
}

export async function createTask(data: CreateTaskDTO) {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to create task");
  }

  return res.json();
}
