from pathlib import Path
import shutil

root = Path.cwd()
p = root / 'src/components/admin/EditorialDemo.tsx'
component = root / 'src/components/admin/PublicUnitSnapshot.tsx'
route = root / 'src/app/api/admin-unit-public/route.ts'
for required in (p, component, route):
    if not required.is_file():
        raise SystemExit(f'ERROR: Missing {required.relative_to(root)}. Extract the ZIP into the project root first.')

s = p.read_text(encoding='utf-8-sig')
if 'import PublicUnitSnapshot from ' in s:
    print('PASS: PublicUnitSnapshot already installed')
    raise SystemExit(0)

import_anchor = 'import { departments } from "@/lib/department-data";'
if import_anchor not in s:
    raise SystemExit('ERROR: Cannot locate import anchor; no changes written.')

open_anchor = '{section === "profile" && <section'
next_anchor = '{section === "news" &&'
start = s.find(open_anchor)
stop = s.find(next_anchor, start)
if start < 0 or stop < 0:
    raise SystemExit('ERROR: Cannot locate profile section boundaries; no changes written.')
profile = s[start:stop]
end = profile.rfind('</section>}')
if end < 0:
    raise SystemExit('ERROR: Cannot locate profile closing tag; no changes written.')

profile = (
    profile[:end] + '</section></>}' + profile[end + len('</section>}'):]
)
profile = profile.replace(
    '{section === "profile" && <section',
    '{section === "profile" && <><PublicUnitSnapshot role={isFaculty ? "faculty" : "department"} /><section',
    1,
)
updated = s[:start] + profile + s[stop:]
updated = updated.replace(import_anchor, import_anchor + '\nimport PublicUnitSnapshot from "@/components/admin/PublicUnitSnapshot";', 1)
backup = p.with_suffix('.tsx.v814-public.bak')
if not backup.exists():
    shutil.copy2(p, backup)
p.write_text(updated, encoding='utf-8')
print('PASS: PublicUnitSnapshot added to unit profile editor')
print('Backup:', backup)
