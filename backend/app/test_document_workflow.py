"""Pure SQLite policy tests. No real DB / production server connections."""
from io import BytesIO
from fastapi import HTTPException, UploadFile
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from .models import Base, Faculty
from .admin_models import AdminUser
from .document_workflow_models import DocumentDraft, PublishedDocumentFile
from .document_workflow_router import DocumentIn, DecisionIn, create, update, submit, decide, mine, review, public_list, public_download, own, upload, check_file
import asyncio

def denied(status, fn):
    try: fn()
    except HTTPException as e:
        assert e.status_code==status,(e.status_code,status)
        return
    raise AssertionError(f'Expected HTTP {status}')

async def upload_pdf(item_id, db, user):
    await upload(item_id,db,user,UploadFile(file=BytesIO(b'%PDF-1.7\n%%EOF'),filename='test.pdf'))

def main():
    engine=create_engine('sqlite+pysqlite:///:memory:')
    Base.metadata.create_all(engine)
    with Session(engine,expire_on_commit=False) as db:
        f1=Faculty(slug='one',name='One',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='')
        f2=Faculty(slug='two',name='Two',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='')
        db.add_all([f1,f2]);db.flush()
        author=AdminUser(username='author',password_hash='unused',role='faculty',faculty_id=f1.id,is_active=True)
        stranger=AdminUser(username='stranger',password_hash='unused',role='faculty',faculty_id=f2.id,is_active=True)
        ccr=AdminUser(username='ccr',password_hash='unused',role='ccr',is_active=True)
        db.add_all([author,stranger,ccr]);db.commit()
        body=DocumentIn(title='Устав',category='Нормативные документы',description='Тест')
        doc=create(body,db,author);id=doc['id']
        assert not public_list(db)
        denied(403,lambda:own(db,stranger,id))
        denied(403,lambda:review(db,stranger))
        denied(422,lambda:submit(id,db,author))
        asyncio.run(upload_pdf(id,db,author))
        assert mine(db,author)[0]['hasFile']
        assert not mine(db,stranger)
        assert submit(id,db,author)['status']=='submitted'
        denied(409,lambda:update(id,body,db,author))
        denied(403,lambda:decide(id,DecisionIn(approve=True),db,author))
        denied(422,lambda:decide(id,DecisionIn(approve=False),db,ccr))
        assert not public_list(db)
        assert decide(id,DecisionIn(approve=False,feedback='Исправить'),db,ccr)['status']=='changes_requested'
        assert not public_list(db)
        assert update(id,body,db,author)['status']=='draft'
        submit(id,db,author)
        assert decide(id,DecisionIn(approve=True),db,ccr)['status']=='approved'
        approved=public_list(db)
        assert len(approved)==1 and approved[0]['title']=='Устав'
        assert public_download(approved[0]['id'],db).body.startswith(b'%PDF')
        denied(409,lambda:decide(id,DecisionIn(approve=True),db,ccr))
        denied(415,lambda:check_file('bad.exe',b'%PDF-1.7'))
        denied(415,lambda:check_file('fake.pdf',b'not a pdf'))
        print('PASS V8.16: scope, private drafts, CCR approval, public file, rejection, invalid upload')
    engine.dispose()
if __name__=='__main__':main()
