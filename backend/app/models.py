"""Database tables (SQLAlchemy ORM models).

Each table has `position`: the order of records in the source data, so the API
returns them in the same order as the website's local data.
Nested lists without their own identity (faculty program list, news paragraphs,
tags, archive blocks) are stored as JSON columns (JSONB in PostgreSQL).
"""
from datetime import date
from typing import Any

from sqlalchemy import JSON, Boolean, Date, ForeignKey, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

# JSONB in PostgreSQL, plain JSON elsewhere (e.g. SQLite in tests).
JSONType = JSON().with_variant(JSONB(), "postgresql")


class Base(DeclarativeBase):
    pass


class Faculty(Base):
    __tablename__ = "faculties"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(200), unique=True, index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    name: Mapped[str] = mapped_column(Text)
    short_name: Mapped[str | None] = mapped_column(String(50))
    kind: Mapped[str] = mapped_column(String(20))  # faculty | institute
    category: Mapped[str] = mapped_column(Text)
    summary: Mapped[str] = mapped_column(Text)
    lead_title: Mapped[str] = mapped_column(String(20))  # Декан | Директор
    leader: Mapped[str] = mapped_column(Text)
    phone: Mapped[str | None] = mapped_column(String(100))
    email: Mapped[str | None] = mapped_column(String(200))
    address: Mapped[str | None] = mapped_column(Text)
    # Display list from the faculty page: [{title, degree?, code?}]
    programs: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONType)
    source_url: Mapped[str] = mapped_column(Text)

    departments: Mapped[list["Department"]] = relationship(
        back_populates="faculty", order_by="Department.position"
    )


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    name: Mapped[str] = mapped_column(Text)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id", ondelete="CASCADE"), index=True)

    faculty: Mapped[Faculty] = relationship(back_populates="departments")


class Staff(Base):
    __tablename__ = "staff"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    name: Mapped[str] = mapped_column(Text)
    job_title: Mapped[str] = mapped_column(Text)  # "position" in the API
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id", ondelete="CASCADE"), index=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id", ondelete="SET NULL"), index=True)
    source_url: Mapped[str] = mapped_column(Text)
    photo_url: Mapped[str | None] = mapped_column(Text)
    biography: Mapped[str | None] = mapped_column(Text)
    publications: Mapped[list[dict[str, Any]] | None] = mapped_column(JSONType)
    # Private data: stored, but published only when contacts_public is true.
    personal_email: Mapped[str | None] = mapped_column(String(200))
    personal_phone: Mapped[str | None] = mapped_column(String(100))
    contacts_public: Mapped[bool] = mapped_column(Boolean, default=False)

    faculty: Mapped[Faculty] = relationship()
    department: Mapped[Department | None] = relationship()


class Program(Base):
    __tablename__ = "programs"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    title: Mapped[str] = mapped_column(Text)
    level: Mapped[str] = mapped_column(String(30), index=True)  # Бакалавриат | Магистратура | PhD
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculties.id", ondelete="CASCADE"), index=True)
    code: Mapped[str | None] = mapped_column(String(50))
    profile: Mapped[str | None] = mapped_column(Text)
    duration: Mapped[str | None] = mapped_column(String(100))
    languages: Mapped[str | None] = mapped_column(String(200))
    description: Mapped[str | None] = mapped_column(Text)
    source_url: Mapped[str] = mapped_column(Text)

    faculty: Mapped[Faculty] = relationship()


class News(Base):
    __tablename__ = "news"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    title: Mapped[str] = mapped_column(Text)
    date: Mapped[date] = mapped_column(Date, index=True)
    category: Mapped[str] = mapped_column(String(100), index=True)
    excerpt: Mapped[str] = mapped_column(Text)
    source_url: Mapped[str] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(Text)
    content: Mapped[list[str] | None] = mapped_column(JSONType)
    tags: Mapped[list[str] | None] = mapped_column(JSONType)
    faculty_id: Mapped[int | None] = mapped_column(ForeignKey("faculties.id", ondelete="SET NULL"), index=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id", ondelete="SET NULL"), index=True)
    # Drafts are never returned by the public API.
    is_published: Mapped[bool] = mapped_column(Boolean, default=True, index=True)

    faculty: Mapped[Faculty | None] = relationship()
    department: Mapped[Department | None] = relationship()


class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(300), unique=True, index=True)
    position: Mapped[int] = mapped_column(Integer, default=0)
    title: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(100), index=True)
    description: Mapped[str] = mapped_column(Text)
    source_url: Mapped[str] = mapped_column(Text)
    format: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(100))


class Material(Base):
    """Archive/content page, addressed by its existing public id (e.g. 8a5edab28263-ky-22ffe)."""

    __tablename__ = "materials"

    id: Mapped[str] = mapped_column(String(100), primary_key=True)
    title: Mapped[str] = mapped_column(Text)
    lang: Mapped[str] = mapped_column(String(5))  # ru | ky | en | cn
    blocks: Mapped[list[dict[str, Any]]] = mapped_column(JSONType)
    variants: Mapped[list[dict[str, Any]]] = mapped_column(JSONType)

# Include administrative mappings in Alembic Base.metadata.


