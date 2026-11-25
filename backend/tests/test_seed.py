"""The importer validates everything and never leaves a half-imported database."""
import json
import shutil
from pathlib import Path

import pytest

from app.seed import SeedError

from .conftest import FIXTURE_EXPORT, seed

REAL_EXPORT = Path(__file__).resolve().parents[2] / "backend-export"


def broken_copy(tmp_path: Path, name: str, change) -> Path:
    target = tmp_path / "export"
    shutil.copytree(FIXTURE_EXPORT, target)
    path = target / f"{name}.json"
    data = json.loads(path.read_text(encoding="utf-8"))
    change(data)
    path.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    return target


@pytest.mark.parametrize(
    ("name", "change", "message"),
    [
        ("news", lambda d: d[0].update(category="Спорт"), "Invalid news"),
        ("news", lambda d: d[0].update(date="вчера"), "Invalid news"),
        ("programs", lambda d: d[0].update(facultySlug="ghost"), "unknown facultySlug"),
        ("staff", lambda d: d[1].update(departmentSlug="ghost"), "unknown departmentSlug"),
        ("documents", lambda d: d.append(dict(d[0])), "Duplicate slugs"),
        ("departments", lambda d: d.pop(), "Departments of beta differ"),
    ],
)
def test_invalid_data_is_rejected_and_database_unchanged(client, tmp_path, name, change, message):
    before = client.get("/api/v1/news").json()
    with pytest.raises(SeedError, match=message):
        seed(broken_copy(tmp_path, name, change))
    assert client.get("/api/v1/news").json() == before


def test_seed_is_repeatable(client):
    first = seed()
    assert seed() == first
    assert client.get("/api/v1/faculties").json()["total"] == 2


@pytest.mark.skipif(not REAL_EXPORT.exists(), reason="run `node scripts/export-backend.cjs` to enable")
def test_real_website_export_round_trip(client):
    """Full website data: every API response equals the website's own data."""
    try:
        counts = seed(REAL_EXPORT)
        assert counts["materials"] > 0
        for name in ["faculties", "departments", "staff", "programs", "documents", "news"]:
            expected = json.loads((REAL_EXPORT / f"{name}.json").read_text(encoding="utf-8"))
            if name == "news":  # the website shows news newest first
                expected.sort(key=lambda n: n["date"], reverse=True)
            assert client.get(f"/api/v1/{name}").json()["items"] == expected, name
        archive = json.loads((REAL_EXPORT / "archive.json").read_text(encoding="utf-8"))
        for material_id in list(archive)[:50]:
            assert client.get(f"/api/v1/content/{material_id}").json() == archive[material_id]
    finally:
        seed()  # restore the small fixture dataset for other tests
