"""Staff photo draft and approved binary stores. Test DB migration only."""
from alembic import op
import sqlalchemy as sa
revision = '0008_staff_photos'
down_revision = '0007_staff_drafts'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('staff_draft_photos',
        sa.Column('draft_id',sa.Integer(),sa.ForeignKey('staff_change_drafts.id',ondelete='CASCADE'),primary_key=True),
        sa.Column('mime',sa.String(30),nullable=False),
        sa.Column('data',sa.LargeBinary(),nullable=False))
    op.create_table('staff_public_photos',
        sa.Column('staff_id',sa.Integer(),sa.ForeignKey('staff.id',ondelete='CASCADE'),primary_key=True),
        sa.Column('mime',sa.String(30),nullable=False),
        sa.Column('data',sa.LargeBinary(),nullable=False))

def downgrade():
    op.drop_table('staff_public_photos')
    op.drop_table('staff_draft_photos')
