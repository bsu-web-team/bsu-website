from fastapi import Depends

from app.core.pagination import Page, PageParams, get_page_params
from app.main import create_app


async def test_not_found_format(client):
    response = await client.get("/api/v1/does-not-exist")
    assert response.status_code == 404
    error = response.json()["error"]
    assert error["code"] == "not_found"
    assert error["request_id"]


async def test_cors_allows_configured_origin_only(client):
    ok = await client.options(
        "/api/v1/health",
        headers={"Origin": "http://localhost:3000", "Access-Control-Request-Method": "GET"},
    )
    assert ok.headers.get("access-control-allow-origin") == "http://localhost:3000"
    bad = await client.options(
        "/api/v1/health",
        headers={"Origin": "https://evil.example", "Access-Control-Request-Method": "GET"},
    )
    assert "access-control-allow-origin" not in bad.headers


async def test_validation_and_unhandled_errors():
    from httpx import ASGITransport, AsyncClient

    app = create_app()

    @app.get("/_test/paged", response_model=Page[int])
    async def paged(params: PageParams = Depends(get_page_params)) -> Page[int]:
        items = list(range(params.offset, min(params.offset + params.limit, 45)))
        return Page[int].build(items, params, total=45)

    @app.get("/_test/boom")
    async def boom() -> None:
        raise RuntimeError("secret internal detail")

    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        page = await ac.get("/_test/paged", params={"page": 3, "limit": 20})
        assert page.json() == {
            "items": [40, 41, 42, 43, 44],
            "page": 3,
            "limit": 20,
            "total": 45,
            "pages": 3,
        }

        invalid = await ac.get("/_test/paged", params={"limit": 500})
        assert invalid.status_code == 422
        error = invalid.json()["error"]
        assert error["code"] == "validation_error"
        assert error["details"][0]["field"] == "query.limit"

        crash = await ac.get("/_test/boom")
        assert crash.status_code == 500
        assert crash.json()["error"]["code"] == "internal_error"
        assert "secret" not in crash.text
