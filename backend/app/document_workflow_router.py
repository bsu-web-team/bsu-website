"""V8.16 document lifecycle. Public endpoints expose only CCR-approved files."""
from datetime import datetime, timezone
from io import BytesIO
from pathlib import PurePath
from uuid import uuid4
from zipfile import ZipFile, BadZipFile
from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import Response
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from .admin_security import DB, CurrentAdmin
from .models import Faculty, Department, Document
from .document_workflow_models import DocumentDraft, PublishedDocumentFile

router = APIRouter(tags=['document-workflow'])
MAX_BYTES = 10 * 1024 * 1024
CATEGORIES = {'Нормативные документы', 'Наука', 'Абитуриентам', 'Учебный процесс'}
TYPES = {'.pdf': ('application/pdf', 'PDF'), '.docx': ('application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'DOCX'), '.xlsx': ('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'XLSX')}

class DocumentIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    title: str = Field(min_length=1, max_length=240)
    category: str = Field(max_length=100)
    description: str = Field(default='', max_length=6000)

class DecisionIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    approve: bool
    feedback: str = Field(default='', max_length=4000)

def scope(db, user):
    if user.role == 'faculty' and user.faculty_id is not None:
        if not db.get(Faculty, user.faculty_id): raise HTTPException(403, 'Faculty missing')
        return user.faculty_id, None
    if user.role == 'department' and user.department_id is not None:
        dept = db.get(Department, user.department_id)
        if not dept: raise HTTPException(403, 'Department missing')
        return dept.faculty_id, dept.id
    raise HTTPException(403, 'Unit account required')

def own(db, user, item_id, *, writable=False):
    item = db.get(DocumentDraft, item_id)
    if item is None: raise HTTPException(404, 'Document draft not found')
    if user.role != 'ccr':
        fid, did = scope(db, user)
        if item.author_id != user.id or (item.faculty_id, item.department_id) != (fid, did):
            raise HTTPException(403, 'Other user draft')
    if writable and (user.role == 'ccr' or item.status not in ('draft', 'changes_requested')):
        raise HTTPException(409, 'Draft locked')
    return item

def info(x):
    return {'id':x.id,'title':x.title,'category':x.category,'description':x.description,
            'status':x.status,'feedback':x.feedback,'hasFile':x.data is not None,
            'filename':x.filename,'facultyId':x.faculty_id,'departmentId':x.department_id,
            'updatedAt':x.updated_at.isoformat()}

def validated(body):
    title = body.title.strip()
    if not title or body.category not in CATEGORIES: raise HTTPException(422, 'Invalid title or category')
    return title, body.category, body.description.strip()

def check_file(filename: str, data: bytes):
    name = PurePath(filename.replace('\\', '/')).name
    if not name or len(name) > 260 or '/' in name or '\\' in name or any(ord(c)<32 for c in name):
        raise HTTPException(422, 'Invalid filename')
    ext = ('.' + name.rsplit('.',1)[-1]).lower() if '.' in name else ''
    if ext not in TYPES: raise HTTPException(415, 'Only PDF, DOCX and XLSX accepted')
    if not data or len(data)>MAX_BYTES: raise HTTPException(413, 'File must be between 1 byte and 10 MB')
    if ext == '.pdf':
        if not data.startswith(b'%PDF-'): raise HTTPException(415, 'Invalid PDF')
    else:
        try:
            with ZipFile(BytesIO(data)) as z:
                names = z.namelist()
                if len(names)>400 or sum(i.file_size for i in z.infolist())>100*1024*1024:
                    raise HTTPException(413,'Office document too large after decompression')
                expected = 'word/document.xml' if ext=='.docx' else 'xl/workbook.xml'
                if '[Content_Types].xml' not in names or expected not in names:
                    raise HTTPException(415,'Invalid Office document')
                if any(n.endswith('vbaProject.bin') or 'vbaProject.bin' in n for n in names):
                    raise HTTPException(415,'Macro-enabled file not allowed')
        except (BadZipFile, ValueError, RuntimeError):
            raise HTTPException(415, 'Invalid Office document')
    return name, TYPES[ext]

@router.get('/admin-documents/mine')
def mine(db: DB, user: CurrentAdmin):
    fid,did=scope(db,user)
    q=select(DocumentDraft).where(DocumentDraft.faculty_id==fid,DocumentDraft.author_id==user.id)
    q=q.where(DocumentDraft.department_id.is_(None) if did is None else DocumentDraft.department_id==did)
    return [info(x) for x in db.scalars(q.order_by(DocumentDraft.updated_at.desc())).all()]

