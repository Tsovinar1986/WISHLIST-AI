/** Cookie name for JWT (httpOnly set in API routes). */
export const AUTH_COOKIE_NAME = "auth_token";

/** Max age for auth cookie (7 days in seconds). */
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function getBackendUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return (base.trim() || "http://localhost:8000").replace(/\/+$/, "");
}

/** Public wishlist URL by slug (e.g. http://localhost:3000/w/abc123). Set NEXT_PUBLIC_SITE_URL in prod. */
export function getPublicWishlistUrl(slug: string): string {
  const base =
    typeof window !== "undefined"
      ? window.location.origin
      : (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000");
  return `${base.replace(/\/+$/, "")}/w/${slug}`;
}
