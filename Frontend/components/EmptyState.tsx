"use client";

interface EmptyStateProps {
  title: string;
  description?: string;
  illustration?: "list" | "gift" | "search";
  action?: React.ReactNode;
}

const illustrations = {
  list: (
    <svg
      className="w-20 h-20 text-slate-600/80 mx-auto"
      fill="none"
      viewBox="0 0 80 80"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20h48M16 32h48M16 44h32M16 56h40" />
      <rect x="8" y="14" width="6" height="6" rx="1" />
      <rect x="8" y="26" width="6" height="6" rx="1" />
      <rect x="8" y="38" width="6" height="6" rx="1" />
      <rect x="8" y="50" width="6" height="6" rx="1" />
    </svg>
  ),
  gift: (
    <svg
      className="w-20 h-20 text-slate-600/80 mx-auto"
      fill="none"
      viewBox="0 0 80 80"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="12" y="28" width="56" height="40" rx="2" />
      <path d="M40 28v40M12 38h56" />
      <path d="M40 28c0-6 4-12 12-12 4 0 8 2 10 6M40 28c0-6-4-12-12-12-4 0-8 2-10 6" />
      <path d="M40 16v12" />
    </svg>
  ),
  search: (
    <svg
      className="w-20 h-20 text-slate-600/80 mx-auto"
      fill="none"
      viewBox="0 0 80 80"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="34" cy="34" r="18" />
      <path d="M52 52l16 16" />
    </svg>
  ),
};

export function EmptyState({
  title,
  description,
  illustration = "list",
  action,
}: EmptyStateProps) {
  return (
    <div className="rounded-2.5xl bg-surface-light/40 border border-slate-700/30 p-10 text-center shadow-soft">
      <div className="mb-6 transition-transform duration-300 hover:scale-105">
        {illustrations[illustration]}
      </div>
      <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-xs mx-auto">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
