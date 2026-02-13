/**
 * WebSocket client setup and wishlist subscriptions.
 * Uses the same base URL as the REST API (NEXT_PUBLIC_API_URL) so one env var works.
 * Auto-reconnects on disconnect; reports state for "Reconnecting..." UI.
 */

import { getWsUrl } from "@/lib/api";

const WS_PATH = "/api/ws/wishlist";

/** Connection state for UI (e.g. show "Reconnecting..." when reconnecting). */
export type WsConnectionState = "connecting" | "connected" | "reconnecting" | "disconnected";

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
  /** Called when connection state changes (for "Reconnecting..." banner). */
  onStateChange?: (state: WsConnectionState) => void;
}

const PING_INTERVAL_MS = 25_000;
const RECONNECT_BASE_MS = 1_000;
const RECONNECT_MAX_MS = 30_000;

function parseMessage(data: string): WishlistWsMessage | null {
  try {
    return JSON.parse(data) as WishlistWsMessage;
  } catch {
    return null;
  }
}

/**
 * Subscribe to real-time wishlist updates (reservations, item changes).
 * Auto-reconnects on disconnect; use onStateChange to show "Reconnecting...".
 * Call the returned function to unsubscribe and stop reconnecting.
 */
export function subscribeWishlist(
  wishlistId: string,
  { onMessage, onOpen, onClose, onStateChange }: SubscribeWishlistCallbacks
): () => void {
  const url = getWsUrl(`${WS_PATH}/${wishlistId}`);
  let ws: WebSocket | null = null;
  let pingInterval: ReturnType<typeof setInterval> | null = null;
  let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  let reconnectAttempt = 0;
  let intentionallyClosed = false;

  function clearTimers() {
    if (pingInterval) {
      clearInterval(pingInterval);
      pingInterval = null;
    }
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  }

  function setState(state: WsConnectionState) {
    onStateChange?.(state);
  }

  function connect() {
    if (intentionallyClosed) return;
    try {
      ws = new WebSocket(url);
    } catch (err) {
      console.warn("[ws-client] WebSocket constructor failed:", err);
      scheduleReconnect();
      return;
    }

    ws.onopen = () => {
      reconnectAttempt = 0;
      clearTimers();
      pingInterval = setInterval(() => {
        if (ws?.readyState === WebSocket.OPEN) ws.send("ping");
      }, PING_INTERVAL_MS);
      setState("connected");
      onOpen?.();
    };

    ws.onclose = () => {
      clearTimers();
      ws = null;
      if (intentionallyClosed) {
        setState("disconnected");
        onClose?.();
        return;
      }
      setState("reconnecting");
      scheduleReconnect();
      onClose?.();
    };

    ws.onerror = () => {
      // Close will follow; avoid logging noisy errors
    };

    ws.onmessage = (e) => {
      const msg = parseMessage(e.data as string);
      if (msg) onMessage(msg);
    };

    setState("connecting");
  }

  function scheduleReconnect() {
    if (intentionallyClosed || reconnectTimeout) return;
    const delay = Math.min(
      RECONNECT_BASE_MS * Math.pow(2, reconnectAttempt),
      RECONNECT_MAX_MS
    );
    reconnectAttempt += 1;
    reconnectTimeout = setTimeout(() => {
      reconnectTimeout = null;
      connect();
    }, delay);
  }

  connect();

  return function unsubscribe() {
    intentionallyClosed = true;
    clearTimers();
    if (ws?.readyState === WebSocket.OPEN || ws?.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
    ws = null;
    setState("disconnected");
  };
}
