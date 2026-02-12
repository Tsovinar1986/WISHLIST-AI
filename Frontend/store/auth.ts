import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/api";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setAuth: (user: User, access: string, refresh: string) => void;
  clearAuth: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setAuth: (user, accessToken, refreshToken) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("access_token", accessToken);
          localStorage.setItem("refresh_token", refreshToken);
        }
        set({ user, accessToken, refreshToken });
      },
      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
        set({ user: null, accessToken: null, refreshToken: null });
      },
      hydrate: () => {
        if (typeof window === "undefined") return;
        const access = localStorage.getItem("access_token");
        const refresh = localStorage.getItem("refresh_token");
        const userStr = localStorage.getItem("auth_user");
        const user = userStr ? (JSON.parse(userStr) as User) : null;
        set({ accessToken: access, refreshToken: refresh, user });
      },
    }),
    {
      name: "auth",
      partialize: (s) => ({ user: s.user }),
    }
  )
);
