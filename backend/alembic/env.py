"""Alembic environment: connects to the database from app settings and
compares it with all SQLAlchemy models (app/models.py and app/*_models.py)."""
from logging.config import fileConfig

from alembic import context
from sqlalchemy import create_engine

from app.config import settings
from app.models import Base

# Every module that defines tables must be imported here. Otherwise
# `alembic revision --autogenerate` treats its tables as removed (DROP TABLE).
from app import admin_models  # noqa: F401
from app import editorial_models  # noqa: F401
from app import editorial_media  # noqa: F401
from app import unit_profile_models  # noqa: F401
from app import staff_draft_models  # noqa: F401
from app import staff_photo_models  # noqa: F401
from app import document_workflow_models  # noqa: F401
from app import program_workflow_models  # noqa: F401
from app import structure_models  # noqa: F401

if context.config.config_file_name is not None:
    fileConfig(context.config.config_file_name)

target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """`alembic upgrade head --sql`: print SQL instead of running it."""
    context.configure(url=settings.sqlalchemy_url, target_metadata=target_metadata, literal_binds=True)
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    engine = create_engine(settings.sqlalchemy_url)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata, compare_type=True)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

