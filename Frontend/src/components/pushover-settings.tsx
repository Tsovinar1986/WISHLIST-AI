"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function PushoverSettings() {
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pushover_user_key: key.trim() || null,
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.detail ?? "Failed to save");
      }
      toast.success(key.trim() ? "Pushover key saved." : "Pushover key cleared.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Push-уведомления (Pushover)</CardTitle>
        <CardDescription>
          Укажите ваш Pushover User Key, чтобы получать уведомления, когда кто-то
          резервирует или вносит вклад в ваши вишлисты. Оставьте пустым, чтобы
          отключить.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSave}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pushover-key">Pushover User Key</Label>
            <Input
              id="pushover-key"
              type="text"
              placeholder="Ваш User Key с pushover.net"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="font-mono"
            />
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Сохранение…" : "Сохранить"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
