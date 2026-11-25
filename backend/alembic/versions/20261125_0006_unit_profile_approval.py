"""CCR review for unit profiles; 0006_unit_approval after 0005_unit_profiles."""
from alembic import op
import sqlalchemy as sa

revision = '0006_unit_approval'
down_revision = '0005_unit_profiles'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('unit_profile_drafts', sa.Column('feedback', sa.Text(), nullable=False, server_default=''))
    op.add_column('unit_profile_drafts', sa.Column('approved_description', sa.Text(), nullable=True))
    op.add_column('unit_profile_drafts', sa.Column('approved_contact', sa.Text(), nullable=True))
    op.add_column('unit_profile_drafts', sa.Column('reviewed_by', sa.Integer(), sa.ForeignKey('admin_users.id', ondelete='SET NULL'), nullable=True))
    op.alter_column('unit_profile_drafts', 'feedback', server_default=None)

def downgrade():
    op.drop_column('unit_profile_drafts', 'reviewed_by')
    op.drop_column('unit_profile_drafts', 'approved_contact')
    op.drop_column('unit_profile_drafts', 'approved_description')
    op.drop_column('unit_profile_drafts', 'feedback')
