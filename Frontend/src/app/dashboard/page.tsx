"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredToken } from "@/lib/auth-store";
import { api, type Wishlist } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [lists, setLists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const t = getStoredToken();
    if (!t) return;
    api<Wishlist[]>("/api/wishlists", { token: t })
      .then(setLists)
      .catch(() => router.replace("/"))
      .finally(() => setLoading(false));
  }, [router]);

  const createList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const t = getStoredToken();
    if (!t) return;
    setCreating(true);
    try {
      const w = await api<Wishlist>("/api/wishlists", {
        method: "POST",
        token: t,
        body: JSON.stringify({ title: newTitle.trim(), description: null, deadline: null }),
      });
      setLists((prev) => [w, ...prev]);
      setNewTitle("");
      setShowForm(false);
      router.push(`/dashboard/wishlists/${w.id}`);
    } catch {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Мои вишлисты</h1>
      {lists.length === 0 && !showForm && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted-soft)] p-8 text-center">
          <p className="text-[var(--muted)] mb-4">Пока нет ни одного списка</p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-white font-medium"
          >
            Создать вишлист
          </button>
        </div>
      )}
      {lists.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {lists.map((w) => (
            <li key={w.id}>
              <Link
                href={`/dashboard/wishlists/${w.id}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--muted-soft)] p-4 hover:border-[var(--primary)] transition"
              >
                <h2 className="font-semibold">{w.title}</h2>
                {w.description && (
                  <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">{w.description}</p>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
      {(lists.length > 0 || showForm) && (
        <div className="mt-6">
          {showForm ? (
            <form onSubmit={createList} className="flex flex-wrap items-end gap-3">
              <input
                type="text"
                placeholder="Название списка (например: День рождения)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="flex-1 min-w-[200px] rounded-xl border border-[var(--input)] bg-[var(--background)] px-4 py-2.5"
                autoFocus
              />
              <button
                type="submit"
                disabled={creating || !newTitle.trim()}
                className="rounded-xl bg-[var(--primary)] px-4 py-2.5 text-white font-medium disabled:opacity-50"
              >
                Создать
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-[var(--muted)]"
              >
                Отмена
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="rounded-xl border border-dashed border-[var(--border)] px-4 py-2.5 text-[var(--muted)] hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              + Ещё один вишлист
            </button>
          )}
        </div>
      )}
    </div>
  );
}
