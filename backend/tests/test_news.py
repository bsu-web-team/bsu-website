"""Run with: pytest"""
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_news_is_sorted_and_limited():
    response = client.get("/api/v1/news", params={"limit": 3})
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 6
    assert len(body["items"]) == 3
    dates = [item["date"] for item in body["items"]]
    assert dates == sorted(dates, reverse=True)
    # JSON keys use camelCase, like the frontend expects.
    assert "sourceUrl" in body["items"][0]
    # Empty optional fields are omitted, not sent as null.
    assert "imageUrl" not in body["items"][0]


def test_filter_by_category():
    response = client.get("/api/v1/news", params={"category": "Наука"})
    items = response.json()["items"]
    assert items and all(item["category"] == "Наука" for item in items)


def test_unknown_category_is_rejected():
    response = client.get("/api/v1/news", params={"category": "Спорт"})
    assert response.status_code == 422


def test_get_one_news():
    response = client.get("/api/v1/news/phd-defense-economics-2026")
    assert response.status_code == 200
    assert response.json()["slug"] == "phd-defense-economics-2026"


def test_missing_news_returns_404():
    response = client.get("/api/v1/news/does-not-exist")
    assert response.status_code == 404
