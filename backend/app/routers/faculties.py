from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from ..models import Faculty
from ..schemas import Collection, FacultyOut
from .common import RESPONSE_OPTIONS, DbSession, not_found

router = APIRouter(prefix="/faculties", tags=["faculties"])


def to_schema(f: Faculty) -> FacultyOut:
    return FacultyOut(
        slug=f.slug, name=f.name, short_name=f.short_name, kind=f.kind, category=f.category,
        summary=f.summary, lead_title=f.lead_title, leader=f.leader, phone=f.phone,
        email=f.email, address=f.address,
        # Department names come from the departments table (same order as on the site).
        departments=[d.name for d in f.departments] or None,
        programs=f.programs or None, source_url=f.source_url,
    )


def _query():
    return select(Faculty).options(selectinload(Faculty.departments))


@router.get("", response_model=Collection[FacultyOut], **RESPONSE_OPTIONS)
def list_faculties(db: DbSession):
    rows = db.scalars(_query().order_by(Faculty.position)).all()
    return Collection(items=[to_schema(f) for f in rows], total=len(rows))


@router.get("/{slug}", response_model=FacultyOut, **RESPONSE_OPTIONS)
def get_faculty(slug: str, db: DbSession):
    f = db.scalars(_query().where(Faculty.slug == slug)).first()
    if f is None:
        raise not_found("Faculty")
    return to_schema(f)
