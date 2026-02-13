"""Wishlist schemas."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class WishlistBase(BaseModel):
    title: str
    description: str | None = None
    deadline: datetime | None = None


class WishlistCreate(WishlistBase):
    pass


class WishlistUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    deadline: datetime | None = None


class WishlistResponse(WishlistBase):
    id: UUID
    owner_id: UUID
    public_slug: str
    created_at: datetime

    model_config = {"from_attributes": True}


class WishlistListResponse(WishlistResponse):
    """Wishlist with item count for list views."""

    items_count: int = 0


class WishlistPublicResponse(WishlistResponse):
    """Same as response; used for public-by-slug (no owner identity if needed)."""

    pass
