"""Isolated staff-change submissions; staff records are updated only by CCR approval."""
from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .models import Base

class StaffDraft(Base):
    __tablename__ = 'staff_change_drafts'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey('faculties.id', ondelete='RESTRICT'), nullable=False, index=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    staff_id: Mapped[int | None] = mapped_column(ForeignKey('staff.id', ondelete='RESTRICT'), nullable=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    position: Mapped[str] = mapped_column(Text, nullable=False)
    biography: Mapped[str] = mapped_column(Text, nullable=False, default='')
    status: Mapped[str] = mapped_column(String(24), nullable=False, default='draft')
    feedback: Mapped[str] = mapped_column(Text, nullable=False, default='')
    author_id: Mapped[int] = mapped_column(ForeignKey('admin_users.id', ondelete='RESTRICT'), nullable=False)
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey('admin_users.id', ondelete='SET NULL'), nullable=True)
    photo = relationship("StaffDraftPhoto", uselist=False, cascade="all, delete-orphan")
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
