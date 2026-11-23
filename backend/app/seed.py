"""Load the website's data export into the database.

1. From the repository root, export the website data:
       node scripts/export-backend.cjs        -> creates backend-export/
2. From backend/, import it:
       python -m app.seed --source ../backend-export

The import REPLACES all content in the database in one transaction: if anything
fails (invalid record, unknown faculty), nothing is changed. Every record is
validated with the same Pydantic models the API uses.
"""
import argparse
import json
import sys
from pathlib import Path
from typing import Any

from pydantic import BaseModel, TypeAdapter
from sqlalchemy import delete
from sqlalchemy.orm import Session

from .db import SessionLocal
from .models import Department, Document, Faculty, Material, News, Program, Staff
from .schemas import (
    DepartmentOut,
    DocumentOut,
    FacultyOut,
    MaterialOut,
    NewsOut,
    ProgramOut,
    StaffOut,
)


class SeedError(Exception):
    pass


def _read(source: Path, name: str, required: bool = True) -> Any:
    path = source / f"{name}.json"
    if not path.exists():
        if required:
            raise SeedError(f"Missing {path}. Run `node scripts/export-backend.cjs` from the repo root first.")
        return None
    return json.loads(path.read_text(encoding="utf-8"))


def _validate[M: BaseModel](model: type[M], items: list[dict], name: str) -> list[M]:
    try:
        records = TypeAdapter(list[model]).validate_python(items)
    except Exception as error:
        raise SeedError(f"Invalid {name}: {error}") from error
    slugs = [getattr(r, "slug") for r in records]
    duplicates = {s for s in slugs if slugs.count(s) > 1}
    if duplicates:
        raise SeedError(f"Duplicate slugs in {name}: {sorted(duplicates)}")
    return records


def load(session: Session, source: Path, with_content: bool = True) -> dict[str, int]:
    faculties = _validate(FacultyOut, _read(source, "faculties"), "faculties")
    departments = _validate(DepartmentOut, _read(source, "departments"), "departments")
    staff = _validate(StaffOut, _read(source, "staff"), "staff")
    programs = _validate(ProgramOut, _read(source, "programs"), "programs")
    news = _validate(NewsOut, _read(source, "news"), "news")
    documents = _validate(DocumentOut, _read(source, "documents"), "documents")

    materials: dict[str, MaterialOut] = {}
    if with_content:
        for name in ("archive", "integratedContent"):
            raw = _read(source, name, required=(name == "archive")) or {}
            for material_id, value in raw.items():
                # Contract: archive materials use the historical code "cn" for Chinese,
                # while the UI locale is "zh-CN". Some draft files use "zh-CN".
                if value.get("lang") == "zh-CN":
                    print(f"note: {material_id}: lang 'zh-CN' stored as 'cn'")
                    value = {**value, "lang": "cn"}
                try:
                    materials[material_id] = MaterialOut.model_validate(value)
                except Exception as error:
                    raise SeedError(f"Invalid material {material_id}: {error}") from error

    # Faculty department lists must match departments.json (the API builds them from it).
    for f in faculties:
        expected = f.departments or []
        actual = [d.name for d in departments if d.faculty_slug == f.slug]
        if expected != actual:
            raise SeedError(f"Departments of {f.slug} differ between faculties.json and departments.json")

    # Replace everything (children first because of foreign keys).
    for model in (Material, News, Staff, Program, Department, Document, Faculty):
        session.execute(delete(model))

    faculty_by_slug: dict[str, Faculty] = {}
    for i, f in enumerate(faculties):
        row = Faculty(
            slug=f.slug, position=i, name=f.name, short_name=f.short_name, kind=f.kind,
            category=f.category, summary=f.summary, lead_title=f.lead_title, leader=f.leader,
            phone=f.phone, email=f.email, address=f.address,
            programs=[p.model_dump(exclude_none=True) for p in f.programs] if f.programs else None,
            source_url=f.source_url,
        )
        session.add(row)
        faculty_by_slug[f.slug] = row

    def faculty(slug: str, where: str) -> Faculty:
        if slug not in faculty_by_slug:
            raise SeedError(f"{where}: unknown facultySlug '{slug}'")
        return faculty_by_slug[slug]

    department_by_slug: dict[str, Department] = {}
    for i, d in enumerate(departments):
        row = Department(slug=d.slug, position=i, name=d.name, faculty=faculty(d.faculty_slug, d.slug))
        session.add(row)
        department_by_slug[d.slug] = row

    def department(slug: str | None, where: str) -> Department | None:
        if slug is None:
            return None
        if slug not in department_by_slug:
            raise SeedError(f"{where}: unknown departmentSlug '{slug}'")
        return department_by_slug[slug]

    for i, s in enumerate(staff):
        session.add(Staff(
            slug=s.slug, position=i, name=s.name, job_title=s.position,
            faculty=faculty(s.faculty_slug, s.slug), department=department(s.department_slug, s.slug),
            source_url=s.source_url, photo_url=s.photo_url, biography=s.biography,
            publications=[p.model_dump(exclude_none=True) for p in s.publications] if s.publications else None,
            # Imported personal contacts stay private until someone approves publication.
            personal_email=s.personal_email, personal_phone=s.personal_phone, contacts_public=False,
        ))

    for i, p in enumerate(programs):
        session.add(Program(
            slug=p.slug, position=i, title=p.title, level=p.level, faculty=faculty(p.faculty_slug, p.slug),
            code=p.code, profile=p.profile, duration=p.duration, languages=p.languages,
            description=p.description, source_url=p.source_url,
        ))

    for i, n in enumerate(news):
        session.add(News(
            slug=n.slug, position=i, title=n.title, date=n.date, category=n.category,
            excerpt=n.excerpt, source_url=n.source_url, image_url=n.image_url,
            content=n.content, tags=n.tags,
            faculty=faculty(n.faculty_slug, n.slug) if n.faculty_slug else None,
            department=department(n.department_slug, n.slug), is_published=True,
        ))

    for i, d in enumerate(documents):
        session.add(Document(
            slug=d.slug, position=i, title=d.title, category=d.category, description=d.description,
            source_url=d.source_url, format=d.format, status=d.status,
        ))

    for material_id, m in materials.items():
        session.add(Material(
            id=material_id, title=m.title, lang=m.lang, blocks=m.blocks,
            variants=[v.model_dump() for v in m.variants],
        ))

    return {
        "faculties": len(faculties), "departments": len(departments), "staff": len(staff),
        "programs": len(programs), "news": len(news), "documents": len(documents),
        "materials": len(materials),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Import the website data export into the database.")
    parser.add_argument("--source", type=Path, default=Path("../backend-export"), help="Export folder")
    parser.add_argument("--skip-content", action="store_true", help="Do not import archive materials")
    args = parser.parse_args()

    try:
        with SessionLocal.begin() as session:  # commit on success, rollback on any error
            counts = load(session, args.source, with_content=not args.skip_content)
    except SeedError as error:
        print(f"SEED FAILED (database unchanged): {error}", file=sys.stderr)
        return 1
    for name, count in counts.items():
        print(f"{name:12} {count}")
    print("SEED OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
