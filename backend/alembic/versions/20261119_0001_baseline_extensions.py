"""Baseline: PostgreSQL extensions used for search.

Revision ID: 0001
Revises:
Create Date: 2026-11-19
"""
from collections.abc import Sequence

from alembic import op

revision: str = "0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    # Trigram similarity for fuzzy title search (works for ru/ky/en/zh-CN alike).
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")


def downgrade() -> None:
    op.execute("DROP EXTENSION IF EXISTS pg_trgm")
