"""BSU API entry point.

Run locally (from the backend/ folder):
    uvicorn app.main:app --reload
Then open http://127.0.0.1:8000/docs
"""
from fastapi import FastAPI, HTTPException, Query

from . import news_store
from .schemas import NewsCategory, NewsPage, NewsRecord

app = FastAPI(
    title="BSU API",
    version="0.1.0",
    description="Learning prototype of the Bishkek State University backend.",
)


@app.get("/api/v1/health", tags=["system"])
def health() -> dict[str, str]:
    """Simple check that the server is running."""
    return {"status": "ok"}


@app.get("/api/v1/news", response_model=NewsPage, response_model_exclude_none=True, tags=["news"])
def list_news(
    category: NewsCategory | None = None,
    page: int = Query(1, ge=1, description="Page number, starting at 1"),
    limit: int = Query(10, ge=1, le=50, description="Items per page"),
) -> NewsPage:
    """Published news, newest first. Example: /api/v1/news?limit=3"""
    records = news_store.list_news(category)
    start = (page - 1) * limit
    return NewsPage(items=records[start : start + limit], total=len(records), page=page, limit=limit)


@app.get("/api/v1/news/{slug}", response_model=NewsRecord, response_model_exclude_none=True, tags=["news"])
def get_news(slug: str) -> NewsRecord:
    """One news item by its slug, or 404 if it does not exist."""
    record = news_store.get_news(slug)
    if record is None:
        raise HTTPException(status_code=404, detail="News not found")
    return record
