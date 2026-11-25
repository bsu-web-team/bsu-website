"""Private pending structure edits. Existing public records remain unchanged until CCR approval."""
from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .models import Base

class StructureDraft(Base):
    __tablename__ = 'structure_change_drafts'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    kind: Mapped[str] = mapped_column(String(20), nullable=False)  # faculty / department
    target_id: Mapped[int | None] = mapped_column(Integer)
    faculty_id: Mapped[int | None] = mapped_column(ForeignKey('faculties.id', ondelete='RESTRICT'))
    name: Mapped[str] = mapped_column(String(300), nullable=False)
    status: Mapped[str] = mapped_column(String(24), nullable=False, default='draft')
    feedback: Mapped[str] = mapped_column(Text, nullable=False, default='')
    author_id: Mapped[int] = mapped_column(ForeignKey('admin_users.id', ondelete='RESTRICT'), nullable=False)
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey('admin_users.id', ondelete='SET NULL'))
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
