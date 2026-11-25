"""Idempotent text patch. Requires V8.16. Stops instead of guessing on changed files."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]

def patch(rel,old,new):
    p=ROOT/rel
    if not p.is_file():raise SystemExit(f'MISSING {rel}. V8.16 must be installed first.')
    s=p.read_text(encoding='utf-8-sig')
    if new in s:print('ALREADY',rel);return
    if old not in s:raise SystemExit(f'ANCHOR CHANGED: {rel}: {old!r}. Nothing modified at this step.')
    p.write_text(s.replace(old,new,1),encoding='utf-8')
    print('PATCHED',rel)

patch('backend/app/main.py',
      'staff_photo_router, document_workflow_router',
      'staff_photo_router, document_workflow_router, program_workflow_router')
patch('backend/app/main.py',
      'app.include_router(document_workflow_router.router, prefix=API_PREFIX)',
      'app.include_router(document_workflow_router.router, prefix=API_PREFIX)\napp.include_router(program_workflow_router.router, prefix=API_PREFIX)')
patch('src/components/admin/EditorialDemo.tsx',
      '      </nav>',
      '      </nav>\n      <div className="px-5 pb-3"><Link href="/admin/programs-workflow" className="block rounded-lg border border-white/20 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">Образовательные программы</Link></div>')
patch('src/components/admin/AdminWorkspace.tsx',
      'Согласование документов</Link>',
      'Согласование документов</Link><Link href="/admin/program-review" className="ml-3 mt-3 inline-block rounded-lg bg-[#204774] px-4 py-2 text-sm font-semibold text-white">Согласование программ</Link>')
print('PASS V8.17 installer: API registered and navigation links added')
