"""Idempotent V8.19 registration, without rewriting existing handlers or admin UIs."""
from pathlib import Path
root=Path(__file__).resolve().parent.parent
p=root/'backend/app/main.py'
s=p.read_text(encoding='utf-8-sig')
assert 'from . import ' in s and 'app.include_router(program_workflow_router.router, prefix=API_PREFIX)' in s, 'Expected V8.17 main.py; aborting without modification'
if 'structure_router' not in s:
    s=s.replace('program_workflow_router\n','program_workflow_router, structure_router\n',1)
    anchor='app.include_router(program_workflow_router.router, prefix=API_PREFIX)'
    s=s.replace(anchor,anchor+'\napp.include_router(structure_router.router, prefix=API_PREFIX)',1)
    p.write_text(s,encoding='utf-8')
assert 'app.include_router(structure_router.router, prefix=API_PREFIX)' in s
# Safety: explicitly avoid injecting into demo CCR UI, profile routes or data seed.
print('PASS V8.19: structure router enabled; existing models and public API untouched')
