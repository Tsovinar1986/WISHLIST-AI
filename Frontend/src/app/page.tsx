import { redirect } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth-cookie";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (token) redirect("/dashboard");

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="text-center max-w-md space-y-6">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Списки желаний
        </h1>
        <p className="text-[var(--muted)] text-base">
          Создавайте вишлисты, добавляйте подарки и делитесь ссылкой с друзьями. Друзья смогут зарезервировать подарок или скинуться — вы не узнаете, кто что выбрал.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--muted-soft)] px-6 py-2.5 text-sm font-medium hover:bg-[var(--border)] transition-colors"
          >
            Регистрация
          </Link>
        </div>
        <p className="text-sm text-[var(--muted)]">
          Публичную ссылку на вишлист можно открыть без входа.
        </p>
      </div>
    </main>
  );
}
