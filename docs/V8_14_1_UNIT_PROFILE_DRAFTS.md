# BSU V8.14.1 — private faculty/department profile drafts

- Based on branch `feature/admin-auth-v8.7` at V8.13. Apply on `feature/unit-content-v8.14`.
- Scope is derived ONLY from server-verified `CurrentAdmin` role and unit IDs; the body accepts only description and contact. `news_editor` and CCR cannot write /mine.
- Data goes in `unit_profile_drafts`, keyed by `faculty:<id>` or `department:<id>`. The public faculty and department tables are untouched.
- No publication or review action yet. CCR review will be V8.14.2. Existing demo news UI remains localStorage and should not be used for actual submissions; the V8.11 editorial API exists separately.
- This is a development-only BFF route; use the separate test database.

Apply: unzip at repository root; `python scripts/apply-v8-14-1.py`.
Tests: `python -m compileall -q backend/app backend/alembic/versions`, `npx tsc --noEmit`, `npm run lint`, `docker compose build api`, `docker compose run --rm --no-deps api python -m app.test_unit_profile_policy`.
Test-only migration: `docker compose run --rm --no-deps -e "DATABASE_URL=$testUrl" api alembic upgrade head` where `$testUrl` points at `bsu_auth_v88_test`.
Recreate only the test API container `bsu-auth-v88-api` on port 8001 after checks pass. Do not restart main `api` on 8000.
