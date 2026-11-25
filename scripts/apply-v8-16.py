"""Idempotently register V8.16 in an existing V8.15 branch; no DB changes."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def patch(rel,old,new):
    p=ROOT/rel
    if not p.exists(): raise SystemExit(f'MISSING: {rel}. Apply the V8.15 branch first.')
    s=p.read_text(encoding='utf-8-sig')
    if new in s:
        print('ALREADY:',rel);return
    if old not in s:raise SystemExit(f'ANCHOR CHANGED in {rel}: {old!r}; no files modified for this step')
    p.write_text(s.replace(old,new,1),encoding='utf-8')
    print('PATCHED:',rel)

patch('backend/app/main.py',
      'staff_draft_router, staff_photo_router',
      'staff_draft_router, staff_photo_router, document_workflow_router')
patch('backend/app/main.py',
      'app.include_router(staff_photo_router.router, prefix=API_PREFIX)',
      'app.include_router(staff_photo_router.router, prefix=API_PREFIX)\napp.include_router(document_workflow_router.router, prefix=API_PREFIX)')
patch('src/components/admin/EditorialDemo.tsx',
      '      </nav>',
      '      </nav>\n      <div className="px-5 pb-3"><Link href="/admin/documents-workflow" className="block rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">Документы подразделения</Link></div>')
patch('src/components/admin/AdminWorkspace.tsx',
      'Открыть согласование профилей</Link>',
      'Открыть согласование профилей</Link><Link href="/admin/document-review" className="ml-3 mt-3 inline-block rounded-lg bg-[#204774] px-4 py-2 text-sm font-semibold text-white">Согласование документов</Link>')
print('PASS V8.16: documents API registered and navigation links added')
