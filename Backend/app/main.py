"""App entry point: re-export FastAPI app for uvicorn (e.g. uvicorn app.main:app)."""
from app.websocket.main import app

__all__ = ["app"]
