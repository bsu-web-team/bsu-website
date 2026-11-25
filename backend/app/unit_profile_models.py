"""Private drafts and CCR-approved snapshots; public tables remain untouched."""
from datetime import datetime, timezone
from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column
from .models import Base

class UnitProfileDraft(Base):
    __tablename__ = 'unit_profile_drafts'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    owner_key: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False, default='')
    contact: Mapped[str] = mapped_column(Text, nullable=False, default='')
    status: Mapped[str] = mapped_column(String(24), nullable=False, default='draft')
    feedback: Mapped[str] = mapped_column(Text, nullable=False, default='')
    approved_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    approved_contact: Mapped[str | None] = mapped_column(Text, nullable=True)
    reviewed_by: Mapped[int | None] = mapped_column(ForeignKey('admin_users.id', ondelete='SET NULL'), nullable=True)
    edited_by: Mapped[int] = mapped_column(ForeignKey('admin_users.id', ondelete='RESTRICT'), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
