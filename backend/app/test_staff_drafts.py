"""Self-contained SQLite smoke test: no production Postgres is accessed."""
from fastapi import HTTPException
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from .models import Base, Faculty, Department, Staff
from .admin_models import AdminUser
from .staff_draft_models import StaffDraft
from .staff_draft_router import StaffIn, DecisionIn, mine, save_draft, update_draft, submit, decide, review

def denied(code, fn):
    try:fn()
    except HTTPException as exc:
        assert exc.status_code==code, (code,exc.status_code)
    else:raise AssertionError(f'Expected HTTP {code}')

def main():
    e=create_engine('sqlite+pysqlite:///:memory:')
    Base.metadata.create_all(e)
    with Session(e,expire_on_commit=False) as db:
        a=Faculty(slug='a',name='A',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='')
        b=Faculty(slug='b',name='B',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='')
        db.add_all([a,b]);db.flush()
        dep=Department(slug='d',name='D',faculty_id=a.id);db.add(dep);db.flush()
        s=Staff(slug='s',name='Old',job_title='Teacher',faculty_id=a.id,department_id=dep.id,source_url='',contacts_public=False)
        db.add(s)
        fac=AdminUser(username='fac',role='faculty',faculty_id=a.id,password_hash='unused',is_active=True)
        other=AdminUser(username='other',role='faculty',faculty_id=b.id,password_hash='unused',is_active=True)
        dept=AdminUser(username='dept',role='department',department_id=dep.id,password_hash='unused',is_active=True)
        ccr=AdminUser(username='ccr',role='ccr',password_hash='unused',is_active=True)
        db.add_all([fac,other,dept,ccr]);db.commit()
        assert len(mine(db,fac)['staff'])==1
        assert len(mine(db,other)['staff'])==0
        denied(403,lambda:save_draft(StaffIn(staffId=s.id,name='x',position='x'),db,other))
        d=save_draft(StaffIn(staffId=s.id,name='New',position='Professor',biography='Bio'),db,dept)
        assert db.get(Staff,s.id).name=='Old'
        denied(403,lambda:update_draft(d['id'],StaffIn(staffId=s.id,name='Intruder',position='T'),db,other))
        edited=update_draft(d['id'],StaffIn(staffId=s.id,name='Changed',position='Professor',biography='New bio'),db,dept)
        assert edited['name']=='Changed'
        denied(422,lambda:update_draft(d['id'],StaffIn(name='Wrong target',position='T'),db,dept))
        denied(403,lambda:submit(d['id'],db,other))
        assert submit(d['id'],db,dept)['status']=='submitted'
        denied(409,lambda:update_draft(d['id'],StaffIn(staffId=s.id,name='Locked',position='T'),db,dept))
        denied(403,lambda:review(db,fac))
        denied(422,lambda:decide(d['id'],DecisionIn(approve=False),db,ccr))
        assert decide(d['id'],DecisionIn(approve=False,feedback='Revise'),db,ccr)['status']=='changes_requested'
        assert db.get(Staff,s.id).name=='Old'
        assert update_draft(d['id'],StaffIn(staffId=s.id,name='New',position='Professor',biography='Bio'),db,dept)['status']=='draft'
        assert submit(d['id'],db,dept)['status']=='submitted'
        assert decide(d['id'],DecisionIn(approve=True),db,ccr)['status']=='approved'
        assert db.get(Staff,s.id).name=='New'
        denied(409,lambda:decide(d['id'],DecisionIn(approve=True),db,ccr))
        new=save_draft(StaffIn(name='Another',position='Lecturer'),db,fac)
        submit(new['id'],db,fac)
        decide(new['id'],DecisionIn(approve=True),db,ccr)
        assert db.scalar(select(Staff).where(Staff.name=='Another')) is not None
        assert not db.scalar(select(Staff).where(Staff.name=='Another')).contacts_public
        print('PASS V8.15.2: draft editing, RBAC, locked submissions and review')
    e.dispose()
if __name__=='__main__':main()
