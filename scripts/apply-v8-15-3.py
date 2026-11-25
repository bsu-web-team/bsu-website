# Idempotent guarded V8.15.3 patch on V8.15.2 files.
from pathlib import Path
import sys
root=Path.cwd()
paths={name:root/name for name in (
 'backend/app/main.py','backend/app/staff_draft_router.py',
 'src/components/admin/StaffEditor.tsx','src/components/admin/StaffReview.tsx')}
if any(not f.exists() for f in paths.values()):sys.exit('STOP: missing existing V8.15.2 files')
contents={name:p.read_text(encoding='utf-8-sig') for name,p in paths.items()}
def patch(name,needle,replacement,mark):
 data=contents[name]
 if mark in data:return
 if needle not in data:sys.exit(f'STOP: anchor mismatch in {name}: {needle[:70]}')
 contents[name]=data.replace(needle,replacement,1)

name='backend/app/main.py'
patch(name,'from . import admin_router, editorial_router, media_router, unit_profile_router, staff_draft_router',
 'from . import admin_router, editorial_router, media_router, unit_profile_router, staff_draft_router, staff_photo_router','staff_photo_router')
patch(name,'app.include_router(staff_draft_router.router, prefix=API_PREFIX)',
 'app.include_router(staff_draft_router.router, prefix=API_PREFIX)\napp.include_router(staff_photo_router.router, prefix=API_PREFIX)'.replace('\n','\n'),'app.include_router(staff_photo_router.router')
name='backend/app/staff_draft_router.py'
patch(name,'from .staff_draft_models import StaffDraft',
 'from .staff_draft_models import StaffDraft\nfrom .staff_photo_models import StaffDraftPhoto, StaffPublicPhoto','from .staff_photo_models import')
patch(name,"'status': x.status, 'feedback': x.feedback, 'updatedAt': x.updated_at.isoformat()}",
 "'status': x.status, 'feedback': x.feedback, 'hasPhoto': x.photo is not None, 'updatedAt': x.updated_at.isoformat()}",'hasPhoto')
patch(name,'    if body.approve:\n        if item.staff_id:',
 '''    if body.approve:
        if item.staff_id:''','NOOP_MARK_NOT_USED') if False else None
# Two operations below are disjoint, keep existing staff publication behavior.
patch(name,"        item.status='approved';item.feedback=''", '''        # The approved image is isolated from pending draft photos.
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
        item.status='approved';item.feedback=""''','db.get(StaffDraftPhoto, item.id)')
# Relationship provides one query per displayed draft; no schema modification to public staff.
name='backend/app/staff_draft_models.py'
p=root/name
if not p.exists():sys.exit('STOP: staff_draft_models.py missing')
model=p.read_text(encoding='utf-8-sig')
if 'photo = relationship(' not in model:
 if 'from sqlalchemy.orm import Mapped, mapped_column' not in model or '    updated_at: Mapped[datetime]' not in model:sys.exit('STOP: staff model changed')
 model=model.replace('from sqlalchemy.orm import Mapped, mapped_column','from sqlalchemy.orm import Mapped, mapped_column, relationship')
 model=model.replace('    updated_at: Mapped[datetime]', '    photo = relationship("StaffDraftPhoto", uselist=False, cascade="all, delete-orphan")\n    updated_at: Mapped[datetime]'.replace('\n','\n'),1)
else:pass
# Validate all planned patches before writing any existing file.
for name,data in contents.items():
 if 'backend/app/main.py'==name and 'app.include_router(staff_photo_router.router' not in data:sys.exit('STOP: main patch incomplete')
 if 'backend/app/staff_draft_router.py'==name and 'db.get(StaffDraftPhoto, item.id)' not in data:sys.exit('STOP: draft router patch incomplete')
# TSX enhancements below are inserted by robust neighboring anchors.
name='src/components/admin/StaffEditor.tsx'
patch(name,'status:string;feedback:string};','status:string;feedback:string;hasPhoto?:boolean};','hasPhoto?:boolean')
patch(name,' const [editingDraftId,setEditingDraftId]=useState<number|null>(null);',
 ''' const [editingDraftId,setEditingDraftId]=useState<number|null>(null);
 const [photoFile,setPhotoFile]=useState<File|null>(null);''','const [photoFile,setPhotoFile]')
patch(name,' function choose(id:string){setEditingDraftId(null);',
 ' function choose(id:string){setPhotoFile(null);setEditingDraftId(null);','function choose(id:string){setPhotoFile(null);')
patch(name,' function editDraft(d:Draft){setEditingDraftId(d.id);',
 ' function editDraft(d:Draft){setPhotoFile(null);setEditingDraftId(d.id);','function editDraft(d:Draft){setPhotoFile(null);')
patch(name,'  await load();if(action!=="submit")setEditingDraftId(null);',
 '''  if(action!=="submit" && photoFile){
    const form=new FormData();form.append("file",photoFile);
    const photoResp=await fetch(`/api/admin-staff-photo?id=${d.id}`,{method:"POST",body:form});
    if(!photoResp.ok){const err=await photoResp.json();throw new Error(err.detail??err.error??`Фото: HTTP ${photoResp.status}`);}
    setPhotoFile(null);
  }
  await load();if(action!=="submit")setEditingDraftId(null);''','photoResp=await fetch')
patch(name,'  <div className="flex flex-wrap gap-2"><button className={button}',
 '''  <label className="block text-sm font-semibold">Фотография (JPEG, PNG или WebP, до 5 МБ)
    <input type="file" accept="image/jpeg,image/png,image/webp" className={`${field} mt-2`} onChange={e=>setPhotoFile(e.target.files?.[0]??null)}/>
    <span className="mt-1 block text-xs text-slate-600">Фото сохраняется вместе с черновиком и публикуется только после решения ЦЦР.</span>
  </label>
  <div className="flex flex-wrap gap-2"><button className={button}''','Фото сохраняется вместе')
patch(name,'{d.feedback&&<p className="mt-1 text-sm text-amber-700">',
 '''{d.hasPhoto&&<a target="_blank" rel="noopener noreferrer" href={`/api/admin-staff-photo?id=${d.id}`} className="mt-1 block text-sm font-semibold text-blue-700 underline">Посмотреть фото заявки</a>}{d.feedback&&<p className="mt-1 text-sm text-amber-700">''','Посмотреть фото заявки')
name='src/components/admin/StaffReview.tsx'
patch(name,'  facultyId: number;', '  hasPhoto?: boolean;\n  facultyId: number;'.replace('\n','\n'),'hasPhoto?: boolean')
patch(name,'            {item.feedback &&', '''            {item.hasPhoto && <a href={`/api/admin-staff-photo?id=${item.id}`} target="_blank" rel="noopener noreferrer" className="inline-block rounded-lg border border-blue-200 px-3 py-2 text-sm font-semibold text-blue-800">Просмотреть фотографию перед решением</a>}
            {item.feedback &&''','Просмотреть фотографию перед решением')
for name,data in contents.items():paths[name].write_text(data,encoding='utf-8')
p.write_text(model,encoding='utf-8')
print('PASS V8.15.3: staff images, admin preview and CCR-only publication registered')
