"""V8.13: media bytes are transactionally stored in PostgreSQL, not Docker FS."""
from sqlalchemy import Boolean, ForeignKey, Integer, LargeBinary, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .models import Base

class EditorialMedia(Base):
    __tablename__ = "editorial_media"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    item_id: Mapped[int] = mapped_column(ForeignKey("editorial_items.id", ondelete="CASCADE"), nullable=False, index=True)
    mime: Mapped[str] = mapped_column(String(30), nullable=False)
    extension: Mapped[str] = mapped_column(String(5), nullable=False)
    data: Mapped[bytes] = mapped_column(LargeBinary, nullable=False)
    is_cover: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    item = relationship("EditorialItem", back_populates="media")
