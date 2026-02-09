import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import axios, { AxiosError } from "axios";

interface BackendError {
  message: string;
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function getErrorMessage(
  error: Error | AxiosError | string | null,
): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as BackendError;
    return data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return "An unknown error occurred";
}

export function formatDate(date: string): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("ro-RO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}
