"""WebSocket endpoint: subscribe to wishlist updates (real-time).

Public channel: /ws/wishlist/{wishlist_id} — anyone can subscribe; events are
anonymous (no user identity). For future owner-only updates (e.g. private
reservation hints), add an authenticated endpoint such as:
  /ws/wishlist/{wishlist_id}/owner  (require JWT, verify owner_id).
"""

from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.websocket.manager import manager

router = APIRouter(prefix="/ws", tags=["websocket"])


@router.websocket("/wishlist/{wishlist_id}")
async def websocket_wishlist(websocket: WebSocket, wishlist_id: UUID):
    """Subscribe to real-time updates for a wishlist (items, reservations).
    Events: item_reserved, contribution_added (updated item state, no user identity).
    """
    key = str(wishlist_id)
    await manager.connect(websocket, key)
    try:
        while True:
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text('{"type":"pong"}')
    except WebSocketDisconnect:
        pass
    finally:
        manager.disconnect(websocket, key)
