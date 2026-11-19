"""Temporary data source: reads news from a JSON file.

In step 3 this module will be replaced by PostgreSQL queries. The API routes
only call the functions below, so they will not need to change.
"""
import json
from functools import lru_cache
from pathlib import Path

from .schemas import NewsCategory, NewsRecord

DATA_FILE = Path(__file__).parent / "data" / "news.json"


@lru_cache
def _load_all() -> list[NewsRecord]:
    """Read and validate the file once, then keep it in memory."""
    raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    records = [NewsRecord.model_validate(item) for item in raw]
    return sorted(records, key=lambda n: n.date, reverse=True)


def list_news(category: NewsCategory | None = None) -> list[NewsRecord]:
    """All news, newest first, optionally filtered by category."""
    records = _load_all()
    if category is not None:
        records = [n for n in records if n.category == category]
    return records


def get_news(slug: str) -> NewsRecord | None:
    return next((n for n in _load_all() if n.slug == slug), None)
