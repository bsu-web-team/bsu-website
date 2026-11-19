import asyncio
import logging

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.errors import AppError
from app.db.session import get_session

router = APIRouter(tags=["health"])
logger = logging.getLogger("bsu.health")


class HealthOut(BaseModel):
    status: str


@router.get("/health", response_model=HealthOut, summary="Liveness probe")
async def health() -> HealthOut:
    """The process is up. Does not touch the database."""
    return HealthOut(status="ok")


@router.get(
    "/health/ready",
    response_model=HealthOut,
    summary="Readiness probe (checks the database)",
    responses={503: {"description": "Database unavailable"}},
)
async def ready(session: AsyncSession = Depends(get_session)) -> HealthOut:
    try:
        async with asyncio.timeout(3):
            await session.execute(text("SELECT 1"))
    except Exception as exc:
        logger.warning("Readiness check failed: %s", type(exc).__name__)
        raise AppError(503, "Database unavailable") from exc
    return HealthOut(status="ok")
