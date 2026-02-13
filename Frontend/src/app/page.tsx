"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/auth-store";
import { api, type Token, type User } from "@/lib/api";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (getStoredToken()) router.replace("/dashboard");
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "register") {
        await api<User>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ email, password, name: name || email.split("@")[0] }),
        });
        const { access_token, refresh_token } = await api<Token>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        const { useAuthStore } = await import("@/lib/auth-store");
        useAuthStore.getState().setTokens(access_token, refresh_token);
      } else {
        const { access_token, refresh_token } = await api<Token>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        const { useAuthStore } = await import("@/lib/auth-store");
        useAuthStore.getState().setTokens(access_token, refresh_token);
      }
      router.replace("/dashboard");
    } catch (err) {
      console.error("Auth error:", err);
      if (err instanceof Error) {
        setError(err.message || "Ошибка подключения к серверу");
      } else if (typeof err === "object" && err !== null && "detail" in err) {
        setError((err as { detail: string }).detail || "Ошибка");
      } else {
        setError("Не удалось подключиться к серверу. Проверьте настройки API.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--border)] bg-[var(--muted-soft)] p-6 shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-2">Вишлист</h1>
        <p className="text-sm text-[var(--muted)] text-center mb-6">
          Создавайте списки желаний и делитесь с друзьями
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <input
              type="text"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-[var(--input)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--ring)]"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-[var(--input)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--ring)]"
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-[var(--input)] bg-[var(--background)] px-4 py-2.5 text-[var(--foreground)] placeholder:text-[var(--muted)] focus:ring-2 focus:ring-[var(--ring)]"
          />
          {error && (
            <div className="rounded-lg border border-red-300 bg-red-50 p-3">
              <p className="text-sm font-medium text-red-800">{error}</p>
              {process.env.NODE_ENV === "development" && (
                <p className="mt-1 text-xs text-red-600">
                  API URL: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}
                </p>
              )}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--primary)] py-2.5 font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {mode === "login" ? "Войти" : "Регистрация"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 w-full text-sm text-[var(--primary)]"
        >
          {mode === "login" ? "Нет аккаунта? Зарегистрироваться" : "Уже есть аккаунт? Войти"}
        </button>
      </div>
      <p className="mt-6 text-sm text-[var(--muted)]">
        Открыть вишлист по ссылке можно без входа — вставьте ссылку в браузер.
      </p>
    </main>
  );
}
