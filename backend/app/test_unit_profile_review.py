"""SQLite in-memory policy checks. Does not contact PostgreSQL."""
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from .models import Base, Faculty
from .admin_models import AdminUser
from .unit_profile_models import UnitProfileDraft
from .unit_profile_router import ProfileIn, DecisionIn, save_profile, submit_profile, decide_profile, my_profile, review_list

def denied(status, fn):
    try:
        fn()
    except HTTPException as exc:
        assert exc.status_code == status, (status, exc.status_code)
        return
    raise AssertionError(f'Expected {status}')

def main():
    engine = create_engine('sqlite+pysqlite:///:memory:')
    Base.metadata.create_all(engine)
    with Session(engine, expire_on_commit=False) as db:
        fac1 = Faculty(slug='a',name='A',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='',position=0)
        fac2 = Faculty(slug='b',name='B',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='',position=1)
        db.add_all([fac1,fac2]);db.flush()
        f = AdminUser(username='f',role='faculty',faculty_id=fac1.id,password_hash='unused',is_active=True)
        other = AdminUser(username='other',role='faculty',faculty_id=fac2.id,password_hash='unused',is_active=True)
        ccr = AdminUser(username='ccr',role='ccr',password_hash='unused',is_active=True)
        editor = AdminUser(username='editor',role='news_editor',password_hash='unused',is_active=True)
        db.add_all([f,other,ccr,editor]);db.commit()
        saved = save_profile(ProfileIn(description='Первый',contact='100'),db,f)
        assert saved['status']=='draft' and my_profile(db,other)['description']==''
        denied(403,lambda:review_list(db,other))
        denied(403,lambda:review_list(db,editor))
        sent = submit_profile(db,f)
        assert sent['status']=='submitted'
        denied(409,lambda:save_profile(ProfileIn(description='hack'),db,f))
        denied(403,lambda:decide_profile(1,DecisionIn(approve=True),db,other))
        denied(422,lambda:decide_profile(1,DecisionIn(approve=False),db,ccr))
        assert review_list(db,ccr)[0]['unitName']=='A'
        item_id=review_list(db,ccr)[0]['id']
        denied(422,lambda:decide_profile(item_id,DecisionIn(approve=False,feedback='   '),db,ccr))
        rejected=decide_profile(item_id,DecisionIn(approve=False,feedback='Добавить контакты'),db,ccr)
        assert rejected['status']=='changes_requested'
        assert save_profile(ProfileIn(description='Второй',contact='200'),db,f)['status']=='draft'
        assert submit_profile(db,f)['status']=='submitted'
        approved=decide_profile(item_id,DecisionIn(approve=True),db,ccr)
        assert approved['approvedDescription']=='Второй' and approved['status']=='approved'
        denied(409,lambda:decide_profile(item_id,DecisionIn(approve=True),db,ccr))
        third=save_profile(ProfileIn(description='Третий',contact='300'),db,f)
        assert third['status']=='draft' and third['approvedDescription']=='Второй'
        print('PASS V8.14.2: CCR approval, return, RBAC and preserved approved snapshot')
    engine.dispose()

if __name__=='__main__': main()
