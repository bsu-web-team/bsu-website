# BSU V8.22 — final static structure audit

This package adds `scripts/audit-v8-22.py` only; it does not alter existing Next.js, FastAPI or PostgreSQL code.

## Install

Extract the archive to the repository root while preserving folders `scripts/` and `docs/`.

Run:

```powershell
python scripts/audit-v8-22.py
node scripts/check-site-routes-v8-20.cjs
node scripts/check-admin-nav-v8-21.cjs
npx tsc --noEmit
npm run lint
```

The new audit emits `.bsu-reports/v8.22-audit.md` and `.bsu-reports/v8.22-audit.json`.

Do not commit the reports or local `.env` files; reports are local snapshots. This static audit does not verify dynamic links, roles, runtime HTTP behavior, actual click interactions or production security.
