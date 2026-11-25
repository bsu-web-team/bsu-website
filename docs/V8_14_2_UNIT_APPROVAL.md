# V8.14.2 — CCR approval of faculty and department profile drafts

- Server roles enforced: faculty/department can see and edit only their own profile. CCR-only review and decision.
- A submitted draft is locked; CCR can return with required feedback, or approve.
- Approved snapshot retained in `approved_description`, `approved_contact` for comparison after future changes.
- **IMPORTANT** approved snapshot is NOT published to public `faculties` or `departments`. That integration belongs to V8.14.3 and backend team review.
- Test DB only (`bsu_auth_v88_test`). Main DB (`bsu`) must remain unchanged.
- `python -m app.test_unit_profile_review` uses SQLite in-memory.

## Install

Extract ZIP to project root; run `python scripts/apply-v8-14-2.py`.

```powershell
python -m compileall -q backend/app backend/alembic/versions
npx tsc --noEmit
npm run lint
docker compose build api
docker compose run --rm --no-deps api python -m app.test_unit_profile_review
$testUrl = "postgresql://bsu:bsu_local_password@db:5432/bsu_auth_v88_test"
docker compose run --rm --no-deps -e "DATABASE_URL=$testUrl" api alembic upgrade head
```

Recreate ONLY test port 8001 container, then visit `/admin/faculty` as faculty and `/admin/unit-review` as CCR. Never restart the port 8000 API for this development patch.
