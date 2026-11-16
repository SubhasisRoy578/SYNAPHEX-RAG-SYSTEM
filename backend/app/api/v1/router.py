from fastapi import APIRouter
from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.documents import router as documents_router
from app.api.v1.collections import router as collections_router
from app.api.v1.conversations import router as conversations_router

api_v1_router = APIRouter()

# Include versioned routers
api_v1_router.include_router(health_router, prefix="")
api_v1_router.include_router(auth_router)
api_v1_router.include_router(documents_router)
api_v1_router.include_router(collections_router)
api_v1_router.include_router(conversations_router)
