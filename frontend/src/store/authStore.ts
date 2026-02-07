import { create } from "zustand";
import { LoginResponseDTO } from "@/types";

interface AuthState {
  user: Partial<LoginResponseDTO> | null;
  token: string | null;
  setAuth: (data: LoginResponseDTO) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,

  setAuth: (data) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", data.token);
    }

    set({
      token: data.token,
      user: {
        username: data.username,
        role: data.role,
        token: data.token,
      },
    });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ token: null, user: null });

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
}));
