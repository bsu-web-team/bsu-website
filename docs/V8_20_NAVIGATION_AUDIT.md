# BSU V8.20 — Navigation & page structure

No backend/database migrations and no production security changes.

## Install
1. Unzip into repository root, preserving folders.
2. Run `python scripts/apply-v8-20.py` (idempotent).
3. Run `node scripts/check-site-routes-v8-20.cjs`.
4. Run `npx tsc --noEmit` and `npm run lint`.
5. Open `/admin/navigation` under CCR role in local development.

### Limits
- Link audit is static and cannot verify runtime page content, dynamic slugs, callback handlers, database access or client-side routing behavior.
- Only missing *core routes* cause a nonzero exit code; unresolved links in other components are warnings for review.
- Do not run `seed` against existing DB. This version does not touch DB.
- The existing `/admin` workspace still contains demo-only in-memory content editing; use the actual role-based editor modules for PostgreSQL writes.
