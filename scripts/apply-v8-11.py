"""Idempotent V8.11 patch, run from repository root after extracting archive."""
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent

def replace(path, old, new):
    file=ROOT/path
    if not file.exists(): raise SystemExit(f"MISSING {path}; V8.10 must be installed first")
    src=file.read_text(encoding="utf-8-sig")
    if new in src: print(f"SKIP {path}"); return
    if old not in src: raise SystemExit(f"UNEXPECTED SOURCE {path}: no modifications performed for this file")
    file.write_text(src.replace(old,new,1),encoding="utf-8")
    print(f"PATCHED {path}")

# Server auth — add role but preserve existing role-based guards.
replace("backend/app/create_admin.py", "('ccr','faculty','department'):", "('ccr','faculty','department','news_editor'):")
replace("backend/app/create_admin.py", "Role (ccr/faculty/department):", "Role (ccr/faculty/department/news_editor):")
replace("backend/app/main.py", "from . import admin_router", "from . import admin_router, editorial_router")
replace("backend/app/main.py", "app.include_router(admin_router.router, prefix=API_PREFIX)",
        "app.include_router(admin_router.router, prefix=API_PREFIX)\napp.include_router(editorial_router.router, prefix=API_PREFIX)")
# Alembic must load editorial mapping so metadata includes it; no circular model import.
replace("backend/alembic/env.py", "from app import admin_models  # noqa: F401",
        "from app import admin_models  # noqa: F401\nfrom app import editorial_models  # noqa: F401")
# V8.10 router BFF role allow-list.
replace("src/lib/admin-session.ts", 'export type AdminRole = "ccr" | "faculty" | "department";',
        'export type AdminRole = "ccr" | "faculty" | "department" | "news_editor";')
replace("src/lib/admin-session.ts", '(p.role === "ccr" || p.role === "faculty" || p.role === "department")',
        '(p.role === "ccr" || p.role === "faculty" || p.role === "department" || p.role === "news_editor")')
replace("src/lib/admin-session.ts", 'redirect(principal.role === "ccr" ? "/admin" : `/admin/${principal.role}`);',
        'redirect(correctAdminHome(principal.role));')
replace("src/lib/admin-session.ts", 'return role === "ccr" ? "/admin" : `/admin/${role}`;',
        'return role === "ccr" ? "/admin" : role === "news_editor" ? "/admin/editor" : `/admin/${role}`;')
replace("src/app/api/admin-auth/login/route.ts", '(role !== "ccr" && role !== "faculty" && role !== "department")',
        '(role !== "ccr" && role !== "faculty" && role !== "department" && role !== "news_editor")')
# Separate review dashboard is inside CCR. Old localStorage demo remains accessible for backwards compatibility.
replace("src/components/admin/AdminWorkspace.tsx", 'href="/admin/review"', 'href="/admin/editorial-review"')
print("PASS V8.11: editor role and CCR-only publication API staged")
