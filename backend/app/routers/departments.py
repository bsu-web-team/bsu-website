from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from ..models import Department, Faculty
from ..schemas import Collection, DepartmentOut
from .common import RESPONSE_OPTIONS, DbSession, FacultySlugFilter, not_found

router = APIRouter(prefix="/departments", tags=["departments"])


def to_schema(d: Department) -> DepartmentOut:
    return DepartmentOut(
        slug=d.slug, name=d.name, faculty_slug=d.faculty.slug,
        faculty_name=d.faculty.name, faculty_source_url=d.faculty.source_url,
    )


def _query():
    # JOIN faculties in the same SQL query instead of one query per department (N+1).
    return select(Department).join(Department.faculty).options(joinedload(Department.faculty))


@router.get("", response_model=Collection[DepartmentOut], **RESPONSE_OPTIONS)
def list_departments(db: DbSession, faculty_slug: FacultySlugFilter = None):
    query = _query()
    if faculty_slug:
        query = query.where(Faculty.slug == faculty_slug)
    rows = db.scalars(query.order_by(Faculty.position, Department.position)).all()
    return Collection(items=[to_schema(d) for d in rows], total=len(rows))


@router.get("/{slug}", response_model=DepartmentOut, **RESPONSE_OPTIONS)
def get_department(slug: str, db: DbSession):
    d = db.scalars(_query().where(Department.slug == slug)).first()
    if d is None:
        raise not_found("Department")
    return to_schema(d)
