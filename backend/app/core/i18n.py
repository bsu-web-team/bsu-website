"""Locale handling shared with the frontend (src/lib/i18n.ts): ru, ky, en, zh-CN."""

from enum import StrEnum

from fastapi import Header, Query

from app.core.errors import AppError


class Locale(StrEnum):
    RU = "ru"
    KY = "ky"
    EN = "en"
    ZH_CN = "zh-CN"


DEFAULT_LOCALE = Locale.RU
SUPPORTED_LOCALES: tuple[Locale, ...] = (Locale.RU, Locale.KY, Locale.EN, Locale.ZH_CN)

# Lower-cased aliases seen in the legacy archive (e.g. "cn") and in browsers.
_ALIASES: dict[str, Locale] = {
    "ru": Locale.RU,
    "ru-ru": Locale.RU,
    "rus": Locale.RU,
    "ky": Locale.KY,
    "ky-kg": Locale.KY,
    "kg": Locale.KY,
    "kgz": Locale.KY,
    "kir": Locale.KY,
    "en": Locale.EN,
    "en-us": Locale.EN,
    "en-gb": Locale.EN,
    "eng": Locale.EN,
    "zh-cn": Locale.ZH_CN,
    "zh": Locale.ZH_CN,
    "cn": Locale.ZH_CN,
    "zh-hans": Locale.ZH_CN,
    "zh-hans-cn": Locale.ZH_CN,
    "chi": Locale.ZH_CN,
    "zho": Locale.ZH_CN,
}


def normalize_locale(value: str | None) -> Locale | None:
    """Map any known spelling to a canonical Locale, or None if unknown."""
    if not value:
        return None
    return _ALIASES.get(value.strip().replace("_", "-").lower())


def parse_accept_language(header: str | None) -> Locale | None:
    """Pick the best supported locale from an Accept-Language header."""
    if not header:
        return None
    candidates: list[tuple[float, int, str]] = []
    for index, part in enumerate(header.split(",")[:20]):
        tag, _, params = part.strip().partition(";")
        quality = 1.0
        if params.strip().startswith("q="):
            try:
                quality = float(params.strip()[2:])
            except ValueError:
                quality = 0.0
        if tag and quality > 0:
            candidates.append((-quality, index, tag))
    for _, _, tag in sorted(candidates):
        locale = normalize_locale(tag) or normalize_locale(tag.split("-")[0])
        if locale:
            return locale
    return None


def get_locale(
    lang: str | None = Query(
        default=None,
        description="Content language: ru, ky, en, zh-CN (aliases like cn/kg are accepted).",
        examples=["ru"],
    ),
    accept_language: str | None = Header(default=None, include_in_schema=False),
) -> Locale:
    """FastAPI dependency: ?lang= → Accept-Language → default (ru)."""
    if lang is not None:
        locale = normalize_locale(lang)
        if locale is None:
            raise AppError(
                400,
                f"Unsupported language '{lang}'",
                code="unsupported_language",
                details={"supported": [loc.value for loc in SUPPORTED_LOCALES]},
            )
        return locale
    return parse_accept_language(accept_language) or DEFAULT_LOCALE
