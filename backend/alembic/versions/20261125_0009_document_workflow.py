"""V8.16 private document proposals and separately approved public files."""
from alembic import op
import sqlalchemy as sa
revision = '0009_document_workflow'
down_revision = '0008_staff_photos'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('document_drafts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('faculty_id', sa.Integer(), sa.ForeignKey('faculties.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('department_id', sa.Integer(), sa.ForeignKey('departments.id', ondelete='RESTRICT')),
        sa.Column('author_id', sa.Integer(), sa.ForeignKey('admin_users.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('reviewed_by', sa.Integer(), sa.ForeignKey('admin_users.id', ondelete='SET NULL')),
        sa.Column('title', sa.String(240), nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('status', sa.String(24), nullable=False),
        sa.Column('feedback', sa.Text(), nullable=False),
        sa.Column('filename', sa.String(260)),
        sa.Column('mime', sa.String(100)),
        sa.Column('data', sa.LargeBinary()),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("status IN ('draft','submitted','changes_requested','approved')", name='ck_document_draft_status'))
    op.create_index('ix_document_drafts_faculty_id', 'document_drafts', ['faculty_id'])
    op.create_table('published_document_files',
        sa.Column('document_id', sa.Integer(), sa.ForeignKey('documents.id', ondelete='CASCADE'), primary_key=True),
        sa.Column('faculty_id', sa.Integer(), sa.ForeignKey('faculties.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('department_id', sa.Integer(), sa.ForeignKey('departments.id', ondelete='RESTRICT')),
        sa.Column('filename', sa.String(260), nullable=False),
        sa.Column('mime', sa.String(100), nullable=False),
        sa.Column('data', sa.LargeBinary(), nullable=False))
    op.create_index('ix_published_document_files_faculty_id', 'published_document_files', ['faculty_id'])

def downgrade():
    op.drop_index('ix_published_document_files_faculty_id', 'published_document_files')
    op.drop_table('published_document_files')
    op.drop_index('ix_document_drafts_faculty_id', 'document_drafts')
    op.drop_table('document_drafts')
