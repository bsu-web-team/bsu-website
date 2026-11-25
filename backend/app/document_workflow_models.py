"""V8.16: private proposals, approved binary documents, published scope metadata."""
from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Integer, LargeBinary, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .models import Base

class DocumentDraft(Base):
    __tablename__ = 'document_drafts'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey('faculties.id', ondelete='RESTRICT'), nullable=False, index=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    author_id: Mapped[int] = mapped_column(ForeignKey('admin_users.id', ondelete='RESTRICT'), nullable=False)
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey('admin_users.id', ondelete='SET NULL'), nullable=True)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False, default='')
    status: Mapped[str] = mapped_column(String(24), nullable=False, default='draft')
    feedback: Mapped[str] = mapped_column(Text, nullable=False, default='')
    filename: Mapped[str | None] = mapped_column(String(260), nullable=True)
    mime: Mapped[str | None] = mapped_column(String(100), nullable=True)
    data: Mapped[bytes | None] = mapped_column(LargeBinary, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))

class PublishedDocumentFile(Base):
    __tablename__ = 'published_document_files'
    document_id: Mapped[int] = mapped_column(ForeignKey('documents.id', ondelete='CASCADE'), primary_key=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey('faculties.id', ondelete='RESTRICT'), nullable=False, index=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    filename: Mapped[str] = mapped_column(String(260), nullable=False)
    mime: Mapped[str] = mapped_column(String(100), nullable=False)
    data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
