"""Private unit-profile review workflow. Never writes into public faculties/departments."""
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from .admin_security import DB, CurrentAdmin
from .admin_models import AdminUser
from .unit_profile_models import UnitProfileDraft
from .models import Faculty, Department

router = APIRouter(prefix='/admin-unit-profiles', tags=['admin-unit-profiles'])

class ProfileIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    description: str = Field(default='', max_length=20000)
    contact: str = Field(default='', max_length=4000)

class DecisionIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    approve: bool
    feedback: str = Field(default='', max_length=4000)

def own_key(user: AdminUser) -> str:
    if user.role == 'faculty' and user.faculty_id is not None:
        return f'faculty:{user.faculty_id}'
    if user.role == 'department' and user.department_id is not None:
        return f'department:{user.department_id}'
    raise HTTPException(403, 'A faculty or department account is required')

def serialize(item: UnitProfileDraft | None, key: str) -> dict:
    return {'ownerKey': key, 'description': item.description if item else '',
            'contact': item.contact if item else '', 'status': item.status if item else 'empty',
            'feedback': item.feedback if item else '',
            'approvedDescription': item.approved_description if item else None,
            'approvedContact': item.approved_contact if item else None,
            'updatedAt': item.updated_at.isoformat() if item else None}

def validate_owner(db, key: str):
    try:
        kind, raw_id = key.split(':', 1)
        unit_id = int(raw_id)
    except (ValueError, TypeError):
        raise HTTPException(422, 'Invalid unit key')
    if kind == 'faculty':
        unit = db.get(Faculty, unit_id)
    elif kind == 'department':
        unit = db.get(Department, unit_id)
    else:
        raise HTTPException(422, 'Invalid unit kind')
    if unit is None:
        raise HTTPException(404, 'Unit missing')
    return {'unitKind': kind, 'unitSlug': unit.slug, 'unitName': unit.name}

@router.get('/published/{kind}/{slug}')
def published_profile(kind: str, slug: str, db: DB):
    # Public route: never return a draft, status, reviewer, or personal data.
    if kind == 'faculty':
        unit = db.scalar(select(Faculty).where(Faculty.slug == slug))
    elif kind == 'department':
        unit = db.scalar(select(Department).where(Department.slug == slug))
    else:
        raise HTTPException(404, 'Unit not found')
    if not unit:
        raise HTTPException(404, 'Unit not found')
    key = f'{kind}:{unit.id}'
    item = db.scalar(select(UnitProfileDraft).where(UnitProfileDraft.owner_key == key))
    if not item or item.approved_description is None or item.approved_contact is None:
        return {'published': False}
    return {'published': True, 'description': item.approved_description,
            'contact': item.approved_contact}

@router.get('/mine')
def my_profile(db: DB, user: CurrentAdmin):
    key = own_key(user)
    return serialize(db.scalar(select(UnitProfileDraft).where(UnitProfileDraft.owner_key == key)), key)

@router.put('/mine')
def save_profile(body: ProfileIn, db: DB, user: CurrentAdmin):
    key = own_key(user)
    item = db.scalar(select(UnitProfileDraft).where(UnitProfileDraft.owner_key == key).with_for_update())
    if item is None:
        item = UnitProfileDraft(owner_key=key, edited_by=user.id, status='draft')
        db.add(item)
    elif item.status == 'submitted':
        raise HTTPException(409, 'Submitted draft is locked for CCR review')
    item.description = body.description.strip()
    item.contact = body.contact.strip()
    item.updated_at = datetime.now(timezone.utc)
    item.edited_by = user.id
    item.feedback = ''
    item.status = 'draft'
    db.commit()
    db.refresh(item)
    return serialize(item, key)

@router.post('/mine/submit')
def submit_profile(db: DB, user: CurrentAdmin):
    key = own_key(user)
    item = db.scalar(select(UnitProfileDraft).where(UnitProfileDraft.owner_key == key).with_for_update())
    if not item:
        raise HTTPException(404, 'Save a draft first')
    if item.status != 'draft':
        raise HTTPException(409, 'Only a draft can be submitted')
    if not item.description and not item.contact:
        raise HTTPException(422, 'Empty profile cannot be submitted')
    item.status = 'submitted'
    item.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return serialize(item, key)

@router.get('/review')
def review_list(db: DB, user: CurrentAdmin):
    if user.role != 'ccr':
        raise HTTPException(403, 'Only CCR can review profiles')
    rows = db.scalars(select(UnitProfileDraft).order_by(UnitProfileDraft.updated_at.desc())).all()
    return [{**serialize(i, i.owner_key), **validate_owner(db, i.owner_key), 'id': i.id} for i in rows]

@router.post('/review/{item_id}/decision')
def decide_profile(item_id: int, body: DecisionIn, db: DB, user: CurrentAdmin):
    if user.role != 'ccr':
        raise HTTPException(403, 'Only CCR can approve profiles')
    item = db.scalar(select(UnitProfileDraft).where(UnitProfileDraft.id == item_id).with_for_update())
    if item is None:
        raise HTTPException(404, 'Profile draft not found')
    if item.status != 'submitted':
        raise HTTPException(409, 'Profile is not awaiting review')
    if body.approve:
        item.approved_description = item.description
        item.approved_contact = item.contact
        item.status = 'approved'
        item.feedback = ''
    else:
        if not body.feedback.strip():
            raise HTTPException(422, 'A reason is required for changes requested')
        item.status = 'changes_requested'
        item.feedback = body.feedback.strip()
    item.reviewed_by = user.id
    item.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(item)
    return serialize(item, item.owner_key)
