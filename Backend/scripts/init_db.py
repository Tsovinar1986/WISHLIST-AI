"""Create tables (run once). Use from Backend dir: python -m scripts.init_db

Requires a running PostgreSQL. In Backend/.env set DATABASE_URL to either:
  - Local: postgresql+asyncpg://user:password@localhost:5432/wishlist_ai (start Postgres first, e.g. Docker)
  - Remote: copy DATABASE_URL from Railway/Supabase and paste into .env
"""
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
    url = settings.database_url
    # Hide password in logs
    safe_url = url.split("@")[-1] if "@" in url else url
    print(f"Connecting to {safe_url} ...")
    engine = create_async_engine(url, echo=True)
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        await engine.dispose()
        print("Tables created.")
    except OSError as e:
        if "5432" in str(e) or "Connect" in str(type(e).__name__) or "61" in str(e):
            print("\nCannot connect to PostgreSQL (connection refused).")
            print("  • If using local DB: start PostgreSQL (e.g. Docker: docker run -d -p 5432:5432 -e POSTGRES_USER=wishlist -e POSTGRES_PASSWORD=wishlist -e POSTGRES_DB=wishlist_ai postgres:16-alpine)")
            print("  • If using Railway: copy DATABASE_URL from your Railway project → Variables, paste into Backend/.env, then run this script again.")
        raise


if __name__ == "__main__":
    asyncio.run(main())
