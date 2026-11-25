"""Editorial drafts are isolated from the public news table until CCR approves."""
from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .models import Base
from .admin_models import AdminUser

class EditorialItem(Base):
    __tablename__ = "editorial_items"
    # Indexes created by migration 0003; declared here so autogenerate keeps them.
    __table_args__ = (
        Index("ix_editorial_author", "author_id"),
        Index("ix_editorial_status", "status"),
    )
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    author_id: Mapped[int] = mapped_column(ForeignKey("admin_users.id", ondelete="RESTRICT"), nullable=False)
    author: Mapped[AdminUser] = relationship(foreign_keys=[author_id])
    media = relationship("EditorialMedia", back_populates="item", order_by="EditorialMedia.id", cascade="all, delete-orphan")
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    excerpt: Mapped[str] = mapped_column(Text, nullable=False, default="")
    body: Mapped[str] = mapped_column(Text, nullable=False)
    category: Mapped[str] = mapped_column(String(100), nullable=False, default="Новости")
    faculty_id: Mapped[int | None] = mapped_column(ForeignKey("faculties.id", ondelete="RESTRICT"), nullable=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey("departments.id", ondelete="RESTRICT"), nullable=True)
    faculty = relationship("Faculty")
    department = relationship("Department")
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="draft")
    feedback: Mapped[str] = mapped_column(Text, nullable=False, default="")
    published_news_id: Mapped[int | None] = mapped_column(ForeignKey("news.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda:datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda:datetime.now(timezone.utc), nullable=False)
