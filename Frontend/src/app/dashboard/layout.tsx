"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getStoredToken } from "@/lib/auth-store";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined" && !getStoredToken()) router.replace("/");
  }, [router]);

  const logout = () => {
    import("@/lib/auth-store").then(({ useAuthStore }) => {
      useAuthStore.getState().clearAuth();
      router.replace("/");
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold text-[var(--primary)]">
            Вишлист
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`text-sm ${pathname === "/dashboard" ? "font-medium text-[var(--primary)]" : "text-[var(--muted)]"}`}
            >
              Мои списки
            </Link>
            <button type="button" onClick={logout} className="text-sm text-[var(--muted)] hover:underline">
              Выйти
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
