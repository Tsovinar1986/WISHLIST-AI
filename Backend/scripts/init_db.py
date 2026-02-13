"""Create tables (run once). Use: python -m scripts.init_db"""
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy.ext.asyncio import create_async_engine
from app.db.base import Base
from app.core.config import get_settings
from app.models import User, Wishlist, Item, Reservation  # noqa: F401 - register models for Base.metadata

async def main():
    settings = get_settings()
    engine = create_async_engine(settings.database_url, echo=True)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await engine.dispose()
    print("Tables created.")

if __name__ == "__main__":
    asyncio.run(main())
