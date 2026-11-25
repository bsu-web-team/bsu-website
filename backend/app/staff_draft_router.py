"""Staff proposals; scoped by verified role, only CCR publishes to test staff table."""
from datetime import datetime, timezone
from uuid import uuid4
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from .admin_security import DB, CurrentAdmin
from .models import Faculty, Department, Staff
from .staff_draft_models import StaffDraft
from .staff_photo_models import StaffDraftPhoto, StaffPublicPhoto

router = APIRouter(prefix='/admin-staff', tags=['admin-staff'])

class StaffIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    staffId: int | None = None
    name: str = Field(min_length=1, max_length=300)
    position: str = Field(min_length=1, max_length=300)
    biography: str = Field(default='', max_length=12000)

class DecisionIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    approve: bool
    feedback: str = Field(default='', max_length=4000)

def owner(db, user):
    if user.role == 'faculty' and user.faculty_id:
        unit = db.get(Faculty, user.faculty_id)
        if not unit: raise HTTPException(403, 'Faculty missing')
        return unit.id, None
    if user.role == 'department' and user.department_id:
        unit = db.get(Department, user.department_id)
        if not unit: raise HTTPException(403, 'Department missing')
        return unit.faculty_id, unit.id
    raise HTTPException(403, 'Faculty or department role required')

def scoped_staff(query, faculty_id, department_id):
    query = query.where(Staff.faculty_id == faculty_id)
    if department_id is not None: query = query.where(Staff.department_id == department_id)
    return query

def entry(x):
    return {'id': x.id, 'staffId': x.staff_id, 'name': x.name, 'position': x.position,
            'biography': x.biography, 'facultyId': x.faculty_id, 'departmentId': x.department_id,
            'status': x.status, 'feedback': x.feedback, 'hasPhoto': x.photo is not None, 'updatedAt': x.updated_at.isoformat()}

def original(x):
    return {'id':x.id, 'name':x.name, 'position':x.job_title, 'biography':x.biography or '',
            'facultyId':x.faculty_id, 'departmentId':x.department_id,
            'photoUrl':x.photo_url, 'slug':x.slug}

@router.get('/mine')
def mine(db: DB, user: CurrentAdmin):
    fid, did = owner(db,user)
    staff = db.scalars(scoped_staff(select(Staff),fid,did).order_by(Staff.position, Staff.id)).all()
    query = select(StaffDraft).where(StaffDraft.faculty_id == fid)
    if did is None: query = query.where(StaffDraft.department_id.is_(None))
    else: query = query.where(StaffDraft.department_id == did)
    rows = db.scalars(query.order_by(StaffDraft.updated_at.desc())).all()
    return {'staff':[original(s) for s in staff], 'drafts':[entry(x) for x in rows]}

@router.post('/drafts', status_code=201)
def save_draft(body: StaffIn, db: DB, user: CurrentAdmin):
    fid,did = owner(db,user)
    name,position = body.name.strip(),body.position.strip()
    if not name or not position: raise HTTPException(422,'Name and position are required')
    if body.staffId is not None:
        staff = db.get(Staff,body.staffId)
        if not staff or staff.faculty_id != fid or (did is not None and staff.department_id != did):
            raise HTTPException(403,'Staff outside your unit')
        waiting = db.scalar(select(StaffDraft.id).where(StaffDraft.staff_id == staff.id, StaffDraft.status == 'submitted'))
        if waiting: raise HTTPException(409,'This staff member already has a pending submission')
    draft = StaffDraft(faculty_id=fid,department_id=did,staff_id=body.staffId,
                       name=name,position=position,biography=body.biography.strip(),
                       status='draft',feedback='',author_id=user.id,updated_at=datetime.now(timezone.utc))
    db.add(draft);db.commit();db.refresh(draft)
    return entry(draft)

