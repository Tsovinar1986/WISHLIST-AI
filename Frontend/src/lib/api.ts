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
  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error((err as { detail?: string }).detail || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
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
