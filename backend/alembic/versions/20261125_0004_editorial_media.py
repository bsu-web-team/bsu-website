"""V8.13 media for editorial drafts. Revision ID: 0004_media; Revises 0003_editor."""
from collections.abc import Sequence
import sqlalchemy as sa
from alembic import op

revision: str = "0004_media"
down_revision: str | None = "0003_editor"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    op.create_table(
        "editorial_media",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("item_id", sa.Integer(), sa.ForeignKey("editorial_items.id", ondelete="CASCADE"), nullable=False),
        sa.Column("mime", sa.String(30), nullable=False),
        sa.Column("extension", sa.String(5), nullable=False),
        sa.Column("data", sa.LargeBinary(), nullable=False),
        sa.Column("is_cover", sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.create_index("ix_editorial_media_item_id", "editorial_media", ["item_id"])

def downgrade() -> None:
    op.drop_index("ix_editorial_media_item_id", table_name="editorial_media")
    op.drop_table("editorial_media")
