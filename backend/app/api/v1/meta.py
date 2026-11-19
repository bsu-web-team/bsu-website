from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.core.i18n import DEFAULT_LOCALE, SUPPORTED_LOCALES, Locale, get_locale

router = APIRouter(tags=["meta"])


class LocalesOut(BaseModel):
    default: Locale
    supported: list[Locale]
    resolved: Locale


@router.get("/locales", response_model=LocalesOut, summary="Supported content languages")
async def locales(locale: Locale = Depends(get_locale)) -> LocalesOut:
    """Lists supported languages and shows which one this request resolves to."""
    return LocalesOut(default=DEFAULT_LOCALE, supported=list(SUPPORTED_LOCALES), resolved=locale)
