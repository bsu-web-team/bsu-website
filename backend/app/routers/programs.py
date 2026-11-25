from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.orm import joinedload

from ..models import Faculty, Program
from ..schemas import Collection, ProgramLevel, ProgramOut
from .common import RESPONSE_OPTIONS, DbSession, FacultySlugFilter, not_found

router = APIRouter(prefix="/programs", tags=["programs"])


def to_schema(p: Program) -> ProgramOut:
    return ProgramOut(
        slug=p.slug, title=p.title, level=p.level, faculty_slug=p.faculty.slug,
        faculty_name=p.faculty.name, code=p.code, profile=p.profile, duration=p.duration,
        languages=p.languages, description=p.description, source_url=p.source_url,
    )


def _query():
    return select(Program).join(Program.faculty).options(joinedload(Program.faculty))


@router.get("", response_model=Collection[ProgramOut], **RESPONSE_OPTIONS)
def list_programs(db: DbSession, faculty_slug: FacultySlugFilter = None, level: ProgramLevel | None = None):
    query = _query()
    if faculty_slug:
        query = query.where(Faculty.slug == faculty_slug)
    if level:
        query = query.where(Program.level == level)
    rows = db.scalars(query.order_by(Program.position)).all()
    return Collection(items=[to_schema(p) for p in rows], total=len(rows))


@router.get("/{slug}", response_model=ProgramOut, **RESPONSE_OPTIONS)
def get_program(slug: str, db: DbSession):
    p = db.scalars(_query().where(Program.slug == slug)).first()
    if p is None:
        raise not_found("Program")
    return to_schema(p)
