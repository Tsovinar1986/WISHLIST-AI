"""FastAPI application: CORS, routers, WebSocket."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.routers import auth, items, product, public, reservations, wishlists, ws

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Wishlist AI API",
    description="Real-time wishlist backend with JWT auth and public slug URLs",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS configuration - allow Vercel domains dynamically
# For production, we allow all origins since Vercel uses dynamic subdomains
# Set CORS_ORIGINS env var with specific domains for better security
cors_origins = settings.cors_origins_list
allow_all = cors_origins == ["*"] or (len(cors_origins) == 1 and cors_origins[0] == "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins if not allow_all else ["*"],
    allow_credentials=not allow_all,  # Can't use credentials with allow_origins=["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(product.router, prefix="/api")
app.include_router(wishlists.router, prefix="/api")
app.include_router(items.router, prefix="/api")
app.include_router(reservations.router, prefix="/api")
app.include_router(public.router, prefix="/api")
app.include_router(ws.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok"}
