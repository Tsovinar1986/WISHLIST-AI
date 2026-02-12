const wsBase =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000")
    : "ws://localhost:8000";

export function getWishlistWsUrl(wishlistId: string): string {
  return `${wsBase}/api/ws/wishlist/${wishlistId}`;
}

export type WishlistWsMessage =
  | { type: "item_reserved"; item_id: string; reserved_total: number; reservations: unknown[] }
  | { type: "contribution_added"; item_id: string; reserved_total: number; reservations: unknown[] }
  | { type: "item_created"; item_id: string }
  | { type: "item_updated"; item_id: string }
  | { type: "item_deleted"; item_id: string }
  | { type: "pong" };

/**
 * Connect to wishlist WebSocket on mount. Listen for item_reserved and contribution_added.
 * Call onMessage when state should update; caller updates item state instantly and animates progress bar.
 */
export function subscribeWishlist(
  wishlistId: string,
  onMessage: (msg: WishlistWsMessage) => void,
  onOpen?: () => void,
  onClose?: () => void
): () => void {
  const url = getWishlistWsUrl(wishlistId);
  const ws = new WebSocket(url);
  let pingInterval: ReturnType<typeof setInterval> | null = null;

  ws.onopen = () => {
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send("ping");
    }, 25000);
    onOpen?.();
  };

  ws.onclose = () => {
    if (pingInterval) clearInterval(pingInterval);
    onClose?.();
  };

  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data as string) as WishlistWsMessage;
      onMessage(msg);
    } catch {
      // ignore non-JSON (e.g. pong)
    }
  };

  return () => {
    if (pingInterval) clearInterval(pingInterval);
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
  };
}
