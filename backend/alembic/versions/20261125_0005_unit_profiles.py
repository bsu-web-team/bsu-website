"""Private unit-profile drafts. Revision ID: 0005_unit_profiles, down revision: 0004_media."""
from alembic import op
import sqlalchemy as sa

revision = '0005_unit_profiles'
down_revision = '0004_media'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('unit_profile_drafts',
        sa.Column('id', sa.Integer(), primary_key=True),
        sa.Column('owner_key', sa.String(128), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('contact', sa.Text(), nullable=False),
        sa.Column('status', sa.String(24), nullable=False),
        sa.Column('edited_by', sa.Integer(), sa.ForeignKey('admin_users.id', ondelete='RESTRICT'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=False),
        sa.CheckConstraint("status IN ('draft','submitted','changes_requested','approved')", name='ck_unit_profile_status'))
    op.create_index('ix_unit_profile_drafts_owner_key', 'unit_profile_drafts', ['owner_key'], unique=True)

def downgrade():
    op.drop_index('ix_unit_profile_drafts_owner_key', table_name='unit_profile_drafts')
    op.drop_table('unit_profile_drafts')
