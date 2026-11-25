"""Test setup: a separate PostgreSQL database (default `bsu_test`), migrated with
Alembic and filled with the small dataset in tests/fixtures/export/.

Start PostgreSQL first:  docker compose up -d db   (from the repository root)
Override the database with TEST_DATABASE_URL if needed.
"""
import os
from pathlib import Path

# Must be set before `app` is imported: app.db creates its engine from settings.
TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL", "postgresql://bsu:bsu_local_password@127.0.0.1:5432/bsu_test"
)
os.environ["DATABASE_URL"] = TEST_DATABASE_URL

import pytest  # noqa: E402
from alembic import command  # noqa: E402
from alembic.config import Config  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy import create_engine, text  # noqa: E402
from sqlalchemy.engine import make_url  # noqa: E402

from app.config import settings  # noqa: E402

BACKEND_DIR = Path(__file__).resolve().parent.parent
FIXTURE_EXPORT = BACKEND_DIR / "tests" / "fixtures" / "export"


def _create_database_if_missing() -> None:
    url = make_url(settings.sqlalchemy_url)
    admin = create_engine(url.set(database="postgres"), isolation_level="AUTOCOMMIT")
    try:
        with admin.connect() as conn:
            exists = conn.execute(text("SELECT 1 FROM pg_database WHERE datname = :n"), {"n": url.database}).scalar()
            if not exists:
                conn.execute(text(f'CREATE DATABASE "{url.database}"'))
    finally:
        admin.dispose()


def seed(source: Path = FIXTURE_EXPORT) -> dict[str, int]:
    from app.db import SessionLocal
    from app.seed import load

    with SessionLocal.begin() as session:
        return load(session, source)


@pytest.fixture(scope="session", autouse=True)
def database():
    _create_database_if_missing()
    config = Config(str(BACKEND_DIR / "alembic.ini"))
    config.set_main_option("script_location", str(BACKEND_DIR / "alembic"))
    command.downgrade(config, "base")  # start from an empty schema
    command.upgrade(config, "head")  # the migrations themselves are under test
    seed()
    yield
    from app.db import engine

    engine.dispose()


@pytest.fixture(scope="session")
def client():
    from app.main import app

    with TestClient(app) as test_client:
        yield test_client
