import "server-only";
import { auth } from "@/auth";

/** Base URL of the Spring Boot API as seen from the Next.js server (never from the browser). */
export const BACKEND_API_URL =
  process.env.INTERNAL_API_URL || "http://localhost:8080/api";

export class BackendError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

export type ActionResult<T = undefined> =
  | { success: true; data: T; message?: string }
  | { success: false; message: string };

async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => "");
  try {
    const body = JSON.parse(text);
    if (body?.message) return String(body.message);
  } catch {
    /* not JSON */
  }
  return text || res.statusText || `Request failed (${res.status})`;
}

/**
 * Calls the backend with the current user's access token.
 * Throws BackendError for non-2xx responses and when there is no session.
 */
export async function backendFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const session = await auth();
  const token = session?.accessToken;
  if (!token) throw new BackendError("You are not signed in.", 401);

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (!res.ok) throw new BackendError(await readErrorMessage(res), res.status);
  if (res.status === 204) return undefined as T;

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

/** Like backendFetch, but returns null instead of throwing (for page data loaders). */
export async function backendFetchOrNull<T>(
  path: string,
  init: RequestInit = {},
): Promise<T | null> {
  try {
    return await backendFetch<T>(path, init);
  } catch (error) {
    if (!(error instanceof BackendError) || error.status >= 500) {
      console.error(`Backend request failed: ${path}`, error);
    }
    return null;
  }
}

/** Wraps a server action body so the client always gets a serialisable result instead of a thrown error. */
export async function toActionResult<T>(
  fn: () => Promise<T>,
  successMessage?: string,
): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await fn(), message: successMessage };
  } catch (error) {
    if (error instanceof BackendError) {
      return { success: false, message: error.message };
    }
    console.error("Server action failed", error);
    return { success: false, message: "Could not reach the server. Please try again." };
  }
}
