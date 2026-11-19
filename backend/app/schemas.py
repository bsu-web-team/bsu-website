"""Pydantic models: the shape of data the API accepts and returns.

FastAPI uses these models to validate data and to build the OpenAPI docs at /docs.
"""
from datetime import date
from enum import Enum

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class NewsCategory(str, Enum):
    """Allowed categories. Values match the frontend `NewsCategory` type."""

    news = "Новости"
    science = "Наука"
    international = "Международное сотрудничество"
    events = "Мероприятия"


class ApiModel(BaseModel):
    """Base model: Python code uses snake_case, JSON uses camelCase.

    Example: the `source_url` attribute is sent to the frontend as `sourceUrl`.
    """

    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class NewsRecord(ApiModel):
    slug: str
    title: str
    date: date
    category: NewsCategory
    excerpt: str
    source_url: str
    image_url: str | None = None


class NewsPage(ApiModel):
    """One page of results, as described in docs/NEWS_API_CONTRACT.md."""

    items: list[NewsRecord]
    total: int
    page: int
    limit: int
