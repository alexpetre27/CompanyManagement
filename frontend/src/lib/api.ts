import { getSession } from "next-auth/react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const getMicroservices = async () => {
  const session = await getSession();
  const token = session?.accessToken;

  if (!token) {
    throw new Error("Unauthorized: No token found");
  }
  const res = await fetch(`${BASE_URL}/projects/microservices`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch services: ${res.statusText}`);
  }

  return res.json();
};
