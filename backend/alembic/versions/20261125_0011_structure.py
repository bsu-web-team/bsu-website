"""V8.19 private structure draft table only; existing units and accounts untouched."""
from alembic import op
import sqlalchemy as sa
revision = '0011_structure'
down_revision = '0010_program_workflow'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('structure_change_drafts',
        sa.Column('id',sa.Integer(),primary_key=True),
        sa.Column('kind',sa.String(20),nullable=False),
        sa.Column('target_id',sa.Integer()),
        sa.Column('faculty_id',sa.Integer(),sa.ForeignKey('faculties.id',ondelete='RESTRICT')),
        sa.Column('name',sa.String(300),nullable=False),
        sa.Column('status',sa.String(24),nullable=False),
        sa.Column('feedback',sa.Text(),nullable=False),
        sa.Column('author_id',sa.Integer(),sa.ForeignKey('admin_users.id',ondelete='RESTRICT'),nullable=False),
        sa.Column('reviewed_by',sa.Integer(),sa.ForeignKey('admin_users.id',ondelete='SET NULL')),
        sa.Column('updated_at',sa.DateTime(timezone=True),nullable=False),
        sa.CheckConstraint("kind IN ('faculty','department')",name='ck_structure_kind'),
        sa.CheckConstraint("status IN ('draft','submitted','changes_requested','approved')",name='ck_structure_status'))
    op.create_index('ix_structure_drafts_status','structure_change_drafts',['status'])

def downgrade():
    op.drop_index('ix_structure_drafts_status',table_name='structure_change_drafts')
    op.drop_table('structure_change_drafts')
