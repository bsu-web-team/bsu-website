"""Fail-closed installer for V8.15.1. Archive is extracted to project root first."""
from pathlib import Path
import sys
root=Path.cwd()
main=root/'backend/app/main.py'
editor=root/'src/components/admin/EditorialDemo.tsx'
ccr=root/'src/components/admin/AdminWorkspace.tsx'
if not all(p.is_file() for p in (main,editor,ccr)):
    sys.exit('STOP: run at project root after extracting the ZIP')
files={p:p.read_text(encoding='utf-8-sig') for p in (main,editor,ccr)}
a=files[main]; b=files[editor]; c=files[ccr]
if 'staff_draft_router' not in a:
    old='from . import admin_router, editorial_router, media_router, unit_profile_router'
    if old not in a:sys.exit('STOP: backend main import anchor changed; no files modified')
    a=a.replace(old, old+', staff_draft_router',1)
    old='app.include_router(unit_profile_router.router, prefix=API_PREFIX)'
    if old not in a:sys.exit('STOP: backend router anchor changed; no files modified')
    a=a.replace(old,old+'\napp.include_router(staff_draft_router.router, prefix=API_PREFIX)',1)
if 'href="/admin/staff"' not in b:
    anchor='<main className="mx-auto max-w-6xl space-y-6 px-5 py-7 sm:px-8">'
    if anchor not in b:sys.exit('STOP: faculty editor anchor changed; no files modified')
    b=b.replace(anchor,anchor+'\n        {!reviewMode && <Link href="/admin/staff" className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-semibold text-[#204774]">Сотрудники · заявки и согласование</Link>}',1)
if 'href="/admin/staff-review"' not in c:
    anchor='<Link href="/admin/unit-review"'
    if anchor not in c:sys.exit('STOP: CCR workspace anchor changed; no files modified')
    c=c.replace(anchor,'<Link href="/admin/staff-review" className="mt-3 ml-3 inline-block rounded-lg bg-[#204774] px-4 py-2 text-sm font-semibold text-white">Согласование сотрудников</Link>'+anchor,1)
for p,value in ((main,a),(editor,b),(ccr,c)):
    p.write_text(value,encoding='utf-8')
print('PASS V8.15.1 installer: staff review API registered; editor and CCR links inserted')
