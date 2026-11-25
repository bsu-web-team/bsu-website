"""V8.19: scoped proposals, CCR approval and CCR-only editor assignment.
Never deletes units, never migrates/mutates the public database on port 8000.
"""
from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select, func, update
from .admin_security import DB, CurrentAdmin
from .admin_models import AdminUser, AdminSession
from .models import Faculty, Department, Staff, News
from .structure_models import StructureDraft

router = APIRouter(prefix='/admin-structure', tags=['admin-structure'])

class DraftIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    kind: str
    targetId: int | None = Field(default=None, gt=0)
    facultyId: int | None = Field(default=None, gt=0)
    name: str = Field(min_length=1, max_length=300)

class DecisionIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    approve: bool
    feedback: str = Field(default='', max_length=4000)

class AssignIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    role: str
    facultyId: int | None = Field(default=None, gt=0)
    departmentId: int | None = Field(default=None, gt=0)
    active: bool


def ccr(user):
    if user.role != 'ccr': raise HTTPException(403, 'CCR only')

def now(): return datetime.now(timezone.utc)

def description(row):
    return {'id':row.id,'kind':row.kind,'targetId':row.target_id,'facultyId':row.faculty_id,
            'name':row.name,'status':row.status,'feedback':row.feedback,'authorId':row.author_id,
            'updatedAt':row.updated_at.isoformat()}

def validate(db, user, b):
    name=b.name.strip()
    if b.kind not in ('faculty','department') or not name:
        raise HTTPException(422,'Kind and name required')
    if b.kind=='faculty':
        if b.facultyId is not None:raise HTTPException(422,'facultyId is not used for faculty records')
        if b.targetId is None:
            ccr(user) # only CCR can request a new faculty
        else:
            unit=db.get(Faculty,b.targetId)
            if not unit:raise HTTPException(404,'Faculty not found')
            if user.role!='ccr' and (user.role!='faculty' or user.faculty_id!=unit.id):
                raise HTTPException(403,'Faculty outside your scope')
        return name,None
    if b.facultyId is None or not db.get(Faculty,b.facultyId):
        raise HTTPException(422,'Existing faculty required')
    if b.targetId is not None:
        dept=db.get(Department,b.targetId)
        if not dept:raise HTTPException(404,'Department not found')
        # No cross-faculty transfer until every dependent table can be remapped atomically.
        if b.facultyId!=dept.faculty_id:raise HTTPException(409,'Cross-faculty transfer requires a separate data migration')
        if user.role!='ccr':
            if user.role=='faculty' and user.faculty_id==dept.faculty_id:pass
            elif user.role=='department' and user.department_id==dept.id:pass
            else:raise HTTPException(403,'Department outside your scope')
    elif user.role!='ccr' and (user.role!='faculty' or user.faculty_id!=b.facultyId):
        raise HTTPException(403,'Only the faculty account may propose a new department')
    return name,b.facultyId

def owns(db,user,row):
    if row.author_id!=user.id:raise HTTPException(403,'Only the author can edit this draft')
    # Ownership scope still checked after an account's assignment changes.
    payload=DraftIn(kind=row.kind,targetId=row.target_id,facultyId=row.faculty_id,name=row.name)
    validate(db,user,payload)
    return row

@router.get('/catalog')
def catalog(db:DB,user:CurrentAdmin):
    # Do not expose users, passwords or any private contacts.
    fs=db.scalars(select(Faculty).order_by(Faculty.position,Faculty.id)).all()
    ds=db.scalars(select(Department).order_by(Department.position,Department.id)).all()
    if user.role=='faculty':
        fs=[x for x in fs if x.id==user.faculty_id]
        ds=[x for x in ds if x.faculty_id==user.faculty_id]
    elif user.role=='department':
        ds=[x for x in ds if x.id==user.department_id]
        fs=[x for x in fs if x.id in {d.faculty_id for d in ds}]
    elif user.role!='ccr':raise HTTPException(403,'Unit or CCR required')
    return {'faculties':[{'id':x.id,'name':x.name,'slug':x.slug} for x in fs],
            'departments':[{'id':x.id,'name':x.name,'facultyId':x.faculty_id,'slug':x.slug} for x in ds]}

@router.get('/mine')
def mine(db:DB,user:CurrentAdmin):
    if user.role not in ('ccr','faculty','department'):raise HTTPException(403,'Role not supported')
    return [description(x) for x in db.scalars(select(StructureDraft).where(StructureDraft.author_id==user.id).order_by(StructureDraft.updated_at.desc())).all()]

@router.post('/drafts',status_code=201)
def create(b:DraftIn,db:DB,user:CurrentAdmin):
    name,fid=validate(db,user,b)
    row=StructureDraft(kind=b.kind,target_id=b.targetId,faculty_id=fid,name=name,
                       author_id=user.id,status='draft',feedback='')
    db.add(row);db.commit();db.refresh(row);return description(row)

@router.put('/drafts/{draft_id}')
def edit(draft_id:int,b:DraftIn,db:DB,user:CurrentAdmin):
    row=db.scalar(select(StructureDraft).where(StructureDraft.id==draft_id).with_for_update())
    if row is None:raise HTTPException(404,'Draft not found')
    owns(db,user,row)
    if row.status not in ('draft','changes_requested'):raise HTTPException(409,'Draft locked')
    if (row.kind,row.target_id)!=(b.kind,b.targetId):raise HTTPException(422,'Cannot change draft target')
    name,fid=validate(db,user,b)
    row.name=name;row.faculty_id=fid;row.feedback='';row.status='draft';row.updated_at=now()
    db.commit();db.refresh(row);return description(row)

