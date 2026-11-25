from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from ..models import Faculty, News
from ..schemas import Collection, NewsCategory, NewsOut
from .common import RESPONSE_OPTIONS, DbSession, FacultySlugFilter, not_found

router = APIRouter(prefix="/news", tags=["news"])


def to_schema(n: News) -> NewsOut:
    return NewsOut(
        slug=n.slug, title=n.title, date=n.date, category=n.category, excerpt=n.excerpt,
        source_url=n.source_url, image_url=n.image_url, content=n.content or None,
        faculty_slug=n.faculty.slug if n.faculty else None,
        department_slug=n.department.slug if n.department else None,
        tags=n.tags or None,
    )


def _query():
    # Only published news; drafts are never visible through the public API.
    return (
        select(News).where(News.is_published.is_(True))
        .options(joinedload(News.faculty), joinedload(News.department))
    )


@router.get("", response_model=Collection[NewsOut], **RESPONSE_OPTIONS)
def list_news(db: DbSession, faculty_slug: FacultySlugFilter = None, category: NewsCategory | None = None):
    """Published news, newest first."""
    query = _query()
    if faculty_slug:
        query = query.join(News.faculty).where(Faculty.slug == faculty_slug)
    if category:
        query = query.where(News.category == category)
    rows = db.scalars(query.order_by(News.date.desc(), News.position)).all()
    return Collection(items=[to_schema(n) for n in rows], total=len(rows))


@router.get("/{slug}", response_model=NewsOut, **RESPONSE_OPTIONS)
def get_news(slug: str, db: DbSession):
    n = db.scalars(_query().where(News.slug == slug)).first()
    if n is None:
        raise not_found("News")
    return to_schema(n)
