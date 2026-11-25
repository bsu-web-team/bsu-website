"""V8.17: scoped curriculum proposals with CCR-only publication to the test DB."""
from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from .admin_security import DB, CurrentAdmin
from .models import Faculty, Department, Program
from .program_workflow_models import ProgramDraft

router = APIRouter(prefix='/admin-program-workflow', tags=['program-workflow'])
LEVELS = {'Бакалавриат', 'Магистратура', 'PhD'}

class ProgramIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    programId: int | None = Field(default=None, gt=0)
    title: str = Field(min_length=1, max_length=300)
    level: str = Field(max_length=30)
    code: str = Field(default='', max_length=50)
    profile: str = Field(default='', max_length=4000)
    duration: str = Field(default='', max_length=100)
    languages: str = Field(default='', max_length=200)
    description: str = Field(default='', max_length=12000)

class DecisionIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    approve: bool
    feedback: str = Field(default='', max_length=4000)

def scope(db, user):
    if user.role == 'faculty' and user.faculty_id is not None:
        if not db.get(Faculty, user.faculty_id): raise HTTPException(403, 'Faculty unavailable')
        return user.faculty_id, None
    if user.role == 'department' and user.department_id is not None:
        d = db.get(Department, user.department_id)
        if not d: raise HTTPException(403, 'Department unavailable')
        return d.faculty_id, d.id
    raise HTTPException(403, 'Faculty or department role required')

def program_info(item):
    return {'id':item.id, 'title':item.title, 'level':item.level,
            'code':item.code or '', 'profile':item.profile or '', 'duration':item.duration or '',
            'languages':item.languages or '', 'description':item.description or '',
            'facultyId':item.faculty_id, 'slug':item.slug}

def draft_info(item):
    return {'id':item.id, 'programId':item.program_id, 'title':item.title, 'level':item.level,
            'code':item.code, 'profile':item.profile, 'duration':item.duration,
            'languages':item.languages, 'description':item.description,
            'facultyId':item.faculty_id, 'departmentId':item.department_id,
            'status':item.status,'feedback':item.feedback,'updatedAt':item.updated_at.isoformat()}

def validate(body: ProgramIn):
    if body.level not in LEVELS or not body.title.strip():
        raise HTTPException(422, 'Title and level are required')

def ensure_program(db, fid, did, pid):
    if pid is None:return None
    # Programs currently have faculty_id, but no department_id. Department authors may
    # propose new faculty programs; editing an existing faculty-wide program is denied.
    if did is not None:raise HTTPException(403, 'Department cannot edit faculty-wide program')
    program=db.get(Program,pid)
    if program is None or program.faculty_id != fid:
        raise HTTPException(403, 'Program is outside your faculty')
    return program

def own(db, user, item_id, write=False):
    row=db.get(ProgramDraft,item_id)
    if row is None:raise HTTPException(404, 'Draft not found')
    if user.role != 'ccr':
        fid,did=scope(db,user)
        if (row.faculty_id,row.department_id,row.author_id)!=(fid,did,user.id):
            raise HTTPException(403, 'Not your draft')
    if write and (user.role=='ccr' or row.status not in ('draft','changes_requested')):
        raise HTTPException(409, 'Draft locked for review')
    return row

@router.get('/mine')
def mine(db: DB,user: CurrentAdmin):
    fid,did=scope(db,user)
    q=select(Program).where(Program.faculty_id==fid).order_by(Program.position,Program.id)
    programs=db.scalars(q).all()
    q=select(ProgramDraft).where(ProgramDraft.faculty_id==fid,ProgramDraft.author_id==user.id)
    q=q.where(ProgramDraft.department_id.is_(None) if did is None else ProgramDraft.department_id==did)
    drafts=db.scalars(q.order_by(ProgramDraft.updated_at.desc())).all()
    return {'programs':[program_info(p) for p in programs], 'drafts':[draft_info(d) for d in drafts],
            'canEditExisting':did is None}

