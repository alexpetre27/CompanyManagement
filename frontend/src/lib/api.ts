import { Microservice } from "@/types/microservice";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const getMicroservices = async (): Promise<Microservice[]> => {
  if (typeof window === "undefined") return [];

  const token = localStorage.getItem("token");
  if (!token) throw new Error("UNAUTHORIZED");

  const res = await fetch(`${BASE_URL}/microservices`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 401 || res.status === 403) {
    window.location.href = "/login";
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) throw new Error(res.statusText);

  return res.json();
};