@router.post('/admin-documents/drafts', status_code=201)
def create(body: DocumentIn, db: DB, user: CurrentAdmin):
    fid,did=scope(db,user)
    title,cat,desc=validated(body)
    item=DocumentDraft(faculty_id=fid,department_id=did,author_id=user.id,title=title,
                       category=cat,description=desc,status='draft',feedback='')
    db.add(item);db.commit();db.refresh(item)
    return info(item)

@router.put('/admin-documents/drafts/{item_id}')
def update(item_id: int, body: DocumentIn, db: DB, user: CurrentAdmin):
    item=own(db,user,item_id,writable=True)
    item.title,item.category,item.description=validated(body)
    item.status='draft';item.feedback='';item.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(item);return info(item)

@router.post('/admin-documents/drafts/{item_id}/file')
async def upload(item_id: int, db: DB, user: CurrentAdmin, file: UploadFile = File(...)):
    item=own(db,user,item_id,writable=True)
    raw=await file.read(MAX_BYTES+1)
    filename,(mime,_)=check_file(file.filename or '',raw)
    item.filename=filename;item.mime=mime;item.data=raw
    item.status='draft';item.feedback='';item.updated_at=datetime.now(timezone.utc)
    db.commit();return {'ok':True,'filename':filename}

@router.get('/admin-documents/drafts/{item_id}/file')
def private_file(item_id: int, db: DB, user: CurrentAdmin):
    item=own(db,user,item_id)
    if item.data is None: raise HTTPException(404,'No attachment')
    return Response(item.data,media_type=item.mime,headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','Content-Disposition':f'attachment; filename="draft-{item.id}{extension(item.filename)}"'})

def extension(filename):
    return ('.'+filename.rsplit('.',1)[-1].lower()) if filename and '.' in filename else '.bin'

@router.post('/admin-documents/drafts/{item_id}/submit')
def submit(item_id: int, db: DB, user: CurrentAdmin):
    item=own(db,user,item_id,writable=True)
    if item.data is None: raise HTTPException(422, 'Upload a file first')
    item.status='submitted';item.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(item);return info(item)

@router.get('/admin-documents/review')
def review(db: DB, user: CurrentAdmin):
    if user.role!='ccr': raise HTTPException(403, 'CCR only')
    return [info(x) for x in db.scalars(select(DocumentDraft).order_by(DocumentDraft.updated_at.desc())).all()]

@router.post('/admin-documents/drafts/{item_id}/decision')
def decide(item_id: int, body: DecisionIn, db: DB, user: CurrentAdmin):
    if user.role!='ccr': raise HTTPException(403, 'CCR only')
    item=db.scalar(select(DocumentDraft).where(DocumentDraft.id==item_id).with_for_update())
    if not item:raise HTTPException(404,'Draft missing')
    if item.status!='submitted':raise HTTPException(409,'Not awaiting CCR')
    if body.approve:
        if item.data is None or not item.mime: raise HTTPException(409, 'Attachment missing')
        ext=extension(item.filename)
        document=Document(slug='approved-document-'+uuid4().hex,title=item.title,
                  category=item.category,description=item.description,
                  source_url='',
                  format=ext[1:].upper(),status='Опубликовано',position=9999)
        db.add(document);db.flush()
        db.add(PublishedDocumentFile(document_id=document.id,faculty_id=item.faculty_id,
              department_id=item.department_id,filename=item.filename,mime=item.mime,data=item.data))
        # Public file URL is derived from the approved document ID.
        document.source_url=f'/api/public-document-file/{document.id}'
        item.status='approved';item.feedback=''
    else:
        if not body.feedback.strip():raise HTTPException(422,'A reason is required')
        item.status='changes_requested';item.feedback=body.feedback.strip()
    item.reviewed_by=user.id;item.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(item);return info(item)

@router.get('/approved-documents')
def public_list(db: DB):
    q=select(Document,PublishedDocumentFile).join(PublishedDocumentFile,Document.id==PublishedDocumentFile.document_id)
    result=[]
    for doc, file in db.execute(q.order_by(Document.id.desc())).all():
        result.append({'id':doc.id,'title':doc.title,'category':doc.category,'description':doc.description,
              'facultyId':file.faculty_id,'departmentId':file.department_id,'filename':file.filename,
              'url':f'/api/public-document-file/{doc.id}'})
    return result

@router.get('/approved-documents/{document_id}/download')
def public_download(document_id: int, db: DB):
    doc=db.get(Document,document_id)
    file=db.get(PublishedDocumentFile,document_id)
    if doc is None or file is None:raise HTTPException(404,'Not published')
    return Response(file.data,media_type=file.mime,
         headers={'Cache-Control':'public, max-age=60','X-Content-Type-Options':'nosniff',
                  'Content-Disposition':f'attachment; filename="bsu-document-{document_id}{extension(file.filename)}"'})
