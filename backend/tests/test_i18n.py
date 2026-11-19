import pytest

from app.core.i18n import Locale, normalize_locale, parse_accept_language


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("ru", Locale.RU),
        ("RU", Locale.RU),
        ("ky", Locale.KY),
        ("kg", Locale.KY),
        ("en", Locale.EN),
        ("en-GB", Locale.EN),
        ("zh-CN", Locale.ZH_CN),
        ("cn", Locale.ZH_CN),
        ("zh", Locale.ZH_CN),
        ("zh_CN", Locale.ZH_CN),
        ("fr", None),
        ("", None),
        (None, None),
    ],
)
def test_normalize_locale(raw, expected):
    assert normalize_locale(raw) is expected


@pytest.mark.parametrize(
    ("header", "expected"),
    [
        ("ky-KG,ky;q=0.9,ru;q=0.8", Locale.KY),
        ("fr-FR,fr;q=0.9,en;q=0.5", Locale.EN),
        ("de;q=0.9, zh-CN;q=0.95", Locale.ZH_CN),
        ("en;q=0, ru;q=0.1", Locale.RU),
        ("fr", None),
        ("", None),
        (None, None),
    ],
)
def test_parse_accept_language(header, expected):
    assert parse_accept_language(header) is expected


async def test_locales_endpoint_default(client):
    response = await client.get("/api/v1/locales")
    assert response.status_code == 200
    assert response.json() == {
        "default": "ru",
        "supported": ["ru", "ky", "en", "zh-CN"],
        "resolved": "ru",
    }


async def test_locales_endpoint_query_alias(client):
    response = await client.get("/api/v1/locales", params={"lang": "cn"})
    assert response.json()["resolved"] == "zh-CN"


async def test_locales_endpoint_accept_language(client):
    response = await client.get("/api/v1/locales", headers={"Accept-Language": "ky,ru;q=0.5"})
    assert response.json()["resolved"] == "ky"


async def test_unsupported_language_error(client):
    response = await client.get("/api/v1/locales", params={"lang": "fr"})
    assert response.status_code == 400
    error = response.json()["error"]
    assert error["code"] == "unsupported_language"
    assert error["details"]["supported"] == ["ru", "ky", "en", "zh-CN"]
