"use client";

const base = "animate-pulse rounded-lg bg-slate-700/60";

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`${base} ${className}`} />;
}

export function SkeletonCard() {
  return (
    <div className="rounded-2.5xl bg-surface-light/60 border border-slate-700/40 p-5 shadow-card">
      <div className="flex items-start gap-4">
        <Skeleton className="h-14 w-14 flex-shrink-0 rounded-xl" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonWishlistList({ count = 3 }: { count?: number }) {
  return (
    <ul className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          <SkeletonCard />
        </li>
      ))}
    </ul>
  );
}

export function SkeletonPublicItem() {
  return (
    <div className="rounded-2.5xl bg-surface-light/60 border border-slate-700/40 overflow-hidden shadow-card">
      <div className="p-4 flex gap-4">
        <Skeleton className="h-20 w-20 flex-shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-4 w-1/3" />
        </div>
      </div>
      <div className="px-4 pb-4">
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
      <div className="px-4 pb-4 flex gap-2">
        <Skeleton className="h-9 w-24 rounded-lg" />
        <Skeleton className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonPublicPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
      <ul className="space-y-6">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <SkeletonPublicItem />
          </li>
        ))}
      </ul>
    </div>
  );
}
