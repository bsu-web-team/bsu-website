"""Isolated SQLite tests. No PostgreSQL or network is contacted."""
from fastapi import HTTPException
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from .models import Base, Faculty, Department, Program
from .admin_models import AdminUser
from .program_workflow_models import ProgramDraft
from .program_workflow_router import ProgramIn, DecisionIn, create, update, submit, review, decide, mine

def denied(code,fn):
    try:fn()
    except HTTPException as e:
        assert e.status_code==code,(code,e.status_code,e.detail)
        return
    raise AssertionError(f'Expected HTTP {code}')

def main():
    engine=create_engine('sqlite+pysqlite:///:memory:')
    Base.metadata.create_all(engine)
    with Session(engine,expire_on_commit=False) as db:
        f1=Faculty(slug='f1',name='Faculty 1',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='',position=0)
        f2=Faculty(slug='f2',name='Faculty 2',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='',position=1)
        db.add_all([f1,f2]);db.flush()
        dept=Department(slug='dept',name='Department',faculty_id=f1.id,position=0);db.add(dept);db.flush()
        old=Program(slug='existing',title='Original',level='Бакалавриат',faculty_id=f1.id,position=0,source_url='')
        db.add(old);db.flush()
        u1=AdminUser(username='f1',role='faculty',faculty_id=f1.id,password_hash='test',is_active=True)
        u2=AdminUser(username='f2',role='faculty',faculty_id=f2.id,password_hash='test',is_active=True)
        du=AdminUser(username='du',role='department',department_id=dept.id,password_hash='test',is_active=True)
        ccr=AdminUser(username='ccr',role='ccr',password_hash='test',is_active=True)
        db.add_all([u1,u2,du,ccr]);db.commit()
        first=create(ProgramIn(programId=old.id,title='Edited',level='Магистратура'),db,u1)
        denied(403,lambda:create(ProgramIn(programId=old.id,title='Hack',level='PhD'),db,u2))
        denied(403,lambda:create(ProgramIn(programId=old.id,title='Hack',level='PhD'),db,du))
        denied(403,lambda:review(db,u1))
        denied(403,lambda:decide(first['id'],DecisionIn(approve=True),db,u1))
        assert db.get(Program,old.id).title=='Original'
        update(first['id'],ProgramIn(programId=old.id,title='Updated',level='PhD',description='New'),db,u1)
        denied(403,lambda:update(first['id'],ProgramIn(programId=old.id,title='No',level='PhD'),db,u2))
        submit(first['id'],db,u1)
        denied(409,lambda:update(first['id'],ProgramIn(programId=old.id,title='No',level='PhD'),db,u1))
        denied(422,lambda:decide(first['id'],DecisionIn(approve=False),db,ccr))
        assert db.get(Program,old.id).title=='Original'
        decide(first['id'],DecisionIn(approve=False,feedback='Fix'),db,ccr)
        assert db.get(Program,old.id).title=='Original'
        update(first['id'],ProgramIn(programId=old.id,title='Final',level='PhD',description='Approved'),db,u1)
        submit(first['id'],db,u1);decide(first['id'],DecisionIn(approve=True),db,ccr)
        assert db.get(Program,old.id).title=='Final'
        assert db.get(Program,old.id).description=='Approved'
        denied(409,lambda:decide(first['id'],DecisionIn(approve=True),db,ccr))
        fresh=create(ProgramIn(title='New',level='Бакалавриат'),db,du)
        assert len(db.scalars(select(Program)).all())==1
        submit(fresh['id'],db,du)
        assert len(db.scalars(select(Program)).all())==1
        decide(fresh['id'],DecisionIn(approve=True),db,ccr)
        assert len(db.scalars(select(Program)).all())==2
        assert len(mine(db,du)['drafts'])==1
        assert len(mine(db,u2)['drafts'])==0
        print('PASS V8.17: isolation, CCR decisions, draft edit, no pre-approval publication')
    engine.dispose()

if __name__=='__main__':main()
