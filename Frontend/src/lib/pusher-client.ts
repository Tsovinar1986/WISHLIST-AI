/**
 * Pusher-js client configured with auth endpoint for private/presence channels.
 * Auth is proxied via Next.js /api/pusher/auth so the httpOnly cookie is sent.
 */

import Pusher from "pusher-js";

const PUSHER_KEY = process.env.NEXT_PUBLIC_PUSHER_KEY ?? "";
const PUSHER_CLUSTER = process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? "ap2";

/** Same-origin auth endpoint so the browser sends the auth cookie. */
function getAuthEndpoint(): string {
  if (typeof window === "undefined") return "";
  return `${window.location.origin}/api/pusher/auth`;
}

let pusherInstance: Pusher | null = null;

/**
 * Get or create the Pusher client. Configured with:
 * - authEndpoint: /api/pusher/auth (Next.js proxy that forwards to backend with JWT from cookie)
 * - authTransport: ajax (default) so the auth request sends credentials (cookies)
 */
export function getPusherClient(): Pusher | null {
  if (!PUSHER_KEY) return null;
  if (typeof window === "undefined") return null;

  if (!pusherInstance) {
    pusherInstance = new Pusher(PUSHER_KEY, {
      cluster: PUSHER_CLUSTER,
      channelAuthorization: {
        endpoint: getAuthEndpoint(),
        transport: "ajax",
      },
    });
  }
  return pusherInstance;
}

/**
 * Subscribe to a channel. Use "private-*" or "presence-*" for authenticated channels;
 * the auth endpoint will be called with the cookie and the backend will sign the subscription.
 */
export function subscribeChannel<T = unknown>(
  channelName: string,
  eventName: string,
  callback: (data: T) => void
): (() => void) | null {
  const client = getPusherClient();
  if (!client) return null;
  const channel = client.subscribe(channelName);
  const handler = (data: T) => callback(data);
  channel.bind(eventName, handler);
  return () => {
    channel.unbind(eventName, handler);
    client.unsubscribe(channelName);
  };
}

/**
 * Unsubscribe and disconnect the shared Pusher client (e.g. on logout).
 */
export function disconnectPusher(): void {
  if (pusherInstance) {
    pusherInstance.disconnect();
    pusherInstance = null;
  }
}
