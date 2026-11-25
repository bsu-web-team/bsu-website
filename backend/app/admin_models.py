"""Private administrative identities and opaque hashed sessions.
These tables must NEVER be exported by the public content seed.
"""
from datetime import datetime
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .models import Base, Faculty, Department

class AdminUser(Base):
    __tablename__ = 'admin_users'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(256))
    role: Mapped[str] = mapped_column(String(20))  # ccr | faculty | department
    faculty_id: Mapped[int | None] = mapped_column(ForeignKey('faculties.id', ondelete='RESTRICT'), nullable=True)
    department_id: Mapped[int | None] = mapped_column(ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    faculty: Mapped[Faculty | None] = relationship()
    department: Mapped[Department | None] = relationship()
    sessions: Mapped[list['AdminSession']] = relationship(back_populates='user', cascade='all, delete-orphan')

class AdminSession(Base):
    __tablename__ = 'admin_sessions'
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('admin_users.id', ondelete='CASCADE'), nullable=False, index=True)
    token_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    revoked: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    user: Mapped[AdminUser] = relationship(back_populates='sessions')
