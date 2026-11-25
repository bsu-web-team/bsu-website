"""V8.22 non-destructive local structural audit for BSU Next.js App Router.
Run: python scripts/audit-v8-22.py
No network, database access or source-code mutations.
"""
from __future__ import annotations
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / 'src'
APP = SRC / 'app'
REPORTS = ROOT / '.bsu-reports'
CORE = [
    '/','/about','/faculties','/departments','/staff','/programs','/news',
    '/documents','/admissions','/science','/contacts','/site-map',
    '/admin','/admin/login','/admin/review-center','/admin/structure',
    '/admin/navigation','/admin/faculty','/admin/department','/admin/editor',
    '/admin/editorial-review','/admin/unit-review','/admin/staff-review',
    '/admin/document-review','/admin/program-review','/admin/staff',
    '/admin/documents-workflow','/admin/programs-workflow',
]
# The following are role-specific operational views, expected to be reachable through admin navigation.
OPERATIONAL = [
    '/admin/review-center','/admin/structure','/admin/navigation',
    '/admin/editorial-review','/admin/unit-review','/admin/staff-review',
    '/admin/document-review','/admin/program-review','/admin/staff',
    '/admin/documents-workflow','/admin/programs-workflow',
]


def page_route(page: Path) -> str:
    parts = page.parent.relative_to(APP).parts
    parts = [x for x in parts if not (x.startswith('(') and x.endswith(')')) and not x.startswith('@')]
    return '/' + '/'.join(parts)


def matches(target: str, routes: set[str]) -> bool:
    if target in routes:
        return True
    for route in routes:
        segments = route.strip('/').split('/')
        regex = '/'.join('.*' if s.startswith('[...') else '[^/]+' if s.startswith('[') else re.escape(s) for s in segments)
        if re.fullmatch(regex, target.strip('/')):
            return True
    return False


def main() -> int:
    if not APP.exists():
        print('FAIL: run inside the bsu-frontend repository; src/app missing')
        return 2
    pages = sorted(list(APP.rglob('page.tsx')) + list(APP.rglob('page.jsx')) + list(APP.rglob('page.js')))
    routes = {page_route(p) for p in pages}
    missing = sorted(path for path in CORE if path not in routes)
    # Static internal href literals only; dynamic href values are inspected separately.
    href_re = re.compile(r'\bhref\s*=\s*(?:[\"\'](/[^\"\'\s{}]*)[\"\']|\{[\"\'](/[^\"\'\s{}]*)[\"\']\})')
    unresolved: dict[str, set[str]] = {}
    links: dict[str, set[str]] = {}
    scanned = 0
    for file in SRC.rglob('*'):
        if file.suffix not in {'.tsx','.jsx'} or not file.is_file():
            continue
        scanned += 1
        contents = file.read_text(encoding='utf-8-sig', errors='replace')
        for m in href_re.finditer(contents):
            raw = m.group(1) or m.group(2)
            if not raw or raw.startswith('//') or raw.startswith(('/api/','/_next/')):
                continue
            target = urlsplit(raw).path.rstrip('/') or '/'
            if target.startswith(('/images/','/brand/','/icons/','/files/')) or '.' in target.rsplit('/', 1)[-1]:
                continue  # Static asset, not an App Router page.
            rel = file.relative_to(ROOT).as_posix()
            links.setdefault(target, set()).add(rel)
            if not matches(target, routes):
                unresolved.setdefault(target, set()).add(rel)
    # Detect nav targets lacking ANY literal link; dynamic menus and redirects may still make them reachable.
    nav_sources = [p for p in (SRC / 'components' / 'admin').glob('*.tsx')] + list((APP / 'admin').rglob('*.tsx'))
    nav_text = '\n'.join(p.read_text(encoding='utf-8-sig', errors='replace') for p in nav_sources)
    not_literal_in_admin = [p for p in OPERATIONAL if p not in nav_text]
    shared_nav_file = SRC / 'components' / 'admin' / 'AdminQuickNav.tsx'
    layout_file = APP / 'admin' / 'layout.tsx'
    shared_nav_wired = shared_nav_file.exists() and layout_file.exists() and 'AdminQuickNav' in layout_file.read_text(encoding='utf-8-sig')
    findings = {
        'version':'8.22', 'generated_at_utc':datetime.now(timezone.utc).isoformat(),
        'page_files':len(pages),'unique_routes':len(routes),'source_components_scanned':scanned,
        'core_routes_checked':len(CORE),'missing_core_routes':missing,
        'static_internal_targets_checked':len(links),
        'unresolved_static_page_links':{key:sorted(value) for key,value in sorted(unresolved.items())},
        'admin_operational_routes_without_literal_reference':not_literal_in_admin,
        'shared_admin_navigation_wired':shared_nav_wired,
        'notes':[
            'Static audit only: dynamic links, actual HTTP responses, permissions, styling and client-side clicks are not runtime-tested.',
            'Unresolved static targets may have intentional redirects, middleware or URL rewrites.',
            'Backend API and PostgreSQL are not contacted; no production-readiness claim is made.'
        ],
    }
    REPORTS.mkdir(exist_ok=True)
    (REPORTS/'v8.22-audit.json').write_text(json.dumps(findings,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    summary = [
        '# BSU V8.22 — структурный аудит',
        f'- Страниц Next.js: **{len(pages)}**',
        f'- Уникальных маршрутов: **{len(routes)}**',
        f'- Ключевых маршрутов: **{len(CORE)-len(missing)}/{len(CORE)}**',
        f'- Статических ссылок без подтверждённого маршрута: **{len(unresolved)}**',
        f'- Общая навигация администратора подключена: **{"да" if shared_nav_wired else "нет"}**',
        '',
        '## Отсутствующие ключевые маршруты',
        *([f'- `{p}`' for p in missing] if missing else ['Не обнаружены.']),
        '',
        '## Статические ссылки, требующие проверки',
        *([f'- `{p}` — {", ".join(sorted(v)[:3])}' for p,v in sorted(unresolved.items())] if unresolved else ['Не обнаружены.']),
        '',
        '## Административные разделы без явной строковой ссылки',
        *([f'- `{p}`' for p in not_literal_in_admin] if not_literal_in_admin else ['Не обнаружены.']),
        '',
        'Ограничение: этот отчёт не проверяет клики, реальный доступ по ролям и ответы сервера. Для выпуска сайта необходимы интеграционные и браузерные тесты.',
    ]
    (REPORTS/'v8.22-audit.md').write_text('\n'.join(summary)+'\n',encoding='utf-8')
    print(f'V8.22: pages={len(pages)} routes={len(routes)} core={len(CORE)-len(missing)}/{len(CORE)}')
    print(f'Static unresolved links: {len(unresolved)}; admin navigation wired: {shared_nav_wired}')
    print('Reports: .bsu-reports/v8.22-audit.md and v8.22-audit.json')
    if missing:
        print('FAIL: missing core routes: '+', '.join(missing))
        return 1
    if unresolved:
        print('WARN: static links require review (see report).')
    if not shared_nav_wired:
        print('WARN: V8.21 shared admin navigation not detected.')
    print('PASS: core structure exists (runtime behavior not tested)')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
