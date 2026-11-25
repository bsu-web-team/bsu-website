from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from ..models import Faculty, Staff
from ..schemas import Collection, StaffOut
from .common import RESPONSE_OPTIONS, DbSession, FacultySlugFilter, not_found

router = APIRouter(prefix="/staff", tags=["staff"])


def to_schema(s: Staff) -> StaffOut:
    return StaffOut(
        slug=s.slug, name=s.name, position=s.job_title, faculty_slug=s.faculty.slug,
        faculty_name=s.faculty.name, source_url=s.source_url, photo_url=s.photo_url,
        department_slug=s.department.slug if s.department else None,
        biography=s.biography, publications=s.publications or None,
        # Personal contacts are published only with explicit approval.
        personal_email=s.personal_email if s.contacts_public else None,
        personal_phone=s.personal_phone if s.contacts_public else None,
    )


def _query():
    return (
        select(Staff).join(Staff.faculty)
        .options(joinedload(Staff.faculty), joinedload(Staff.department))
    )


@router.get("", response_model=Collection[StaffOut], **RESPONSE_OPTIONS)
def list_staff(db: DbSession, faculty_slug: FacultySlugFilter = None):
    query = _query()
    if faculty_slug:
        query = query.where(Faculty.slug == faculty_slug)
    rows = db.scalars(query.order_by(Staff.position)).all()
    return Collection(items=[to_schema(s) for s in rows], total=len(rows))


@router.get("/{slug}", response_model=StaffOut, **RESPONSE_OPTIONS)
def get_staff_member(slug: str, db: DbSession):
    s = db.scalars(_query().where(Staff.slug == slug)).first()
    if s is None:
        raise not_found("Staff member")
    return to_schema(s)
