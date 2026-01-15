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
    localStorage.setItem("token", data.token);
    set({
      token: data.token,
      user: {
        id: data.id,
        username: data.username,
        email: data.email,
        projectIds: data.projectIds,
      },
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null, user: null });
    window.location.href = "/login";
  },
}));
