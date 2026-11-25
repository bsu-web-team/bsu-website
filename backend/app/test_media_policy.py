"""V8.13 isolated SQLite smoke test. No PostgreSQL access."""
import asyncio
from io import BytesIO
from fastapi import HTTPException, UploadFile
from PIL import Image
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from .models import Base, News
from .admin_models import AdminUser
from .editorial_models import EditorialItem
from .editorial_media import EditorialMedia
from .editorial_router import DraftIn, DecisionIn, create_item, submit, decide
from .media_router import upload, private_media, public_media, gallery, remove

def deny(code, callback):
    try: callback()
    except HTTPException as exc:
        assert exc.status_code == code, (code, exc.status_code)
        return
    raise AssertionError(f'Expected HTTP {code}')

def main():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine, expire_on_commit=False) as db:
        editor = AdminUser(username="media-editor", password_hash="unused", role="news_editor", is_active=True)
        other = AdminUser(username="media-other", password_hash="unused", role="news_editor", is_active=True)
        ccr = AdminUser(username="media-ccr", password_hash="unused", role="ccr", is_active=True)
        db.add_all([editor, other, ccr]); db.commit()
        item = create_item(DraftIn(title="Media test", body="Image test"), db, editor)
        item_id = item["id"]
        stream = BytesIO()
        Image.new("RGB", (80, 60), (24, 80, 140)).save(stream, format="JPEG")
        stream.seek(0)
        response = asyncio.run(upload(item_id, db, editor, UploadFile(filename="photo.jpg", file=stream), False))
        media_id = response["id"]
        assert response["cover"]
        deny(403, lambda: private_media(item_id, media_id, db, other))
        deny(404, lambda: public_media(f"editorial-{item_id}", media_id, db))
        assert db.scalar(select(News).where(News.slug == f"editorial-{item_id}")) is None
        submit(item_id, db, editor)
        deny(409, lambda: remove(item_id, media_id, db, editor))
        deny(404, lambda: gallery(f"editorial-{item_id}", db))
        decide(item_id, DecisionIn(approve=True), db, ccr)
        published = db.scalar(select(News).where(News.slug == f"editorial-{item_id}"))
        assert published is not None and published.image_url == response["url"]
        assert public_media(f"editorial-{item_id}", media_id, db).media_type == "image/jpeg"
        assert len(gallery(f"editorial-{item_id}", db)["items"]) == 1
        print("PASS V8.13: private draft media, CCR-only publication, public gallery after approval")
    engine.dispose()

if __name__ == "__main__": main()
