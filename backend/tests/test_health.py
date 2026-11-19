import pytest

from tests.conftest import HAS_TEST_DB


async def test_liveness(client):
    response = await client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


async def test_request_id_and_security_headers(client):
    response = await client.get("/api/v1/health", headers={"X-Request-ID": "abc12345-test"})
    assert response.headers["X-Request-ID"] == "abc12345-test"
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["X-Frame-Options"] == "DENY"


async def test_invalid_request_id_is_replaced(client):
    response = await client.get("/api/v1/health", headers={"X-Request-ID": "<script>"})
    assert response.headers["X-Request-ID"] != "<script>"
    assert len(response.headers["X-Request-ID"]) == 32


@pytest.mark.skipif(HAS_TEST_DB, reason="needs an unreachable database")
async def test_readiness_reports_db_down(client):
    response = await client.get("/api/v1/health/ready")
    assert response.status_code == 503
    body = response.json()["error"]
    assert body["code"] == "service_unavailable"
    assert body["request_id"] == response.headers["X-Request-ID"]


@pytest.mark.skipif(not HAS_TEST_DB, reason="set TEST_DATABASE_URL to run")
async def test_readiness_with_db(client):
    response = await client.get("/api/v1/health/ready")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
