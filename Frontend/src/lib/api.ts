// From .env.local: NEXT_PUBLIC_API_URL (e.g. https://your-api.com or http://localhost:8000)
// Restart dev server after changing .env.local.
function getApiBase(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL ?? "";
  const base = (raw.trim() || "http://localhost:8000").replace(/\/+$/, "");
  return base;
}

export function getApiUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

export function getWsUrl(path: string): string {
  const base = getApiBase();
  const p = path.startsWith("/") ? path : `/${path}`;
  try {
    const u = new URL(base);
    const protocol = u.protocol === "https:" ? "wss:" : "ws:";
    return `${protocol}//${u.host}${p}`;
  } catch {
    return `ws://localhost:8000${p}`;
  }
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const url = getApiUrl(path);
  
  try {
    const res = await fetch(url, { ...init, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      const raw = (err as { detail?: string | string[] }).detail;
      const errorMessage =
        typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;
      const message = errorMessage || (err as { error?: string }).error || res.statusText;
      // Provide more helpful error messages
      if (res.status === 404) {
        throw new Error("Эндпоинт не найден. Проверьте URL API.");
      } else if (res.status === 401) {
        throw new Error("Неверный email или пароль");
      } else if (res.status === 400) {
        throw new Error(message || "Неверный запрос");
      } else if (res.status >= 500) {
        throw new Error("Ошибка сервера. Попробуйте позже.");
      }
      throw new Error(message);
    }
    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  } catch (error) {
    // Handle network errors (backend not reachable, CORS, etc.)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      const apiBase = getApiBase();
      // Check if it's a CORS error
      if (apiBase.includes("localhost") && typeof window !== "undefined" && window.location.hostname !== "localhost") {
        throw new Error(
          `API настроен на localhost, но приложение работает на ${window.location.hostname}. Установите NEXT_PUBLIC_API_URL в Vercel.`
        );
      }
      throw new Error(
        `Не удалось подключиться к серверу (${apiBase}). Проверьте, что бэкенд запущен и доступен.`
      );
    }
    throw error;
  }
}

export type Token = { access_token: string; refresh_token: string };
export type User = { id: string; email: string; name: string; created_at: string };
export type Wishlist = {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  public_slug: string;
  deadline: string | null;
  created_at: string;
};
export type Item = {
  id: string;
  wishlist_id: string;
  sort_order: number;
  title: string;
  price: number | null;
  image_url: string | null;
  product_url: string | null;
  allow_contributions: boolean;
  cached_snapshot_json: Record<string, unknown> | null;
  created_at: string;
};
export type PublicItem = Item & { reserved_total: number; contributors_count: number };
export type PublicWishlist = Omit<Wishlist, "owner_id"> & { owner_id: string; items: PublicItem[] };
