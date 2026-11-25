"""Private draft endpoints. Scope is computed from verified session, never the request body."""
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from .admin_security import DB, CurrentAdmin
from .admin_models import AdminUser
from .unit_profile_models import UnitProfileDraft

router = APIRouter(prefix='/admin-unit-profiles', tags=['admin-unit-profiles'])

class ProfileIn(BaseModel):
    model_config = ConfigDict(extra='forbid')
    description: str = Field(default='', max_length=20000)
    contact: str = Field(default='', max_length=4000)

def own_key(user: AdminUser) -> str:
    if user.role == 'faculty' and user.faculty_id is not None:
        return f'faculty:{user.faculty_id}'
    if user.role == 'department' and user.department_id is not None:
        return f'department:{user.department_id}'
    raise HTTPException(403, 'A faculty or department account is required')

def serialize(item: UnitProfileDraft | None, key: str) -> dict:
    return {'ownerKey': key, 'description': item.description if item else '',
            'contact': item.contact if item else '', 'status': item.status if item else 'empty',
            'updatedAt': item.updated_at.isoformat() if item else None}

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
    elif item.status != 'draft':
        raise HTTPException(409, 'Draft is locked for review')
    item.description = body.description.strip()
    item.contact = body.contact.strip()
    item.updated_at = datetime.now(timezone.utc)
    item.edited_by = user.id
    db.commit()
    db.refresh(item)
    return serialize(item, key)
