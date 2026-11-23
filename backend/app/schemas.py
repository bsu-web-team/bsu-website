"""API data shapes (Pydantic). They mirror the TypeScript types the website uses
(see docs/BACKEND_API_CONTRACT_V7_4.md). The same models validate seed data.

Python attributes are snake_case; JSON keys are camelCase (`source_url` <-> `sourceUrl`).
Optional fields that are empty are left out of responses, like optional TS fields.
"""
from datetime import date
from typing import Any, Generic, Literal, TypeVar

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

NewsCategory = Literal["Новости", "Наука", "Международное сотрудничество", "Мероприятия"]
ProgramLevel = Literal["Бакалавриат", "Магистратура", "PhD"]
DocumentCategory = Literal["Нормативные документы", "Наука", "Абитуриентам", "Учебный процесс"]


class ApiModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class FacultyProgram(ApiModel):
    title: str
    degree: str | None = None
    code: str | None = None


class FacultyOut(ApiModel):
    slug: str
    name: str
    short_name: str | None = None
    kind: Literal["faculty", "institute"]
    category: str
    summary: str
    lead_title: Literal["Декан", "Директор"]
    leader: str
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    departments: list[str] | None = None
    programs: list[FacultyProgram] | None = None
    source_url: str


class DepartmentOut(ApiModel):
    slug: str
    name: str
    faculty_slug: str
    faculty_name: str
    faculty_source_url: str


class Publication(ApiModel):
    title: str
    url: str | None = None


class StaffOut(ApiModel):
    slug: str
    name: str
    position: str
    faculty_slug: str
    faculty_name: str
    source_url: str
    photo_url: str | None = None
    department_slug: str | None = None
    biography: str | None = None
    publications: list[Publication] | None = None
    personal_email: str | None = None
    personal_phone: str | None = None


class ProgramOut(ApiModel):
    slug: str
    title: str
    level: ProgramLevel
    faculty_slug: str
    faculty_name: str
    code: str | None = None
    profile: str | None = None
    duration: str | None = None
    languages: str | None = None
    description: str | None = None
    source_url: str


class NewsOut(ApiModel):
    slug: str
    title: str
    date: date
    category: NewsCategory
    excerpt: str
    source_url: str
    image_url: str | None = None
    content: list[str] | None = None
    faculty_slug: str | None = None
    department_slug: str | None = None
    tags: list[str] | None = None


class DocumentOut(ApiModel):
    slug: str
    title: str
    category: DocumentCategory
    description: str
    source_url: str
    format: str
    status: str


class MaterialVariant(BaseModel):
    model_config = ConfigDict(extra="allow")
    id: str
    lang: str
    title: str


class MaterialOut(BaseModel):
    """Archive page. Blocks are passed through as stored ({kind, text?, href?, rows?, links?})."""

    title: str
    lang: Literal["ru", "ky", "en", "cn"]
    blocks: list[dict[str, Any]]
    variants: list[MaterialVariant]


T = TypeVar("T")


class Collection(BaseModel, Generic[T]):
    """Whole collection. `total` always equals len(items): the website adapter
    does not support pagination yet (see the contract)."""

    items: list[T]
    total: int = Field(description="Number of items; equals len(items)")
