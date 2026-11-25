"""Private staff-review drafts. Existing staff rows are untouched by migration."""
from alembic import op
import sqlalchemy as sa

revision = '0007_staff_drafts'
down_revision = '0006_unit_approval'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('staff_change_drafts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('faculty_id', sa.Integer(), sa.ForeignKey('faculties.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('department_id', sa.Integer(), sa.ForeignKey('departments.id', ondelete='RESTRICT'), nullable=True),
        sa.Column('staff_id', sa.Integer(), sa.ForeignKey('staff.id', ondelete='RESTRICT'), nullable=True),
        sa.Column('name', sa.Text(), nullable=False),
        sa.Column('position', sa.Text(), nullable=False),
        sa.Column('biography', sa.Text(), nullable=False),
        sa.Column('status', sa.String(24), nullable=False),
        sa.Column('feedback', sa.Text(), nullable=False),
        sa.Column('author_id', sa.Integer(), sa.ForeignKey('admin_users.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('reviewed_by', sa.Integer(), sa.ForeignKey('admin_users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("status IN ('draft','submitted','changes_requested','approved')", name='ck_staff_draft_status'))
    op.create_index('ix_staff_change_drafts_faculty_id', 'staff_change_drafts', ['faculty_id'])

def downgrade():
    op.drop_index('ix_staff_change_drafts_faculty_id', table_name='staff_change_drafts')
    op.drop_table('staff_change_drafts')
