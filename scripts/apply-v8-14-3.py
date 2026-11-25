"""Safe idempotent patch for BSU V8.14.3; run from repository root."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent

def edit(path, old, new):
    file = ROOT / path
    content = file.read_text(encoding='utf-8-sig')
    if new in content:
        print('SKIP: already applied', path)
        return
    if old not in content:
        raise SystemExit(f'STOP: anchor not found in {path}. No change made to this file.')
    backup = file.with_suffix(file.suffix + '.v8143.bak')
    if not backup.exists(): shutil.copy2(file, backup)
    content = content.replace(old, new, 1)
    file.write_text(content, encoding='utf-8')
    print('PASS:', path)

# Keep public V7.4 endpoints unchanged: separate GET for approved-only overlay.
router='backend/app/unit_profile_router.py'
edit(router, "@router.get('/mine')", '''@router.get('/published/{kind}/{slug}')
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

@router.get('/mine')''')

faculty='src/app/faculties/[slug]/page.tsx'
edit(faculty, "import { getFacultyBySlug, getNews } from '@/lib/backend/data';", "import { getFacultyBySlug, getNews } from '@/lib/backend/data';\nimport { getApprovedUnitProfile } from '@/lib/backend/unit-publication';")
edit(faculty, ' const {slug}=await params;const faculty=await getFacultyBySlug(slug);if(!faculty)notFound();',
     ' const {slug}=await params;const faculty=await getFacultyBySlug(slug);if(!faculty)notFound();\n const approvedProfile = await getApprovedUnitProfile("faculty", slug);')
edit(faculty, '<p><PublicTextV13 value={faculty.summary}/></p>{brief.length?brief.map',
     '<p><PublicTextV13 value={approvedProfile?.description || faculty.summary}/></p>{!approvedProfile && brief.length?brief.map')
edit(faculty, '<Link href={`${base}/details`} prefetch={false}',
     '''{approvedProfile?.contact && <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4"><h3 className="font-bold">Контакты (утверждено ЦЦР)</h3><p className="mt-2 whitespace-pre-wrap">{approvedProfile.contact}</p></div>}
 <Link href={`${base}/details`} prefetch={false}''')

dep='src/app/departments/[slug]/page.tsx'
edit(dep, "import { getDepartmentBySlug, getNews } from '@/lib/backend/data';", "import { getDepartmentBySlug, getNews } from '@/lib/backend/data';\nimport { getApprovedUnitProfile } from '@/lib/backend/unit-publication';")
edit(dep, '  if (!department) notFound();', '  if (!department) notFound();\n  const approvedProfile = await getApprovedUnitProfile("department", slug);')
old='<PublicTextV13 value="Кафедра входит в структуру факультета. Описание деятельности, история кафедры и направления исследований будут размещены после подтверждения университетом." />'
new='<PublicTextV13 value={approvedProfile?.description || "Кафедра входит в структуру факультета. Описание деятельности, история кафедры и направления исследований будут размещены после подтверждения университетом."} />'
edit(dep,old,new)
edit(dep, '''</p></section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-bold text-[#204774]"><PublicTextV13 value="Сотрудники и программы"''',
    '''</p>{approvedProfile?.contact && <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4"><h3 className="font-bold">Контакты (утверждено ЦЦР)</h3><p className="mt-2 whitespace-pre-wrap">{approvedProfile.contact}</p></div>}</section>
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-2xl font-bold text-[#204774]"><PublicTextV13 value="Сотрудники и программы"''')
print('PASS V8.14.3: approved-only public overlay installed. No migration required.')
