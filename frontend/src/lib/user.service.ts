import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function getAuthHeaders(isMultipart = false) {
  const session = await getSession();

  if (!session || !session.accessToken) {
    throw new Error("Unauthorized: Please log in.");
  }

  const headers: HeadersInit = {
    Authorization: `Bearer ${session.accessToken}`,
  };

  if (!isMultipart) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function handleResponse(res: Response) {
  if (!res.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await res.json();
      errorMessage =
        errorData.message || errorData.error || JSON.stringify(errorData);
    } catch {
      errorMessage = (await res.text()) || res.statusText;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function getUsers() {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/users`, {
    method: "GET",
    headers: headers,
    cache: "no-store",
  });

  return handleResponse(res);
}

export async function updateUserProfile(data: {
  username: string;
  email: string;
}) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function updateUserPreferences(data: {
  notificationsEnabled?: boolean;
  themePreference?: string;
}) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/users/me/preferences`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function changeUserPassword(data: {
  oldPassword: string;
  newPassword: string;
}) {
  const headers = await getAuthHeaders();

  const res = await fetch(`${API_URL}/users/me/password`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(data),
  });

  return handleResponse(res);
}

export async function uploadUserAvatar(file: File) {
  const headers = await getAuthHeaders(true);

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_URL}/users/me/avatar`, {
    method: "POST",
    headers: headers,
    body: formData,
  });

  return handleResponse(res);
}
