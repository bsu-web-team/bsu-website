"""V8.18: add a CCR navigation card without altering workflow APIs."""
from pathlib import Path
p = Path('src/components/admin/AdminWorkspace.tsx')
if not p.exists():
    raise SystemExit('ERROR: run from BSU frontend root')
s = p.read_text(encoding='utf-8')
if 'href="/admin/review-center"' in s:
    print('PASS V8.18: navigation already installed')
else:
    anchor = '      <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-5">'
    if anchor not in s:
        raise SystemExit('ERROR: AdminWorkspace.tsx differs; no change made. Open /admin/review-center directly and send the installer output.')
    block = '''      <div className="mb-5 rounded-2xl border border-blue-200 bg-white p-5"><p className="text-sm font-bold text-[#204774]">ЦЦР · единый центр согласования</p><p className="mt-1 text-sm text-slate-600">Новости, профили, сотрудники, документы и программы в одном списке.</p><Link href="/admin/review-center" className="mt-3 inline-block rounded-lg bg-[#204774] px-4 py-2 text-sm font-semibold text-white">Открыть все заявки</Link></div>
'''
    p.write_text(s.replace(anchor,block+anchor,1),encoding='utf-8')
    print('PASS V8.18: unified CCR review navigation added')
