"""Private program proposals; public Program is updated only on CCR approval."""
from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .models import Base

class ProgramDraft(Base):
    __tablename__ = 'program_change_drafts'
    id: Mapped[int] = mapped_column(primary_key=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey('faculties.id', ondelete='RESTRICT'), index=True, nullable=False)
    department_id: Mapped[int | None] = mapped_column(ForeignKey('departments.id', ondelete='RESTRICT'))
    program_id: Mapped[int | None] = mapped_column(ForeignKey('programs.id', ondelete='RESTRICT'))
    author_id: Mapped[int] = mapped_column(ForeignKey('admin_users.id', ondelete='RESTRICT'), nullable=False)
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey('admin_users.id', ondelete='SET NULL'))
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    level: Mapped[str] = mapped_column(String(30), nullable=False)
    code: Mapped[str] = mapped_column(String(50), nullable=False, default='')
    profile: Mapped[str] = mapped_column(Text, nullable=False, default='')
    duration: Mapped[str] = mapped_column(String(100), nullable=False, default='')
    languages: Mapped[str] = mapped_column(String(200), nullable=False, default='')
    description: Mapped[str] = mapped_column(Text, nullable=False, default='')
    status: Mapped[str] = mapped_column(String(24), nullable=False, default='draft')
    feedback: Mapped[str] = mapped_column(Text, nullable=False, default='')
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
