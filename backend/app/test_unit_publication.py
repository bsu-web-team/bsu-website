"""V8.14.3: reads ONLY approved snapshots; SQLite in-memory (not PostgreSQL)."""
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from .models import Base, Faculty, Department
from .admin_models import AdminUser
from .unit_profile_models import UnitProfileDraft
from .unit_profile_router import (ProfileIn, DecisionIn, save_profile, submit_profile,
                                  decide_profile, published_profile)


def main():
    engine = create_engine('sqlite+pysqlite:///:memory:')
    Base.metadata.create_all(engine)
    with Session(engine, expire_on_commit=False) as db:
        fac = Faculty(slug='test-fac', name='Faculty', kind='faculty', category='',
                      summary='Original', lead_title='Декан', leader='', source_url='', position=0)
        db.add(fac); db.flush()
        dep = Department(slug='test-dep', name='Department', faculty_id=fac.id, position=0)
        db.add(dep); db.flush()
        faculty_user = AdminUser(username='faculty', role='faculty', faculty_id=fac.id,
                                 password_hash='unused', is_active=True)
        dept_user = AdminUser(username='department', role='department', department_id=dep.id,
                              password_hash='unused', is_active=True)
        ccr = AdminUser(username='ccr', role='ccr', password_hash='unused', is_active=True)
        db.add_all([faculty_user, dept_user, ccr]);db.commit()
        assert published_profile('faculty', fac.slug, db)['published'] is False
        assert published_profile('department', dep.slug, db)['published'] is False
        save_profile(ProfileIn(description='Draft-secret', contact='Secret-contact'), db, faculty_user)
        assert published_profile('faculty', fac.slug, db)['published'] is False
        submit_profile(db, faculty_user)
        assert published_profile('faculty', fac.slug, db)['published'] is False
        item = db.query(UnitProfileDraft).filter_by(owner_key=f'faculty:{fac.id}').one()
        decide_profile(item.id, DecisionIn(approve=True), db, ccr)
        approved = published_profile('faculty', fac.slug, db)
        assert approved == {'published': True, 'description': 'Draft-secret', 'contact': 'Secret-contact'}
        save_profile(ProfileIn(description='NEW SECRET', contact='HIDDEN'), db, faculty_user)
        assert published_profile('faculty', fac.slug, db) == approved
        submit_profile(db, faculty_user)
        assert published_profile('faculty', fac.slug, db) == approved
        decide_profile(item.id, DecisionIn(approve=False, feedback='Revise'), db, ccr)
        assert published_profile('faculty', fac.slug, db) == approved
        save_profile(ProfileIn(description='Dept-approved', contact='Dept-contact'), db, dept_user)
        submit_profile(db, dept_user)
        dep_item = db.query(UnitProfileDraft).filter_by(owner_key=f'department:{dep.id}').one()
        decide_profile(dep_item.id, DecisionIn(approve=True), db, ccr)
        assert published_profile('department', dep.slug, db)['description'] == 'Dept-approved'
        assert published_profile('faculty', fac.slug, db) == approved
        assert db.get(Faculty, fac.id).summary == 'Original'
        print('PASS V8.14.3: public receives only approved snapshots; drafts stay private')
    engine.dispose()

if __name__ == '__main__':
    main()
