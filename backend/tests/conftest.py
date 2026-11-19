import os

import pytest
from httpx import ASGITransport, AsyncClient

# Point tests at TEST_DATABASE_URL if provided; otherwise use an unreachable DB so that
# DB-dependent tests are skipped explicitly rather than hitting a developer database.
os.environ.setdefault("ENVIRONMENT", "test")
os.environ["DATABASE_URL"] = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+asyncpg://nobody:nobody@127.0.0.1:1/none"
)

from app.main import create_app  # noqa: E402

HAS_TEST_DB = "TEST_DATABASE_URL" in os.environ


@pytest.fixture
async def client():
    from app.db.session import get_engine

    app = create_app()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    await get_engine().dispose()
