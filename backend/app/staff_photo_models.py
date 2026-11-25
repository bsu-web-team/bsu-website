"""Unapproved draft images and distinct approved public staff images."""
from sqlalchemy import ForeignKey, Integer, LargeBinary, String
from sqlalchemy.orm import Mapped, mapped_column
from .models import Base

class StaffDraftPhoto(Base):
    __tablename__ = 'staff_draft_photos'
    draft_id: Mapped[int] = mapped_column(ForeignKey('staff_change_drafts.id', ondelete='CASCADE'), primary_key=True)
    mime: Mapped[str] = mapped_column(String(30), nullable=False)
    data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)

class StaffPublicPhoto(Base):
    __tablename__ = 'staff_public_photos'
    staff_id: Mapped[int] = mapped_column(ForeignKey('staff.id', ondelete='CASCADE'), primary_key=True)
    mime: Mapped[str] = mapped_column(String(30), nullable=False)
    data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
