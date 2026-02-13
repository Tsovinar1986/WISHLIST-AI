"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const TOKEN_KEY = "wishlist_token";
const REFRESH_KEY = "wishlist_refresh";

type State = {
  token: string | null;
  refreshToken: string | null;
  setTokens: (access: string, refresh: string) => void;
  clearAuth: () => void;
  getToken: () => string | null;
};

export const useAuthStore = create<State>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      setTokens: (access, refresh) => {
        set({ token: access, refreshToken: refresh });
      },
      clearAuth: () => set({ token: null, refreshToken: null }),
      getToken: () => get().token,
    }),
    { name: "wishlist-auth", partialize: (s) => ({ token: s.token, refreshToken: s.refreshToken }) }
  )
);

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return useAuthStore.getState().token;
}
