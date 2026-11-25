"""V8.20 idempotent navigation link insertion; does not touch backend or DB."""
from pathlib import Path
root = Path(__file__).resolve().parents[1]
path = root / 'src/components/admin/AdminWorkspace.tsx'
if not path.is_file():
    raise SystemExit(f'Missing {path}')
s = path.read_text(encoding='utf-8-sig')
link = '<Link href="/admin/navigation" className="mb-3 flex items-center gap-2 rounded-xl border border-white/30 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">Карта всех разделов БГУ ↗</Link>'
if 'href="/admin/navigation"' in s:
    print('PASS V8.20: navigation already linked')
else:
    anchor = '<div className="px-6 pb-8"><Link href="/"'
    if s.count(anchor) != 1:
        raise SystemExit('Anchor not found exactly once; AdminWorkspace was not changed. Please inspect it manually.')
    s = s.replace(anchor, '<div className="px-6 pb-8">' + link + '<Link href="/"', 1)
    path.write_text(s, encoding='utf-8')
    print('PASS V8.20: navigation linked in CCR sidebar')
