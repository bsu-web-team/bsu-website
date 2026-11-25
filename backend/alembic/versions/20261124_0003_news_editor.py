"""Role news_editor and private editorial workflow. Revision ID: 0003_editor; Revises 0002_admin."""
from collections.abc import Sequence
import sqlalchemy as sa
from alembic import op

revision: str = "0003_editor"
down_revision: str | None = "0002_admin"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.drop_constraint("ck_admin_role", "admin_users", type_="check")
    op.drop_constraint("ck_admin_unit_scope", "admin_users", type_="check")
    op.create_check_constraint("ck_admin_role", "admin_users", "role IN ('ccr','faculty','department','news_editor')")
    op.create_check_constraint("ck_admin_unit_scope", "admin_users", "(role IN ('ccr','news_editor') AND faculty_id IS NULL AND department_id IS NULL) OR (role='faculty' AND faculty_id IS NOT NULL AND department_id IS NULL) OR (role='department' AND faculty_id IS NULL AND department_id IS NOT NULL)")
    op.create_table("editorial_items",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("author_id", sa.Integer(), sa.ForeignKey("admin_users.id", ondelete="RESTRICT"), nullable=False),
        sa.Column("title", sa.String(180), nullable=False),
        sa.Column("excerpt", sa.Text(), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("faculty_id", sa.Integer(), sa.ForeignKey("faculties.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("department_id", sa.Integer(), sa.ForeignKey("departments.id", ondelete="RESTRICT"), nullable=True),
        sa.Column("status", sa.String(30), nullable=False),
        sa.Column("feedback", sa.Text(), nullable=False),
        sa.Column("published_news_id", sa.Integer(), sa.ForeignKey("news.id", ondelete="SET NULL"), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("status IN ('draft','submitted','changes_requested','published')", name="ck_editorial_status"),
    )
    op.create_index("ix_editorial_author", "editorial_items", ["author_id"])
    op.create_index("ix_editorial_status", "editorial_items", ["status"])


def downgrade() -> None:
    op.drop_index("ix_editorial_status", table_name="editorial_items")
    op.drop_index("ix_editorial_author", table_name="editorial_items")
    op.drop_table("editorial_items")
    op.drop_constraint("ck_admin_role", "admin_users", type_="check")
    op.drop_constraint("ck_admin_unit_scope", "admin_users", type_="check")
    op.create_check_constraint("ck_admin_role", "admin_users", "role IN ('ccr','faculty','department')")
    op.create_check_constraint("ck_admin_unit_scope", "admin_users", "(role='ccr' AND faculty_id IS NULL AND department_id IS NULL) OR (role='faculty' AND faculty_id IS NOT NULL AND department_id IS NULL) OR (role='department' AND faculty_id IS NULL AND department_id IS NOT NULL)")
