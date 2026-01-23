import { Microservice } from "@/types/microservice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function getMicroservices(): Promise<Microservice[]> {
  const isClient = typeof window !== "undefined";
  const token = isClient ? localStorage.getItem("token") : null;

  const res = await fetch(`${BASE_URL}/microservices`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    if (isClient) {
      window.location.href = "/login";
    }
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch services: ${res.statusText}`);
  }

  return res.json();
}