@router.post('/drafts',status_code=201)
def create(body: ProgramIn,db: DB,user: CurrentAdmin):
    fid,did=scope(db,user)
    validate(body)
    ensure_program(db,fid,did,body.programId)
    row=ProgramDraft(faculty_id=fid,department_id=did,program_id=body.programId,
            author_id=user.id,title=body.title.strip(),level=body.level,code=body.code.strip(),
            profile=body.profile.strip(),duration=body.duration.strip(),languages=body.languages.strip(),
            description=body.description.strip(),status='draft',feedback='')
    db.add(row);db.commit();db.refresh(row);return draft_info(row)

@router.put('/drafts/{item_id}')
def update(item_id:int,body:ProgramIn,db:DB,user:CurrentAdmin):
    row=own(db,user,item_id,write=True)
    validate(body)
    if body.programId != row.program_id:
        raise HTTPException(422, 'Cannot change proposal target')
    ensure_program(db,row.faculty_id,row.department_id,row.program_id)
    for field,value in [('title',body.title),('code',body.code),('profile',body.profile),
                        ('duration',body.duration),('languages',body.languages),('description',body.description)]:
        setattr(row,field,value.strip())
    row.level=body.level
    row.status='draft';row.feedback='';row.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(row);return draft_info(row)

@router.post('/drafts/{item_id}/submit')
def submit(item_id:int,db:DB,user:CurrentAdmin):
    row=own(db,user,item_id,write=True)
    if row.program_id is not None:ensure_program(db,row.faculty_id,row.department_id,row.program_id)
    if row.program_id is not None:
        other=db.scalar(select(ProgramDraft.id).where(ProgramDraft.program_id==row.program_id,
            ProgramDraft.status=='submitted',ProgramDraft.id!=row.id))
        if other:raise HTTPException(409,'Another submission is already pending for this program')
    row.status='submitted';row.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(row);return draft_info(row)

@router.get('/review')
def review(db:DB,user:CurrentAdmin):
    if user.role!='ccr':raise HTTPException(403,'CCR only')
    return [draft_info(x) for x in db.scalars(select(ProgramDraft).order_by(ProgramDraft.updated_at.desc())).all()]

@router.post('/drafts/{item_id}/decision')
def decide(item_id:int,body:DecisionIn,db:DB,user:CurrentAdmin):
    if user.role!='ccr':raise HTTPException(403,'CCR only')
    row=db.scalar(select(ProgramDraft).where(ProgramDraft.id==item_id).with_for_update())
    if row is None:raise HTTPException(404,'Draft missing')
    if row.status!='submitted':raise HTTPException(409,'Only submitted drafts can be reviewed')
    if body.approve:
        if row.program_id is not None:
            program=db.get(Program,row.program_id)
            if program is None or program.faculty_id!=row.faculty_id:
                raise HTTPException(409,'Program moved or removed')
        else:
            if db.get(Faculty,row.faculty_id) is None:raise HTTPException(409,'Faculty unavailable')
            if row.department_id is not None:
                dept=db.get(Department,row.department_id)
                if not dept or dept.faculty_id!=row.faculty_id:
                    raise HTTPException(409,'Department moved or removed')
            program=Program(slug='approved-program-'+uuid4().hex,position=9999,
                   faculty_id=row.faculty_id,source_url='',title=row.title,level=row.level)
            db.add(program);db.flush();row.program_id=program.id
        program.title=row.title;program.level=row.level;program.code=row.code or None
        program.profile=row.profile or None;program.duration=row.duration or None
        program.languages=row.languages or None;program.description=row.description or None
        row.status='approved';row.feedback=''
    else:
        if not body.feedback.strip():raise HTTPException(422,'Reason required for rejection')
        row.status='changes_requested';row.feedback=body.feedback.strip()
    row.reviewed_by=user.id;row.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(row);return draft_info(row)
