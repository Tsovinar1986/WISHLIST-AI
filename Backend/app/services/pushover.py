"""Pushover push notifications. Sends to wishlist owner when someone reserves or contributes."""

import logging

import httpx

from app.core.config import get_settings

logger = logging.getLogger(__name__)
PUSHOVER_URL = "https://api.pushover.net/1/messages.json"


async def send_pushover(user_key: str, title: str, message: str) -> bool:
    """Send a push notification via Pushover. Returns True if sent successfully."""
    settings = get_settings()
    if not settings.pushover_app_token or not user_key:
        return False
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            r = await client.post(
                PUSHOVER_URL,
                data={
                    "token": settings.pushover_app_token,
                    "user": user_key,
                    "title": title,
                    "message": message,
                },
            )
            if r.status_code != 200:
                logger.warning("Pushover API error: %s %s", r.status_code, r.text)
                return False
            return True
    except Exception as e:
        logger.warning("Pushover send failed: %s", e)
        return False