@router.put('/drafts/{item_id}')
def update_draft(item_id: int, body: StaffIn, db: DB, user: CurrentAdmin):
    fid, did = owner(db, user)
    item = db.scalar(select(StaffDraft).where(StaffDraft.id == item_id).with_for_update())
    if item is None:
        raise HTTPException(404, 'Draft not found')
    if item.author_id != user.id or item.faculty_id != fid or item.department_id != did:
        raise HTTPException(403, 'Not your draft')
    if item.status not in ('draft', 'changes_requested'):
        raise HTTPException(409, 'Only editable drafts can be changed')
    # Changing target staff member when editing a proposal is forbidden.
    if item.staff_id != body.staffId:
        raise HTTPException(422, 'Cannot change target employee')
    if item.staff_id is not None:
        staff = db.get(Staff, item.staff_id)
        if not staff or staff.faculty_id != fid or (did is not None and staff.department_id != did):
            raise HTTPException(403, 'Staff outside your unit')
    name, position = body.name.strip(), body.position.strip()
    if not name or not position:
        raise HTTPException(422, 'Name and position are required')
    item.name = name
    item.position = position
    item.biography = body.biography.strip()
    item.status = 'draft'
    item.feedback = ''
    item.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return entry(item)

@router.post('/drafts/{item_id}/submit')
def submit(item_id: int, db: DB, user: CurrentAdmin):
    fid,did = owner(db,user)
    item = db.scalar(select(StaffDraft).where(StaffDraft.id == item_id).with_for_update())
    if not item: raise HTTPException(404,'Draft not found')
    if item.author_id != user.id or item.faculty_id != fid or item.department_id != did:
        raise HTTPException(403,'Not your draft')
    if item.status not in ('draft','changes_requested'): raise HTTPException(409,'Draft not editable')
    if item.staff_id is not None:
        s = db.get(Staff,item.staff_id)
        if not s or s.faculty_id != fid or (did is not None and s.department_id != did):
            raise HTTPException(409,'Staff moved outside your unit')
        other = db.scalar(select(StaffDraft.id).where(StaffDraft.staff_id == s.id,
                    StaffDraft.status == 'submitted', StaffDraft.id != item.id))
        if other: raise HTTPException(409,'Another submission is pending')
    item.status='submitted';item.feedback='';item.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(item);return entry(item)

@router.get('/review')
def review(db: DB, user: CurrentAdmin):
    if user.role != 'ccr':raise HTTPException(403,'CCR only')
    items = db.scalars(select(StaffDraft).order_by(StaffDraft.updated_at.desc())).all()
    return [entry(x) for x in items]

@router.post('/drafts/{item_id}/decision')
def decide(item_id: int, body: DecisionIn, db: DB, user: CurrentAdmin):
    if user.role != 'ccr':raise HTTPException(403,'CCR only')
    item = db.scalar(select(StaffDraft).where(StaffDraft.id == item_id).with_for_update())
    if not item:raise HTTPException(404,'Draft not found')
    if item.status != 'submitted':raise HTTPException(409,'Not submitted')
    if body.approve:
        if item.staff_id:
            staff = db.get(Staff,item.staff_id)
            if not staff or staff.faculty_id != item.faculty_id or (item.department_id is not None and staff.department_id != item.department_id):
                raise HTTPException(409,'Staff ownership changed')
            staff.name=item.name;staff.job_title=item.position;staff.biography=item.biography
        else:
            # UUID slug avoids collisions; no personal contacts or arbitrary image URLs.
            staff=Staff(slug=f'editorial-staff-{uuid4().hex}',name=item.name,job_title=item.position,
                        biography=item.biography,faculty_id=item.faculty_id,department_id=item.department_id,
                        position=9999,source_url='',contacts_public=False)
            db.add(staff);db.flush();item.staff_id=staff.id
        # The approved image is isolated from pending draft photos.
        photo = db.get(StaffDraftPhoto, item.id)
        if photo is not None:
            published = db.get(StaffPublicPhoto, staff.id)
            if published is None:
                db.add(StaffPublicPhoto(staff_id=staff.id, mime=photo.mime, data=photo.data))
            else:
                published.mime=photo.mime
                published.data=photo.data
            # The same-origin Next route serves approved images from the test API.
            staff.photo_url=f'/api/staff-photo-public?slug={staff.slug}'
        item.status='approved';item.feedback=""
    else:
        if not body.feedback.strip():raise HTTPException(422,'Reason required')
        item.status='changes_requested';item.feedback=body.feedback.strip()
    item.reviewed_by=user.id;item.updated_at=datetime.now(timezone.utc)
    db.commit();db.refresh(item);return entry(item)
