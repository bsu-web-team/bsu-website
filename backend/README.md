# BSU API (MVP)

Read-only public REST API for the Bishkek State University website.
FastAPI + PostgreSQL + SQLAlchemy + Alembic.

It implements `docs/BACKEND_API_CONTRACT_V7_4.md` and passes
`scripts/check-backend-api.cjs`. Responses are identical to the website's local
data, so switching the website to `BSU_DATA_SOURCE=backend` changes where data
comes from, not what visitors see.

> **Scope:** public read-only API. There is **no admin API, authentication or
> file upload yet** (see "Not included" below). Content is the preliminary
> snapshot from bsu.kg and must be verified by BSU before publication.

## Endpoints

All under `/api/v1`. Interactive docs: `/docs`, schema: `/openapi.json`.

| Method | Path | Notes |
|--------|------|-------|
| GET | `/health` | `{"status":"ok","database":"ok"}`, or `503` if the database is down |
| GET | `/faculties`, `/faculties/{slug}` | |
| GET | `/departments`, `/departments/{slug}` | filter `?facultySlug=` |
| GET | `/staff`, `/staff/{slug}` | filter `?facultySlug=`; personal contacts hidden unless approved |
| GET | `/programs`, `/programs/{slug}` | filters `?facultySlug=`, `?level=` |
| GET | `/news`, `/news/{slug}` | newest first; filters `?facultySlug=`, `?category=`; drafts hidden |
| GET | `/documents`, `/documents/{slug}` | filter `?category=` |
| GET | `/content/{id}` | archive page (Material) by its existing public id |

- Collections return **all** items: `{"items": [...], "total": N}` with
  `total == len(items)`. The website adapter does not support pagination yet.
- Unknown slug or id: `404`. Invalid filter value: `422`.
- JSON keys are camelCase; empty optional fields are omitted (never `null`).

## Quick start with Docker (recommended)

From the **repository root**:

```bash
docker compose up -d --build
```

```bash
node scripts/export-backend.cjs
```

```bash
docker compose run --rm api python -m app.seed --source /export
```

```bash
node scripts/check-backend-api.cjs http://127.0.0.1:8000/api/v1
```

Then open http://127.0.0.1:8000/docs.

`docker compose up` starts PostgreSQL 17 and the API; the API applies database
migrations on start. Step 2 needs `npm install` once (the export script uses the
website's TypeScript sources). Step 3 imports the export into the database.

Stop with `docker compose down`. `docker compose down -v` also **deletes the
database volume**.

## Run the API without Docker (for development)

PostgreSQL still runs in Docker:

```bash
docker compose up -d db
```

From `backend/` (Windows PowerShell; on macOS/Linux use `.venv/bin/...`):

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements-dev.txt
Copy-Item .env.example .env
.\.venv\Scripts\python.exe -m alembic upgrade head
.\.venv\Scripts\python.exe -m app.seed --source ..\backend-export
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Stop the Docker `api` service first (`docker compose stop api`), otherwise port
8000 is taken. Python 3.12+ is required; all dependencies ship prebuilt wheels
for Windows, so no C++ compiler is needed.

## Connect the website

In the repository root, create `.env.local` (see `.env.example`):

```env
BSU_DATA_SOURCE=backend
BSU_CONTENT_SOURCE=backend
BSU_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Then `npm run dev` or `npm run build`. With `BSU_DATA_SOURCE=backend` the
website does **not** fall back to local data: if the API is down, pages fail
(contract rule). API responses are cached by the website for a few minutes
(`src/lib/backend/client.ts`, `"use cache"` + `cacheLife('minutes')`).

Inside Docker, use the service name instead of localhost, e.g.
`http://api:8000/api/v1` on the same Compose network.

## Data import (`app.seed`)

```bash
python -m app.seed --source ../backend-export [--skip-content]
```

- Source: the folder created by `node scripts/export-backend.cjs`
  (faculties, departments, staff, programs, news, documents, archive,
  integratedContent).
- **Replaces** all content in one transaction. Any invalid record (unknown
  category, bad date, unknown faculty/department, duplicate slug) aborts the
  import and leaves the database unchanged.
- Archive materials with `lang: "zh-CN"` are stored as `cn`, the code the
  contract and the website validator expect.
- Imported personal contacts (`personalEmail`, `personalPhone`) are stored but
  **not published** until `staff.contacts_public` is set to true.

## Project layout

```
backend/
├── app/
│   ├── main.py          # FastAPI app, /health, router registration
│   ├── config.py        # settings from env / .env (DATABASE_URL, ENABLE_DOCS)
│   ├── db.py            # engine (connection pool) and per-request session
│   ├── models.py        # database tables (SQLAlchemy)
│   ├── schemas.py       # API shapes (Pydantic), mirror the website's TS types
│   ├── seed.py          # validated import of the website export
│   └── routers/         # one file per collection + content
├── alembic/             # migrations (versions/0001 = initial schema)
├── tests/               # pytest; fixtures/export = small test dataset
├── Dockerfile
└── requirements*.txt
```

### Database design

- Tables: `faculties`, `departments`, `staff`, `programs`, `news`,
  `documents`, `materials`.
- Relations use foreign keys (`faculty_id`, `department_id`); names such as
  `facultyName` are joined at query time, not copied.
- `faculty.departments` in the API is built from the `departments` table.
- Nested lists without their own identity (faculty programme list, news
  paragraphs, tags, archive blocks) are JSONB columns.
- `position` keeps the source order, so lists match the website exactly.

### Changing the schema

1. Edit `app/models.py`.
2. `alembic revision --autogenerate -m "describe change"`, review the file in `alembic/versions/`.
3. `alembic upgrade head`.

Never edit a migration that has already been applied on a shared database.

## Tests

PostgreSQL must be running (`docker compose up -d db`). Tests use a separate
database `bsu_test` (created automatically; override with `TEST_DATABASE_URL`).

```bash
python -m pytest
```

They run all migrations from scratch, test every endpoint, filters, 404s,
draft/private-data rules and import validation. If `backend-export/` exists,
they also compare every API response with the full website data.
GitHub Actions runs them on changes in `backend/` (`.github/workflows/backend-ci.yml`).

## Not included yet

- Admin API, authentication, roles, audit log (`docs/ADMIN_API_CONTRACT.md`).
  `/admin` on the website remains an unauthenticated prototype.
- File uploads / media storage, translated content per locale for collections.
- Pagination (the website adapter needs to support it first).
- Production deployment (TLS, backups, monitoring, secrets). Do not expose the
  API or PostgreSQL ports publicly; the Compose file binds them to 127.0.0.1.
