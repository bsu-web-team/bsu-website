"""Idempotent V8.13 installer for repository root. Extract archive before running."""
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

def patch(path: str, old: str, new: str):
    file = ROOT / path
    data = file.read_text(encoding='utf-8-sig')
    if new in data:
        print('SKIP', path)
        return
    if old not in data:
        raise RuntimeError(f'Source mismatch in {path}: {old[:100]!r}. No changes written to this file.')
    file.write_text(data.replace(old, new), encoding='utf-8')
    print('PATCH', path)

patch('backend/app/editorial_models.py',
      '    author: Mapped[AdminUser] = relationship(foreign_keys=[author_id])',
      '    author: Mapped[AdminUser] = relationship(foreign_keys=[author_id])\n    media = relationship("EditorialMedia", back_populates="item", order_by="EditorialMedia.id", cascade="all, delete-orphan")')
patch('backend/app/editorial_router.py',
      'from .editorial_models import EditorialItem',
      'from .editorial_models import EditorialItem\nfrom .editorial_media import EditorialMedia\nfrom .media_router import media_json')
patch('backend/app/editorial_router.py',
      '            "updatedAt":x.updated_at.isoformat()}',
      '            "updatedAt":x.updated_at.isoformat(), "media": [media_json(m) for m in x.media]}')
patch('backend/app/editorial_router.py',
      '        db.add(public); db.flush()',
      '        cover=next((m for m in item.media if m.is_cover), None)\n        if cover: public.image_url=media_json(cover)["url"]\n        db.add(public); db.flush()')
patch('backend/app/main.py',
      'from . import admin_router, editorial_router',
      'from . import admin_router, editorial_router, media_router')
patch('backend/app/main.py',
      'app.include_router(editorial_router.router, prefix=API_PREFIX)',
      'app.include_router(editorial_router.router, prefix=API_PREFIX)\napp.include_router(media_router.router, prefix=API_PREFIX)')
patch('backend/alembic/env.py',
      'from app import editorial_models  # noqa: F401',
      'from app import editorial_models  # noqa: F401\nfrom app import editorial_media  # noqa: F401')
patch('backend/requirements.txt',
      'alembic==1.20.1',
      'alembic==1.20.1\npython-multipart==0.0.20\nPillow==11.3.0')
patch('src/components/admin/NewsEditorWorkspace.tsx',
      'import Link from "next/link";',
      'import Link from "next/link";\nimport NewsMediaPanel, { type EditorialMedia } from "@/components/admin/NewsMediaPanel";')
patch('src/components/admin/NewsEditorWorkspace.tsx',
      'publishedSlug: string | null };',
      'publishedSlug: string | null; media: EditorialMedia[] };')
patch('src/components/admin/NewsEditorWorkspace.tsx',
      'Фото и медиахранилище пока не подключены.',
      'Фото сохраняются в тестовой PostgreSQL и становятся публичными только после одобрения ЦЦР.')
patch('src/components/admin/NewsEditorWorkspace.tsx',
      '{x.feedback&&<p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm">Замечание ЦЦР: {x.feedback}</p>}',
      '{x.feedback&&<p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm">Замечание ЦЦР: {x.feedback}</p>}\n      <NewsMediaPanel itemId={x.id} media={x.media??[]} readOnly={review || (x.status!=="draft" && x.status!=="changes_requested")} onChanged={refresh} />')
patch('src/components/news/NewsArticleLocalized.tsx',
      'import Link from "next/link";',
      'import Link from "next/link";\nimport NewsPhotoGallery from "@/components/news/NewsPhotoGallery";')
patch('src/components/news/NewsArticleLocalized.tsx',
      '<a href={archiveSourceHref(x.sourceUrl)}',
      '<NewsPhotoGallery slug={x.slug} /><a href={archiveSourceHref(x.sourceUrl)}')
print('V8.13 applied. Run Python compileall, npm tsc/lint, Docker build & isolated DB migration.')
