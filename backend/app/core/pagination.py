"""Shared pagination parameters and response envelope."""

import math
from dataclasses import dataclass

from fastapi import Query
from pydantic import BaseModel

MAX_LIMIT = 100


@dataclass(frozen=True)
class PageParams:
    page: int
    limit: int

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.limit


def get_page_params(
    page: int = Query(default=1, ge=1, le=10_000, description="Page number, from 1"),
    limit: int = Query(default=20, ge=1, le=MAX_LIMIT, description="Items per page"),
) -> PageParams:
    return PageParams(page=page, limit=limit)


class Page[T](BaseModel):
    items: list[T]
    page: int
    limit: int
    total: int
    pages: int

    @classmethod
    def build(cls, items: list[T], params: PageParams, total: int) -> "Page[T]":
        return cls(
            items=items,
            page=params.page,
            limit=params.limit,
            total=total,
            pages=math.ceil(total / params.limit) if total else 0,
        )
