"""In-memory smoke: no public image before CCR approval; replacement is atomic."""
from io import BytesIO
from fastapi import HTTPException, UploadFile
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from PIL import Image
import asyncio
from .models import Base, Faculty, Staff
from .admin_models import AdminUser
from .staff_draft_models import StaffDraft
from .staff_photo_models import StaffDraftPhoto, StaffPublicPhoto
from .staff_draft_router import StaffIn,DecisionIn,save_draft,submit,decide,update_draft
from .staff_photo_router import upload_photo, public_photo, private_photo

def main():
 engine=create_engine('sqlite+pysqlite:///:memory:')
 Base.metadata.create_all(engine)
 with Session(engine,expire_on_commit=False) as db:
  fac=Faculty(slug='faculty-test',name='Faculty',kind='faculty',category='',summary='',lead_title='Декан',leader='',source_url='');db.add(fac);db.flush()
  editor=AdminUser(username='f',role='faculty',faculty_id=fac.id,password_hash='unused',is_active=True)
  ccr=AdminUser(username='ccr',role='ccr',password_hash='unused',is_active=True)
  db.add_all([editor,ccr]);db.commit()
  draft=save_draft(StaffIn(name='A',position='Teacher'),db,editor)
  payload=BytesIO();Image.new('RGB',(10,10)).save(payload,format='PNG')
  up=UploadFile(filename='a.png',file=BytesIO(payload.getvalue()))
  asyncio.run(upload_photo(draft['id'],db,editor,up))
  assert private_photo(draft['id'],db,ccr).body==payload.getvalue()
  assert db.get(StaffDraftPhoto,draft['id']) is not None
  try: public_photo('not-yet',db)
  except HTTPException as exc: assert exc.status_code==404
  else: raise AssertionError('Draft photo leaked')
  submit(draft['id'],db,editor)
  try: asyncio.run(upload_photo(draft['id'],db,editor,UploadFile(filename='b.png',file=BytesIO(payload.getvalue()))))
  except HTTPException as exc: assert exc.status_code==409
  else:raise AssertionError('Submitted image was editable')
  result=decide(draft['id'],DecisionIn(approve=True),db,ccr)
  staff=db.get(Staff,result['staffId'])
  assert public_photo(staff.slug,db).body==payload.getvalue()
  assert db.get(StaffPublicPhoto,staff.id) is not None
  draft2=save_draft(StaffIn(staffId=staff.id,name='A',position='Teacher'),db,editor)
  assert public_photo(staff.slug,db).body==payload.getvalue()
  print('PASS V8.15.3: private draft image, CCR-only publish, immutable published version')
 engine.dispose()
if __name__=='__main__':main()
