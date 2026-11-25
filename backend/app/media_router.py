"""Editor-private uploads, CCR-only publication, public images after approval."""
from io import BytesIO
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response
from PIL import Image, UnidentifiedImageError
from sqlalchemy import func, select
from .admin_security import DB, CurrentAdmin
from .editorial_models import EditorialItem
from .editorial_media import EditorialMedia

router = APIRouter(tags=["editorial-media"])
MAX_BYTES = 5 * 1024 * 1024
MAX_FILES = 8
FORMATS = {"JPEG": ("image/jpeg", "jpg"), "PNG": ("image/png", "png"), "WEBP": ("image/webp", "webp")}

def media_json(m: EditorialMedia) -> dict:
    return {"id": m.id, "cover": m.is_cover, "mime": m.mime,
            "url": f"/media/news/editorial-{m.item_id}/{m.id}.{m.extension}"}

def require_item(db, user, item_id: int, *, write: bool = False):
    item = db.get(EditorialItem, item_id)
    if not item: raise HTTPException(404, "Material not found")
    if user.role != "ccr" and item.author_id != user.id: raise HTTPException(403, "No access to media")
    if write and item.status not in ("draft", "changes_requested"): raise HTTPException(409, "Material is locked")
    return item

def safe_image(data: bytes):
    if not data or len(data) > MAX_BYTES: raise HTTPException(413, "Image must be 1 byte to 5 MB")
    try:
        with Image.open(BytesIO(data)) as img:
            if img.format not in FORMATS: raise HTTPException(415, "Only JPEG, PNG and WEBP allowed")
            if img.width * img.height > 25_000_000: raise HTTPException(413, "Image resolution too large")
            kind = img.format
            img.verify()
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise HTTPException(415, "Invalid image file")
    return FORMATS[kind]

@router.post("/admin-editorial/items/{item_id}/media", status_code=201)
async def upload(item_id: int, db: DB, user: CurrentAdmin, file: UploadFile = File(...), cover: bool = Form(False)):
    item = require_item(db, user, item_id, write=True)
    count = db.scalar(select(func.count()).select_from(EditorialMedia).where(EditorialMedia.item_id == item_id))
    if count >= MAX_FILES: raise HTTPException(409, "Maximum 8 images per news item")
    # Read only up to max+1, never load an unbounded upload into memory.
    data = await file.read(MAX_BYTES + 1)
    mime, extension = safe_image(data)
    if count == 0 or cover:
        for old in db.scalars(select(EditorialMedia).where(EditorialMedia.item_id == item_id)):
            old.is_cover = False
    media = EditorialMedia(item_id=item.id, mime=mime, extension=extension, data=data,
                          is_cover=(count == 0 or cover))
    db.add(media)
    db.commit()
    db.refresh(media)
    return media_json(media)

@router.post("/admin-editorial/items/{item_id}/media/{media_id}/cover")
def set_cover(item_id: int, media_id: int, db: DB, user: CurrentAdmin):
    require_item(db, user, item_id, write=True)
    media = db.scalar(select(EditorialMedia).where(EditorialMedia.id == media_id, EditorialMedia.item_id == item_id))
    if not media: raise HTTPException(404, "Media not found")
    for row in db.scalars(select(EditorialMedia).where(EditorialMedia.item_id == item_id)):
        row.is_cover = (row.id == media.id)
    db.commit()
    return {"ok": True}

@router.delete("/admin-editorial/items/{item_id}/media/{media_id}")
def remove(item_id: int, media_id: int, db: DB, user: CurrentAdmin):
    require_item(db, user, item_id, write=True)
    media = db.scalar(select(EditorialMedia).where(EditorialMedia.id == media_id, EditorialMedia.item_id == item_id))
    if not media: raise HTTPException(404, "Media not found")
    was_cover = media.is_cover
    db.delete(media)
    db.flush()
    if was_cover:
        first = db.scalar(select(EditorialMedia).where(EditorialMedia.item_id == item_id).order_by(EditorialMedia.id))
        if first: first.is_cover = True
    db.commit()
    return {"ok": True}

@router.get("/admin-editorial/items/{item_id}/media/{media_id}")
def private_media(item_id: int, media_id: int, db: DB, user: CurrentAdmin):
    require_item(db, user, item_id)
    media = db.scalar(select(EditorialMedia).where(EditorialMedia.id == media_id, EditorialMedia.item_id == item_id))
    if not media: raise HTTPException(404, "Media not found")
    return Response(media.data, media_type=media.mime, headers={"Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff"})

def public_item(db, slug: str):
    if not slug.startswith("editorial-") or not slug[10:].isdigit(): raise HTTPException(404, "Not found")
    item = db.get(EditorialItem, int(slug[10:]))
    if not item or item.status != "published" or item.published_news_id is None:
        raise HTTPException(404, "Not found")
    return item

@router.get("/news/{slug}/gallery")
def gallery(slug: str, db: DB):
    item = public_item(db, slug)
    rows = db.scalars(select(EditorialMedia).where(EditorialMedia.item_id == item.id).order_by(EditorialMedia.id)).all()
    return {"items": [media_json(m) for m in rows]}

@router.get("/news/{slug}/media/{media_id}")
def public_media(slug: str, media_id: int, db: DB):
    item = public_item(db, slug)
    media = db.scalar(select(EditorialMedia).where(EditorialMedia.id == media_id, EditorialMedia.item_id == item.id))
    if not media: raise HTTPException(404, "Not found")
    return Response(media.data, media_type=media.mime, headers={"Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff"})
