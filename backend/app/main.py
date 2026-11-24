"""BSU API entry point.

Run locally (from the backend/ folder):
    uvicorn app.main:app --reload
Then open http://127.0.0.1:8000/docs
"""
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import text

from .config import settings
from . import admin_router, editorial_router
from .routers import content, departments, documents, faculties, news, programs, staff
from .routers.common import DbSession

API_PREFIX = "/api/v1"

app = FastAPI(
    title="BSU API",
    version="1.0.0",
    description="Read-only public API for the Bishkek State University website (MVP).",
    docs_url="/docs" if settings.enable_docs else None,
    redoc_url=None,
    openapi_url="/openapi.json" if settings.enable_docs else None,
)

for module in (faculties, departments, staff, programs, news, documents, content):
    app.include_router(module.router, prefix=API_PREFIX)

app.include_router(admin_router.router, prefix=API_PREFIX)
app.include_router(editorial_router.router, prefix=API_PREFIX)


@app.get(f"{API_PREFIX}/health", tags=["system"])
def health(db: DbSession):
    """200 if the API and the database work, 503 if the database is unavailable."""
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        return JSONResponse(status_code=503, content={"status": "error", "database": "unavailable"})
    return {"status": "ok", "database": "ok"}
