"""Public API behaviour, checked against tests/fixtures/export/."""
import json

import pytest
from sqlalchemy import update

from app.db import SessionLocal
from app.models import News, Staff

from .conftest import FIXTURE_EXPORT

COLLECTIONS = ["faculties", "departments", "staff", "programs", "news", "documents"]


def fixture(name):
    return json.loads((FIXTURE_EXPORT / f"{name}.json").read_text(encoding="utf-8"))


def test_health(client):
    assert client.get("/api/v1/health").json() == {"status": "ok", "database": "ok"}


@pytest.mark.parametrize("name", COLLECTIONS)
def test_collection_is_complete_and_unpaginated(client, name):
    body = client.get(f"/api/v1/{name}").json()
    # The website adapter fails if total > len(items) (see BACKEND_API_CONTRACT_V7_4.md).
    assert body["total"] == len(body["items"]) == len(fixture(name))
    for item in body["items"]:
        assert isinstance(item["slug"], str) and item["slug"]
        assert None not in item.values(), "empty optional fields must be omitted, not null"
        assert "_" not in "".join(item.keys()), "keys must be camelCase"


@pytest.mark.parametrize("name", ["faculties", "departments", "programs", "documents"])
def test_collection_matches_source_data(client, name):
    assert client.get(f"/api/v1/{name}").json()["items"] == fixture(name)


@pytest.mark.parametrize("name", COLLECTIONS)
def test_detail_and_404(client, name):
    first = client.get(f"/api/v1/{name}").json()["items"][0]
    assert client.get(f"/api/v1/{name}/{first['slug']}").json() == first
    missing = client.get(f"/api/v1/{name}/does-not-exist")
    assert missing.status_code == 404


def test_news_newest_first_with_relations(client):
    items = client.get("/api/v1/news").json()["items"]
    assert [n["slug"] for n in items] == ["newest", "middle", "older"]
    newest = items[0]
    assert newest["facultySlug"] == "alpha" and newest["departmentSlug"] == "alpha--one"
    assert newest["content"] == ["Абзац 1", "Абзац 2"] and newest["tags"] == ["наука"]


def test_filters(client):
    def slugs(url, **params):
        return [x["slug"] for x in client.get(url, params=params).json()["items"]]

    assert slugs("/api/v1/news", category="Наука") == ["newest"]
    assert slugs("/api/v1/news", facultySlug="alpha") == ["newest"]
    assert slugs("/api/v1/programs", level="PhD") == ["psy-phd"]
    assert slugs("/api/v1/departments", facultySlug="beta") == ["beta--one"]
    assert slugs("/api/v1/staff", facultySlug="alpha") == ["alpha-leader"]
    assert slugs("/api/v1/documents", category="Абитуриентам") == ["rules"]
    assert client.get("/api/v1/news", params={"category": "Спорт"}).status_code == 422


def test_draft_news_is_hidden(client):
    with SessionLocal.begin() as s:
        s.execute(update(News).where(News.slug == "middle").values(is_published=False))
    try:
        assert "middle" not in [n["slug"] for n in client.get("/api/v1/news").json()["items"]]
        assert client.get("/api/v1/news/middle").status_code == 404
    finally:
        with SessionLocal.begin() as s:
            s.execute(update(News).where(News.slug == "middle").values(is_published=True))


def test_personal_contacts_need_approval(client):
    teacher = client.get("/api/v1/staff/beta-teacher").json()
    assert "personalEmail" not in teacher and "personalPhone" not in teacher
    assert teacher["departmentSlug"] == "beta--one"
    assert teacher["publications"] == [{"title": "Статья"}]
    with SessionLocal.begin() as s:
        s.execute(update(Staff).where(Staff.slug == "beta-teacher").values(contacts_public=True))
    try:
        assert client.get("/api/v1/staff/beta-teacher").json()["personalEmail"] == "private@example.test"
    finally:
        with SessionLocal.begin() as s:
            s.execute(update(Staff).where(Staff.slug == "beta-teacher").values(contacts_public=False))


def test_content(client):
    archive = fixture("archive")
    assert client.get("/api/v1/content/aaa111").json() == archive["aaa111"]
    assert client.get("/api/v1/content/aaa111-ky-1").json()["blocks"][0]["text"] == "Текст ң ө ү"
    # Draft ids keep their public form; "zh-CN" is stored as the archive code "cn".
    assert client.get("/api/v1/content/bbb222-draft-zh-cn").json()["lang"] == "cn"
    assert client.get("/api/v1/content/nope").status_code == 404


def test_openapi_available(client):
    paths = client.get("/openapi.json").json()["paths"]
    for name in COLLECTIONS:
        assert f"/api/v1/{name}" in paths and f"/api/v1/{name}/{{slug}}" in paths
    assert "/api/v1/content/{material_id}" in paths
