import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-xl border border-[var(--border)] bg-[var(--muted-soft)] p-6 animate-pulse">
            <div className="h-7 w-24 rounded bg-[var(--border)] mb-2" />
            <div className="h-4 w-full rounded bg-[var(--border)] mb-6" />
            <div className="h-10 w-full rounded bg-[var(--border)] mb-4" />
            <div className="h-10 w-full rounded bg-[var(--border)]" />
          </div>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
