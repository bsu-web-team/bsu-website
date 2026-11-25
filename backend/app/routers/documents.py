from fastapi import APIRouter
from sqlalchemy import select

from ..models import Document
from ..schemas import Collection, DocumentCategory, DocumentOut
from .common import RESPONSE_OPTIONS, DbSession, not_found

router = APIRouter(prefix="/documents", tags=["documents"])


def to_schema(d: Document) -> DocumentOut:
    return DocumentOut(
        slug=d.slug, title=d.title, category=d.category, description=d.description,
        source_url=d.source_url, format=d.format, status=d.status,
    )


@router.get("", response_model=Collection[DocumentOut], **RESPONSE_OPTIONS)
def list_documents(db: DbSession, category: DocumentCategory | None = None):
    query = select(Document)
    if category:
        query = query.where(Document.category == category)
    rows = db.scalars(query.order_by(Document.position)).all()
    return Collection(items=[to_schema(d) for d in rows], total=len(rows))


@router.get("/{slug}", response_model=DocumentOut, **RESPONSE_OPTIONS)
def get_document(slug: str, db: DbSession):
    d = db.scalars(select(Document).where(Document.slug == slug)).first()
    if d is None:
        raise not_found("Document")
    return to_schema(d)
