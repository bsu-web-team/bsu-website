"""Non-destructive smoke checks for private editorial workflow: python -m app.test_editorial_policy.
Creates an IN-MEMORY SQLite database; never reads or writes PostgreSQL.
"""
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import Base, News
from .admin_models import AdminUser
from .editorial_models import EditorialItem
from .editorial_router import DraftIn, DecisionIn, create_item, update_item, submit, decide


def must_deny(expected, call):
    try: call()
    except HTTPException as exc:
        assert exc.status_code == expected, f"Expected {expected}, got {exc.status_code}"
        return
    raise AssertionError(f"Expected HTTP {expected}")


def main():
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine, expire_on_commit=False) as db:
        editor = AdminUser(username="editor-test", password_hash="unused", role="news_editor", is_active=True)
        other = AdminUser(username="other-test", password_hash="unused", role="news_editor", is_active=True)
        ccr = AdminUser(username="ccr-test", password_hash="unused", role="ccr", is_active=True)
        db.add_all([editor,other,ccr]);db.commit()
        draft = DraftIn(title="Тестовая новость", body="Полный текст тестовой новости", category="Новости")
        item = create_item(draft, db, editor)
        assert item["status"] == "draft"
        assert db.scalar(select(News).where(News.slug == f'editorial-{item["id"]}')) is None
        must_deny(403, lambda: update_item(item["id"],draft,db,other))
        must_deny(403, lambda: decide(item["id"],DecisionIn(approve=True),db,editor))
        sent = submit(item["id"],db,editor)
        assert sent["status"] == "submitted"
        assert db.scalar(select(News).where(News.slug == f'editorial-{item["id"]}')) is None
        must_deny(403, lambda: decide(item["id"],DecisionIn(approve=True),db,editor))
        must_deny(409, lambda: update_item(item["id"],draft,db,editor))
        published = decide(item["id"],DecisionIn(approve=True),db,ccr)
        assert published["status"] == "published"
        public = db.scalar(select(News).where(News.slug == f'editorial-{item["id"]}'))
        assert public is not None and public.is_published and public.title == draft.title
        must_deny(409,lambda:decide(item["id"],DecisionIn(approve=True),db,ccr))
        print("PASS V8.11: editor can draft and submit, cannot publish; only CCR publishes")
    engine.dispose()

if __name__ == "__main__": main()
