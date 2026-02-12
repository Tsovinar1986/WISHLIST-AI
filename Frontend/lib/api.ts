import axios from "axios";

const baseURL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000")
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (err) => {
    const original = err.config;
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh_token");
      if (refresh) {
        try {
          const { data } = await axios.post(`${baseURL}/api/auth/refresh`, {
            refresh_token: refresh,
          });
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          if (typeof window !== "undefined") window.location.href = "/login";
        }
      }
    }
    return Promise.reject(err);
  }
);

// Types matching backend
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Wishlist {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  public_slug: string;
  deadline: string | null;
  created_at: string;
}

export interface Item {
  id: string;
  wishlist_id: string;
  title: string;
  price: number | null;
  image_url: string | null;
  product_url: string | null;
  allow_contributions: boolean;
  cached_snapshot_json: Record<string, unknown> | null;
  created_at: string;
}

export interface Reservation {
  id: string;
  item_id: string;
  amount: number;
  is_full_reservation: boolean;
  created_at: string;
}

export interface PublicWishlistItem {
  id: string;
  wishlist_id: string;
  title: string;
  price: number | null;
  image_url: string | null;
  product_url: string | null;
  allow_contributions: boolean;
  cached_snapshot_json: Record<string, unknown> | null;
  created_at: string;
  reserved_total: number;
  reservations: Reservation[];
}

export interface PublicWishlist {
  id: string;
  owner_id: string;
  title: string;
  description: string | null;
  public_slug: string;
  deadline: string | null;
  created_at: string;
  items: PublicWishlistItem[];
}

export interface ProductFetchResponse {
  success: boolean;
  title?: string | null;
  image_url?: string | null;
  price?: number | null;
  currency?: string | null;
  snapshot?: Record<string, unknown> | null;
  error?: string | null;
}
