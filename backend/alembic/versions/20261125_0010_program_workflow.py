"""V8.17 program proposals, migrated in test DB only."""
from alembic import op
import sqlalchemy as sa
revision='0010_program_workflow'
down_revision='0009_document_workflow'
branch_labels=None
depends_on=None

def upgrade():
    op.create_table('program_change_drafts',
        sa.Column('id',sa.Integer(),primary_key=True),
        sa.Column('faculty_id',sa.Integer(),sa.ForeignKey('faculties.id',ondelete='RESTRICT'),nullable=False),
        sa.Column('department_id',sa.Integer(),sa.ForeignKey('departments.id',ondelete='RESTRICT')),
        sa.Column('program_id',sa.Integer(),sa.ForeignKey('programs.id',ondelete='RESTRICT')),
        sa.Column('author_id',sa.Integer(),sa.ForeignKey('admin_users.id',ondelete='RESTRICT'),nullable=False),
        sa.Column('reviewed_by',sa.Integer(),sa.ForeignKey('admin_users.id',ondelete='SET NULL')),
        sa.Column('title',sa.String(300),nullable=False),
        sa.Column('level',sa.String(30),nullable=False),
        sa.Column('code',sa.String(50),nullable=False),
        sa.Column('profile',sa.Text(),nullable=False),
        sa.Column('duration',sa.String(100),nullable=False),
        sa.Column('languages',sa.String(200),nullable=False),
        sa.Column('description',sa.Text(),nullable=False),
        sa.Column('status',sa.String(24),nullable=False),
        sa.Column('feedback',sa.Text(),nullable=False),
        sa.Column('updated_at',sa.DateTime(timezone=True),nullable=False),
        sa.CheckConstraint("level IN ('Бакалавриат','Магистратура','PhD')",name='ck_program_draft_level'),
        sa.CheckConstraint("status IN ('draft','submitted','changes_requested','approved')",name='ck_program_draft_status'))
    op.create_index('ix_program_change_drafts_faculty_id','program_change_drafts',['faculty_id'])

def downgrade():
    op.drop_index('ix_program_change_drafts_faculty_id',table_name='program_change_drafts')
    op.drop_table('program_change_drafts')
