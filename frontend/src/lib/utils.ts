import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import { ErrorResponse } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse;
    if (data?.message) return data.message;
    return error.message || "Eroare de conexiune la server.";
  }

  if (error instanceof Error) return error.message;
  return "A apărut o eroare neașteptată.";
}

export function getInitials(name: string | undefined) {
  if (!name) return "??";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