@router.post('/drafts/{draft_id}/submit')
def submit(draft_id:int,db:DB,user:CurrentAdmin):
    row=db.scalar(select(StructureDraft).where(StructureDraft.id==draft_id).with_for_update())
    if row is None:raise HTTPException(404,'Draft not found')
    owns(db,user,row)
    if row.status not in ('draft','changes_requested'):raise HTTPException(409,'Draft locked')
    validate(db,user,DraftIn(kind=row.kind,targetId=row.target_id,facultyId=row.faculty_id,name=row.name))
    if row.target_id is not None:
        other=db.scalar(select(StructureDraft.id).where(StructureDraft.kind==row.kind,
            StructureDraft.target_id==row.target_id,StructureDraft.status=='submitted',StructureDraft.id!=row.id))
        if other:raise HTTPException(409,'Another change is awaiting CCR')
    row.status='submitted';row.updated_at=now();db.commit();db.refresh(row);return description(row)

@router.get('/review')
def review(db:DB,user:CurrentAdmin):
    ccr(user)
    return [description(x) for x in db.scalars(select(StructureDraft).order_by(StructureDraft.updated_at.desc())).all()]

@router.post('/drafts/{draft_id}/decision')
def decision(draft_id:int,b:DecisionIn,db:DB,user:CurrentAdmin):
    ccr(user)
    row=db.scalar(select(StructureDraft).where(StructureDraft.id==draft_id).with_for_update())
    if not row:raise HTTPException(404,'Draft not found')
    if row.status!='submitted':raise HTTPException(409,'Not submitted')
    if b.approve:
        if row.kind=='faculty':
            if row.target_id:
                target=db.get(Faculty,row.target_id)
                if not target:raise HTTPException(409,'Faculty missing')
                target.name=row.name
            else:
                db.add(Faculty(slug='approved-faculty-'+uuid4().hex,position=9999,name=row.name,
                    short_name=None,kind='faculty',category='',summary='',lead_title='Декан',leader='',
                    phone=None,email=None,address=None,programs=[],source_url=''))
        else:
            target_f=db.get(Faculty,row.faculty_id)
            if not target_f:raise HTTPException(409,'Faculty missing')
            if row.target_id:
                target=db.get(Department,row.target_id)
                if not target:raise HTTPException(409,'Department missing')
                if target.faculty_id!=row.faculty_id:
                    raise HTTPException(409,'Cross-faculty transfer requires a separate data migration')
                target.faculty_id=row.faculty_id;target.name=row.name
            else:
                db.add(Department(slug='approved-department-'+uuid4().hex,position=9999,
                                  name=row.name,faculty_id=row.faculty_id))
        row.status='approved';row.feedback=''
    else:
        if not b.feedback.strip():raise HTTPException(422,'Reason required')
        row.status='changes_requested';row.feedback=b.feedback.strip()
    row.reviewed_by=user.id;row.updated_at=now();db.commit();db.refresh(row);return description(row)

@router.get('/users')
def list_users(db:DB,user:CurrentAdmin):
    ccr(user)
    return [{'id':x.id,'username':x.username,'role':x.role,'facultyId':x.faculty_id,
             'departmentId':x.department_id,'active':x.is_active}
             for x in db.scalars(select(AdminUser).order_by(AdminUser.username)).all()]

@router.put('/users/{user_id}/assignment')
def assign(user_id:int,b:AssignIn,db:DB,user:CurrentAdmin):
    ccr(user)
    target=db.scalar(select(AdminUser).where(AdminUser.id==user_id).with_for_update())
    if target is None:raise HTTPException(404,'User not found')
    if target.id==user.id:raise HTTPException(409,'Cannot change your own account')
    if b.role not in ('ccr','faculty','department','news_editor'):
        raise HTTPException(422,'Invalid role')
    if b.role=='faculty':
        if b.facultyId is None or b.departmentId is not None or db.get(Faculty,b.facultyId) is None:
            raise HTTPException(422,'Valid faculty assignment required')
        fid,did=b.facultyId,None
    elif b.role=='department':
        dept=db.get(Department,b.departmentId) if b.departmentId else None
        if dept is None or b.facultyId is not None:
            raise HTTPException(422,'Valid department assignment required')
        fid,did=None,dept.id
    else:
        if b.facultyId is not None or b.departmentId is not None:
            raise HTTPException(422,'This role cannot have an assigned unit')
        fid,did=None,None
    if target.role=='ccr' and (b.role!='ccr' or not b.active):
        remaining=db.scalar(select(func.count()).select_from(AdminUser).where(
            AdminUser.role=='ccr',AdminUser.is_active.is_(True),AdminUser.id!=target.id))
        if not remaining:raise HTTPException(409,'Cannot disable the last active CCR')
    target.role=b.role;target.faculty_id=fid;target.department_id=did;target.is_active=b.active
    # Old permissions must not survive in already issued sessions.
    db.execute(update(AdminSession).where(AdminSession.user_id==target.id).values(revoked=True))
    db.commit()
    return {'ok':True,'id':target.id,'role':target.role,'active':target.is_active}
