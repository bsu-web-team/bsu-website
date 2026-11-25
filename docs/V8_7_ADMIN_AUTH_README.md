# BSU V8.7 — server-side auth/RBAC foundation (integration proposal)

**Not production-ready and NOT deployed.** This extension does not change V7.4 public GET response contracts. It adds a separate private authentication surface for review by the Backend owner. Do not merge it to `main` or expose admin panels to the Internet until the backend team signs off, tests pass, and the authorization layer is wired into EVERY mutation route.

## What is included

- `admin_users` and `admin_sessions` tables in new Alembic migration `0002_admin`.
- Username/password auth: salted scrypt password hashes; randomly generated session bearer token; only SHA-256 hash of the token stored in PostgreSQL; 8-hour expiry; logout revokes sessions.
- Roles `ccr`, `faculty` and `department`. A unit account references one existing faculty or department row via an FK. PostgreSQL constraints enforce valid role/scope combinations.
- Server helper `require_unit_access`: deny cross-faculty and cross-department edits; supports CCR unrestricted scope.
- Private endpoints `POST /api/v1/admin-auth/login`, `GET /api/v1/admin-auth/me`, `POST /api/v1/admin-auth/logout`.
- Manual account creation CLI with hidden password input, no default credentials.
- Primitive RBAC tests (no real administrative write routes yet).

## Important limitations / release blockers

1. **No browser integration yet**. Current `/admin` pages remain demonstrators, not protected actual accounts.
2. **No real CRUD/editorial endpoints yet.** `require_unit_access` must be invoked for every administrative read/write endpoint; never trust supplied unit IDs or hidden UI fields.
3. TLS/HTTPS is mandatory in deployment; no credentials over HTTP on external networks.
4. Add login throttling/lockouts, session rotation, CSRF-safe cookie/BFF strategy, full audit logs, password-reset policy, backups, and monitoring before public release. Bearer tokens should not be stored in browser localStorage; prefer secure HttpOnly cookie with BFF.
5. Current public `.seed` replaces content: do not use against live edited data. Accounts use independent tables but deleting referenced faculties can be blocked by their FKs.
6. Run a full database migration rehearsal on a disposable DB; do not run the destructive `downgrade base` of the existing test suite on a valuable database.
7. Adding routes/migration is a **new admin implementation**, not an amendment to the previously approved public V7.4 contract. Backend owner should review this private interface once before integration.

## How to stage locally (after review)

From repo root, on branch `integration/backend-mvp` or better a child branch:

```powershell
python scripts/apply-admin-auth-v8.7.py
python -m compileall -q backend/app backend/alembic/versions
npx tsc --noEmit
npm run lint
# Inspect git diff before any commit
```

After backend-owner review, to test migration on a **disposable local DB only**:

```powershell
# db running; migration will be picked up on container start
# docker compose up -d --build
# docker compose exec api python -m app.create_admin
# backend private Swagger available locally at http://127.0.0.1:8000/docs
```

Public content contracts, frontend pages and Docker files are not modified by these additions.
