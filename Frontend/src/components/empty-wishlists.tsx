"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateWishlistForm } from "@/components/create-wishlist-button";

export function EmptyWishlistsIllustration() {
  return (
    <svg
      className="mx-auto h-40 w-40 text-[var(--muted)] sm:h-48 sm:w-48"
      fill="none"
      viewBox="0 0 200 200"
      aria-hidden
    >
      <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path
        d="M70 85 L100 65 L130 85 L130 120 L70 120 Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />
      <path
        d="M85 95 L95 88 L105 95 L105 110 L85 110 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.7"
      />
      <circle cx="100" cy="140" r="8" fill="currentColor" opacity="0.4" />
    </svg>
  );
}

export function EmptyWishlistsState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--muted-soft)] p-8 text-center sm:p-12">
      <EmptyWishlistsIllustration />
      <p className="mt-6 text-lg font-medium text-[var(--foreground)]">
        У вас пока нет списков желаний. Создайте первый!
      </p>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="lg" className="mt-6">
            + Создать новый вишлист
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Новый вишлист</DialogTitle>
          </DialogHeader>
          <CreateWishlistForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
