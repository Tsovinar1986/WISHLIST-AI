"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import type { Wishlist, Item } from "@/lib/api";
import { subscribeWishlist, type WsConnectionState } from "@/lib/ws-client";

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...options, credentials: "include" });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { detail?: string | string[] };
    const raw = err.detail;
    const msg =
      typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
    throw new Error(msg || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export default function WishlistEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newImage, setNewImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fetchingUrl, setFetchingUrl] = useState(false);
  const [wsState, setWsState] = useState<WsConnectionState>("disconnected");

  const load = useCallback(() => {
    if (!id) return;
    Promise.all([
      api<Wishlist>(`/api/wishlists/${id}`),
      api<Item[]>(`/api/wishlists/${id}/items`),
    ])
      .then(([w, list]) => {
        setWishlist(w);
        setItems(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        router.replace("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeWishlist(id, {
      onMessage: () => load(),
      onStateChange: setWsState,
    });
    return unsubscribe;
  }, [id, load]);

  const copyLink = () => {
    if (!wishlist) return;
    const url = `${typeof window !== "undefined" ? window.location.origin : ""}/w/${wishlist.public_slug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      toast.success("Ссылка скопирована");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error("Не удалось скопировать"));
  };

  const fetchByUrl = async () => {
    const url = newUrl.trim();
    if (!url) {
      toast.error("Вставьте ссылку на товар");
      return;
    }
    setFetchingUrl(true);
    try {
      const res = await fetch("/api/product/fetch", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as {
        success?: boolean;
        title?: string | null;
        image_url?: string | null;
        price?: number | null;
        error?: string;
      };
      if (data.success) {
        if (data.title) setNewTitle(data.title);
        if (data.image_url) setNewImage(data.image_url);
        if (data.price != null) setNewPrice(String(data.price));
        toast.success("Данные подтянуты по ссылке");
      } else {
        toast.error(data.error || "Не удалось подтянуть данные. Введите вручную.");
      }
    } catch {
      toast.error("Ошибка запроса. Введите данные вручную.");
    } finally {
      setFetchingUrl(false);
    }
  };

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const priceParsed = newPrice.trim() ? parseFloat(newPrice.replace(",", ".").replace(/\s/g, "")) : NaN;
    const price = Number.isFinite(priceParsed) ? priceParsed : null;
    setSubmitting(true);
    try {
      const item = await api<Item>(`/api/wishlists/${id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wishlist_id: id,
          title: newTitle.trim(),
          price,
          product_url: newUrl.trim() || null,
          image_url: newImage.trim() || null,
          allow_contributions: true,
        }),
      });
      setItems((prev) => [...prev, item]);
      setNewTitle("");
      setNewPrice("");
      setNewUrl("");
      setNewImage("");
      setAddOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не удалось добавить подарок");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!confirm("Удалить этот подарок из списка?")) return;
    try {
      await api(`/api/wishlists/${id}/items/${itemId}`, { method: "DELETE" });
      setItems((prev) => prev.filter((i) => i.id !== itemId));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не удалось удалить");
    }
  };

  const reorderItems = async (newOrder: string[]) => {
    try {
      await api(`/api/wishlists/${id}/items/reorder`, {
        method: "PATCH",
        body: JSON.stringify({ item_ids: newOrder }),
      });
      setItems((prev) => {
        const byId = new Map(prev.map((i) => [i.id, i]));
        return newOrder.map((id) => byId.get(id)).filter(Boolean) as Item[];
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Не удалось изменить порядок");
    }
  };

  const moveUp = (index: number) => {
    if (index <= 0) return;
    const next = [...items];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    reorderItems(next.map((i) => i.id));
  };

  const moveDown = (index: number) => {
    if (index >= items.length - 1) return;
    const next = [...items];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    reorderItems(next.map((i) => i.id));
  };

  if (loading || !wishlist) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  const publicUrl = typeof window !== "undefined" ? `${window.location.origin}/w/${wishlist.public_slug}` : "";

  return (
    <div>
      {wsState === "reconnecting" && (
        <div className="mb-4 rounded-lg bg-[var(--accent)]/15 text-[var(--accent)] text-center py-2 text-sm font-medium" role="status">
          Переподключение к обновлениям…
        </div>
      )}
      <div className="mb-4 flex items-center gap-2 text-sm text-[var(--muted)]">
        <Link href="/dashboard">Мои списки</Link>
        <span>/</span>
        <span className="text-[var(--foreground)]">{wishlist.title}</span>
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{wishlist.title}</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="rounded-xl border border-[var(--border)] bg-[var(--muted-soft)] px-4 py-2 text-sm font-medium"
          >
            {copied ? "Скопировано!" : "Скопировать ссылку"}
          </button>
          <a
            href={`/w/${wishlist.public_slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white"
          >
            Открыть как гость
          </a>
        </div>
      </div>
      <p className="text-sm text-[var(--muted)] mb-6">
        Поделитесь ссылкой с друзьями — они смогут зарезервировать подарок или скинуться. Вы не увидите, кто что выбрал.
      </p>

      {items.length === 0 && !addOpen && (
        <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted-soft)] p-8 sm:p-10 text-center">
          <p className="text-[var(--muted)] mb-2">В списке пока нет подарков</p>
          <p className="text-sm text-[var(--muted)] mb-4">Добавьте желания и поделитесь ссылкой с друзьями</p>
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Добавить подарок
          </button>
        </div>
      )}

      {items.length > 0 && (
        <ul className="space-y-4 mb-8">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="flex flex-wrap items-start gap-4 rounded-xl border border-[var(--border)] bg-[var(--muted-soft)] p-4"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  title="Поднять выше"
                  className="rounded border border-[var(--border)] px-2 py-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === items.length - 1}
                  title="Опустить ниже"
                  className="rounded border border-[var(--border)] px-2 py-1 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ↓
                </button>
              </div>
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt=""
                  className="h-20 w-20 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold">{item.title}</h3>
                {item.price != null && (
                  <p className="text-sm text-[var(--muted)]">{item.price.toFixed(0)} ₽</p>
                )}
                {item.product_url && (
                  <a
                    href={item.product_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--primary)] hover:underline"
                  >
                    Ссылка на товар
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}

      {addOpen && (
        <form onSubmit={addItem} className="rounded-xl border border-[var(--border)] bg-[var(--muted-soft)] p-4 space-y-3">
          <input
            type="text"
            placeholder="Название подарка"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2"
          />
          <input
            type="text"
            placeholder="Цена (по желанию)"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
            className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2"
          />
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Ссылка на товар — вставьте URL для автозаполнения"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="flex-1 min-w-0 rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2"
            />
            <button
              type="button"
              onClick={fetchByUrl}
              disabled={fetchingUrl || !newUrl.trim()}
              className="rounded-lg bg-[var(--primary)] px-3 py-2 text-sm font-medium text-white disabled:opacity-50 whitespace-nowrap"
            >
              {fetchingUrl ? "…" : "Подтянуть"}
            </button>
          </div>
          <input
            type="url"
            placeholder="Ссылка на картинку"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            className="w-full rounded-lg border border-[var(--input)] bg-[var(--background)] px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-[var(--primary)] px-4 py-2 text-white font-medium disabled:opacity-50"
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={() => setAddOpen(false)}
              className="rounded-lg border border-[var(--border)] px-4 py-2"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {items.length > 0 && !addOpen && (
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="rounded-xl border border-dashed border-[var(--border)] px-4 py-2 text-[var(--muted)]"
        >
          + Ещё подарок
        </button>
      )}
    </div>
  );
}
