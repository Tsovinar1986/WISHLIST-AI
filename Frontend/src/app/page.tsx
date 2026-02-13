import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (token) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <h1 className="text-3xl font-bold">Wishlist</h1>
        <p className="text-[var(--muted)]">
          Create wishlists and share them with friends.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md border border-[var(--border)] px-6 py-2.5 text-sm font-medium hover:bg-[var(--muted-soft)]"
          >
            Register
          </Link>
        </div>
        <p className="text-sm text-[var(--muted)]">
          You can open a shared wishlist by link without logging in.
        </p>
      </div>
    </main>
  );
}
