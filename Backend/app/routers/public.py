"""Public routes: wishlist by slug (no login required).
Owner must NOT see who reserved or contributed — only reserved_total and contributors_count.
"""

from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from app.db.session import get_db
from app.services.wishlist_service import get_wishlist_by_slug
from app.services.reservation_service import total_reserved_for_item, contributors_count_for_item

router = APIRouter(prefix="/public", tags=["public"])


class ItemPublic(BaseModel):
    id: UUID
    wishlist_id: UUID
    title: str
    price: float | None
    image_url: str | None
    product_url: str | None
    allow_contributions: bool
    cached_snapshot_json: dict | None
    created_at: datetime
    reserved_total: float
    contributors_count: int


class PublicWishlistResponse(BaseModel):
    id: UUID
    owner_id: UUID
    title: str
    description: str | None
    public_slug: str
    deadline: datetime | None
    created_at: datetime
    items: list[ItemPublic]


@router.get("/wishlists/by-slug/{slug}", response_model=PublicWishlistResponse)
async def get_wishlist_by_slug_public(
    slug: str,
    session: AsyncSession = Depends(get_db),
):
    w = await get_wishlist_by_slug(session, slug, load_items=True)
    if not w:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wishlist not found",
        )
    items_out = []
    sorted_items = sorted(w.items, key=lambda i: (getattr(i, "sort_order", 0), i.created_at))
    for item in sorted_items:
        total = await total_reserved_for_item(session, item.id)
        count = await contributors_count_for_item(session, item.id)
        items_out.append(
            ItemPublic(
                id=item.id,
                wishlist_id=item.wishlist_id,
                title=item.title,
                price=float(item.price) if item.price is not None else None,
                image_url=item.image_url,
                product_url=item.product_url,
                allow_contributions=item.allow_contributions,
                cached_snapshot_json=item.cached_snapshot_json,
                created_at=item.created_at,
                reserved_total=float(total),
                contributors_count=count,
            )
        )
    return PublicWishlistResponse(
        id=w.id,
        owner_id=w.owner_id,
        title=w.title,
        description=w.description,
        public_slug=w.public_slug,
        deadline=w.deadline,
        created_at=w.created_at,
        items=items_out,
    )
