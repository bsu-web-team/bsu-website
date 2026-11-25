"""Administrative accounts and sessions. Separate from public content data.

Revision ID: 0002_admin
Revises: 0001
"""
from collections.abc import Sequence
import sqlalchemy as sa
from alembic import op
revision: str = '0002_admin'
down_revision: str | None = '0001'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

def upgrade() -> None:
    op.create_table('admin_users',
       sa.Column('id',sa.Integer(),primary_key=True),
       sa.Column('username',sa.String(100),nullable=False),
       sa.Column('password_hash',sa.String(256),nullable=False),
       sa.Column('role',sa.String(20),nullable=False),
       sa.Column('faculty_id',sa.Integer(),sa.ForeignKey('faculties.id',ondelete='RESTRICT'),nullable=True),
       sa.Column('department_id',sa.Integer(),sa.ForeignKey('departments.id',ondelete='RESTRICT'),nullable=True),
       sa.Column('is_active',sa.Boolean(),nullable=False,server_default=sa.true()),
       sa.CheckConstraint("role IN ('ccr','faculty','department')",name='ck_admin_role'),
       sa.CheckConstraint("(role='ccr' AND faculty_id IS NULL AND department_id IS NULL) OR (role='faculty' AND faculty_id IS NOT NULL AND department_id IS NULL) OR (role='department' AND faculty_id IS NULL AND department_id IS NOT NULL)",name='ck_admin_unit_scope')
    )
    op.create_index('ix_admin_users_username','admin_users',['username'],unique=True)
    op.create_table('admin_sessions',
       sa.Column('id',sa.Integer(),primary_key=True),
       sa.Column('user_id',sa.Integer(),sa.ForeignKey('admin_users.id',ondelete='CASCADE'),nullable=False),
       sa.Column('token_hash',sa.String(64),nullable=False),
       sa.Column('expires_at',sa.DateTime(timezone=True),nullable=False),
       sa.Column('revoked',sa.Boolean(),nullable=False,server_default=sa.false()))
    op.create_index('ix_admin_sessions_user_id','admin_sessions',['user_id'])
    op.create_index('ix_admin_sessions_token_hash','admin_sessions',['token_hash'],unique=True)

def downgrade() -> None:
    op.drop_index('ix_admin_sessions_token_hash',table_name='admin_sessions')
    op.drop_index('ix_admin_sessions_user_id',table_name='admin_sessions')
    op.drop_table('admin_sessions')
    op.drop_index('ix_admin_users_username',table_name='admin_users')
    op.drop_table('admin_users')
