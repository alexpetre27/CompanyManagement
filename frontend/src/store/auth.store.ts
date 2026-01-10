import { create } from "zustand";

interface AuthState {
  token: string | null;
  username: string | null;
  role: string | null;
  login: (token: string, username: string, role?: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  username: null,
  role: null,
  login: (token, username, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role || "USER");
    set({ token, username, role: role || "USER" });
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    set({ token: null, username: null, role: null });
  },
}));
