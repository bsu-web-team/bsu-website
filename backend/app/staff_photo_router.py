"""Private employee draft media; published image is a separately approved copy."""
from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import Response
from sqlalchemy import select
from .admin_security import DB, CurrentAdmin
from .models import Staff
from .staff_draft_models import StaffDraft
from .staff_photo_models import StaffDraftPhoto, StaffPublicPhoto
from .staff_draft_router import owner
from .media_router import safe_image, MAX_BYTES

router = APIRouter(tags=['staff-photos'])

def allowed(db, user, draft_id: int, *, write=False):
    item = db.get(StaffDraft, draft_id)
    if item is None: raise HTTPException(404, 'Draft not found')
    if user.role != 'ccr':
        fid, did = owner(db, user)
        if item.author_id != user.id or item.faculty_id != fid or item.department_id != did:
            raise HTTPException(403, 'Other unit draft')
    if write and (user.role == 'ccr' or item.status not in ('draft', 'changes_requested')):
        raise HTTPException(409, 'Image may be edited only in your editable draft')
    return item

@router.post('/admin-staff/drafts/{draft_id}/photo', status_code=201)
async def upload_photo(draft_id: int, db: DB, user: CurrentAdmin, file: UploadFile = File(...)):
    allowed(db,user,draft_id,write=True)
    data = await file.read(MAX_BYTES + 1)
    mime,_ = safe_image(data)
    row = db.get(StaffDraftPhoto,draft_id)
    if row is None: row=StaffDraftPhoto(draft_id=draft_id,mime=mime,data=data);db.add(row)
    else: row.mime=mime;row.data=data
    db.commit()
    return {'ok':True, 'draftId':draft_id, 'mime':mime}

@router.get('/admin-staff/drafts/{draft_id}/photo')
def private_photo(draft_id: int, db: DB, user: CurrentAdmin):
    allowed(db,user,draft_id)
    row=db.get(StaffDraftPhoto,draft_id)
    if row is None: raise HTTPException(404, 'No uploaded photo')
    return Response(row.data,media_type=row.mime,headers={'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'})

@router.delete('/admin-staff/drafts/{draft_id}/photo')
def delete_photo(draft_id: int, db: DB, user: CurrentAdmin):
    allowed(db,user,draft_id,write=True)
    row=db.get(StaffDraftPhoto,draft_id)
    if row is not None:db.delete(row);db.commit()
    return {'ok':True}

@router.get('/staff-photos/{slug}')
def public_photo(slug: str, db: DB):
    # No JWT needed: only the approved table can be queried publicly.
    staff=db.scalar(select(Staff).where(Staff.slug==slug))
    if staff is None: raise HTTPException(404,'Not found')
    row=db.get(StaffPublicPhoto,staff.id)
    if row is None:raise HTTPException(404,'Not published')
    return Response(row.data,media_type=row.mime,headers={'Cache-Control':'public, max-age=60','X-Content-Type-Options':'nosniff'})
