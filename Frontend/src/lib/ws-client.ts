/**
 * WebSocket client setup and wishlist subscriptions.
 * Uses the same base URL as the REST API (NEXT_PUBLIC_API_URL) so one env var works.
 */

import { getWsUrl } from "@/lib/api";

const WS_PATH = "/api/ws/wishlist";

/** Message types broadcast by the backend for a wishlist (reservations, item CRUD). */
export type WishlistWsMessage =
  | { type: "pong" }
  | {
      type: "item_reserved" | "contribution_added";
      item_id: string;
      reserved_total: number;
      contributors_count: number;
      reservations?: unknown[];
    }
  | { type: "item_created"; item_id: string }
  | { type: "item_updated"; item_id: string }
  | { type: "item_deleted"; item_id: string };

export interface SubscribeWishlistCallbacks {
  onMessage: (msg: WishlistWsMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
}

const PING_INTERVAL_MS = 25_000;

/**
 * Subscribe to real-time wishlist updates (reservations, item changes).
 * Call the returned function to unsubscribe and close the WebSocket.
 */
export function subscribeWishlist(
  wishlistId: string,
  { onMessage, onOpen, onClose }: SubscribeWishlistCallbacks
): () => void {
  const url = getWsUrl(`${WS_PATH}/${wishlistId}`);
  const ws = new WebSocket(url);
  let pingInterval: ReturnType<typeof setInterval> | null = null;

  ws.onopen = () => {
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send("ping");
    }, PING_INTERVAL_MS);
    onOpen?.();
  };

  ws.onclose = () => {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
    onClose?.();
  };

  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data as string) as WishlistWsMessage;
      onMessage(msg);
    } catch {
      // ignore non-JSON (e.g. raw pong)
    }
  };

  return function unsubscribe() {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
}
