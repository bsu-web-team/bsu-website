"""Apply V8.7 registration to a matching FastAPI checkout. Back up changed files."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parent.parent
main = root / 'backend/app/main.py'
models = root / 'backend/app/models.py'
s = main.read_text(encoding='utf-8')
m = models.read_text(encoding='utf-8')
main_import = 'from .config import settings\n'
router_block = ('for module in (faculties, departments, staff, programs, news, documents, content):\n'
                '    app.include_router(module.router, prefix=API_PREFIX)\n')
if main_import not in s or router_block not in s:
    raise SystemExit('Unexpected backend/app/main.py layout; no changes made')
if 'from . import admin_router' not in s:
    s = s.replace(main_import, main_import + 'from . import admin_router\n')
if 'app.include_router(admin_router.router, prefix=API_PREFIX)' not in s:
    s = s.replace(router_block, router_block + '\napp.include_router(admin_router.router, prefix=API_PREFIX)\n')
if 'from .admin_models import AdminUser, AdminSession' not in m:
    m += ('\n# Include administrative mappings in Alembic Base.metadata.\n'
          'from .admin_models import AdminUser, AdminSession  # noqa: E402,F401\n')
for source, result in ((main,s),(models,m)):
    if source.read_text(encoding='utf-8') != result:
        backup = source.with_name(source.name + '.v8-7.bak')
        if not backup.exists():
            shutil.copy2(source, backup)
        source.write_text(result, encoding='utf-8')
print('PASS V8.7: admin-auth endpoints registered; public API unchanged')
