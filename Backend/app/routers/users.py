"""Users router: current user (JWT-protected)."""

from fastapi import APIRouter, Depends

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.services.user_service import get_user_by_id
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
async def me(user: User = Depends(get_current_user)):
    """Return current user from JWT (Bearer token)."""
    return user


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: UserUpdate,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db),
):
    """Update current user (name and/or Pushover user key)."""
    if data.name is not None:
        user.name = data.name
    if data.pushover_user_key is not None:
        user.pushover_user_key = data.pushover_user_key.strip() or None
    await session.flush()
    await session.refresh(user)
    return user
