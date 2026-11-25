"""SQLite-only security smoke checks. Does not access PostgreSQL."""
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from fastapi import HTTPException
from .models import Base
from .admin_models import AdminUser
from .unit_profile_models import UnitProfileDraft
from .unit_profile_router import own_key, my_profile, save_profile, ProfileIn

def must_deny(f):
    try: f()
    except HTTPException as exc:
        assert exc.status_code == 403, f'Expected 403, got {exc.status_code}'
        return
    raise AssertionError('Expected 403')

def main():
    engine = create_engine('sqlite+pysqlite:///:memory:')
    Base.metadata.create_all(engine)
    with Session(engine, expire_on_commit=False) as db:
        a = AdminUser(username='faculty-a', password_hash='unused', role='faculty', faculty_id=1, is_active=True)
        b = AdminUser(username='faculty-b', password_hash='unused', role='faculty', faculty_id=2, is_active=True)
        d = AdminUser(username='department-a', password_hash='unused', role='department', department_id=1, is_active=True)
        editor = AdminUser(username='editor', password_hash='unused', role='news_editor', is_active=True)
        ccr = AdminUser(username='ccr', password_hash='unused', role='ccr', is_active=True)
        db.add_all([a,b,d,editor,ccr]); db.commit()
        assert own_key(a) == 'faculty:1'
        assert own_key(b) == 'faculty:2'
        assert own_key(d) == 'department:1'
        must_deny(lambda: own_key(editor))
        must_deny(lambda: own_key(ccr))
        data = save_profile(ProfileIn(description='Описание факультета А', contact='101'), db, a)
        assert data['status'] == 'draft' and data['ownerKey'] == 'faculty:1'
        assert my_profile(db, b)['description'] == ''
        assert my_profile(db, d)['description'] == ''
        save_profile(ProfileIn(description='Описание факультета Б', contact='202'), db, b)
        save_profile(ProfileIn(description='Кафедра', contact='303'), db, d)
        assert my_profile(db, a)['description'] == 'Описание факультета А'
        assert db.scalars(select(UnitProfileDraft)).all().__len__() == 3
        must_deny(lambda: save_profile(ProfileIn(description='hack'),db,editor))
        must_deny(lambda: my_profile(db,ccr))
        print('PASS V8.14.1: unit drafts persisted separately; role and tenant isolation enforced')
    engine.dispose()

if __name__ == '__main__': main()
