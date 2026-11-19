# BSU API (learning prototype)

A small FastAPI backend for the BSU website. It is built step by step, starting
with one simple resource (news), so the team can practise before designing the
full system.

> Status: **step 2**. News are read from a JSON file. There is no database,
> no authentication and no write endpoints yet. The website can read news from
> this API and falls back to its local data when the API is not available.

## Roadmap

| Step | What | Status |
|------|------|--------|
| 0 | FastAPI app + `GET /api/v1/health` | done |
| 1 | Read-only news API from a JSON file | done |
| 2 | Next.js `getNews()` calls the API, with fallback to local data | done |
| 3 | PostgreSQL (Docker) + SQLAlchemy + Alembic migrations + seed script | next |
| 4 | Admin write endpoints (`POST`/`PATCH`), draft vs published | planned |
| 5 | Authentication and roles, checked on the server | planned |

The API contract is described in `../docs/NEWS_API_CONTRACT.md`.

## Project layout

```
backend/
├── app/
│   ├── main.py         # FastAPI app and routes (URLs)
│   ├── schemas.py      # Pydantic models: data shape and validation
│   ├── news_store.py   # Where data comes from (JSON now, PostgreSQL in step 3)
│   └── data/news.json  # The 6 sample news items, copied from src/lib/news-data.ts
├── tests/test_news.py  # Automatic tests (pytest)
├── requirements.txt     # Runtime dependencies
├── requirements-dev.txt # Runtime + test dependencies
└── .env.example        # Example settings for step 3
```

Routes (`main.py`) only call functions from `news_store.py`. When the data moves
to PostgreSQL, only `news_store.py` changes; the URLs and responses stay the same.

## Requirements

- Python 3.12 or newer: check with `python --version`.
- Docker Desktop (only needed from step 3).

## Run locally (Windows PowerShell)

All commands run from the `backend` folder.

```powershell
cd backend
```

Create a virtual environment (an isolated folder for this project's packages; once):

```powershell
python -m venv .venv
```

Activate it (every time you open a new terminal):

```powershell
.\.venv\Scripts\Activate.ps1
```

If PowerShell blocks the script, allow local scripts for your user once:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Install dependencies:

```powershell
pip install -r requirements-dev.txt
```

Start the server (`--reload` restarts it when you save a file):

```powershell
uvicorn app.main:app --reload
```

On macOS/Linux, activate with `source .venv/bin/activate` instead.

## Try it

Open in a browser while the server is running:

- http://127.0.0.1:8000/docs: interactive docs (Swagger UI); press **Try it out** on any endpoint
- http://127.0.0.1:8000/api/v1/health
- http://127.0.0.1:8000/api/v1/news?limit=3
- http://127.0.0.1:8000/api/v1/news?category=Наука
- http://127.0.0.1:8000/api/v1/news/phd-defense-economics-2026
- http://127.0.0.1:8000/api/v1/news/does-not-exist: returns `404`
- http://127.0.0.1:8000/api/v1/news?limit=999: returns `422` (validation error)

## Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/v1/health` | `{"status": "ok"}` if the server runs |
| GET | `/api/v1/news?category=&page=1&limit=10` | Page of news, newest first |
| GET | `/api/v1/news/{slug}` | One news item, or `404` |

Response of `GET /api/v1/news`:

```json
{
  "items": [
    {
      "slug": "phd-defense-economics-2026",
      "title": "...",
      "date": "2026-10-23",
      "category": "Наука",
      "excerpt": "...",
      "sourceUrl": "https://bsu.kg/ru/bhu-news/"
    }
  ],
  "total": 6,
  "page": 1,
  "limit": 10
}
```

JSON keys are camelCase (`sourceUrl`) to match the frontend `NewsRecord` type;
Python code uses snake_case (`source_url`). See `ApiModel` in `schemas.py`.
Optional fields (`imageUrl`, `content`, `facultySlug`, `departmentSlug`, `tags`)
are omitted when empty, like optional fields in TypeScript.

## Tests

```powershell
pytest
```

## Connect the website to the API (step 2)

The website reads news through `src/lib/news-api.ts` (`getNews()`,
`getNewsBySlug()`). It is used by the home page, `/news`, `/news/[slug]`, and
faculty/department pages.

1. Start the API (see above) and keep that terminal open.
2. In the repository root, create `.env.local` from the example:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   It contains `BSU_API_URL=http://127.0.0.1:8000`.
3. In a second terminal, from the repository root, start the website:

   ```powershell
   npm run dev
   ```

4. Open http://localhost:3000. The uvicorn terminal shows requests such as
   `GET /api/v1/news?limit=50 200 OK`.

How it behaves:

- `BSU_API_URL` not set: local data from `src/lib/news-data.ts` (Vercel today).
- API running: data comes from the API. Try changing a title in
  `app/data/news.json`, restart uvicorn, and wait for the cache (a few minutes,
  `cacheLife("minutes")`) or restart `npm run dev`.
- API stopped or broken: the website logs `[news-api] ... using local news data`
  and still works.
- `BSU_API_URL` is read only on the server. It is not sent to the browser, and
  the browser never calls the API directly (so no CORS setup is needed yet).

## Database (preparation for step 3)

`docker-compose.yml` in the repository root describes a local PostgreSQL 17.
The API does not use it yet, but you can already try it:

```powershell
docker compose up -d db
```

```powershell
docker compose ps
```

Open an SQL console inside the container (type `\q` to exit):

```powershell
docker compose exec db psql -U bsu -d bsu
```

Stop the database (data is kept):

```powershell
docker compose down
```

Stop and **delete all local data**:

```powershell
docker compose down -v
```

The password in `docker-compose.yml` is for local development only. Real servers
get their own credentials through environment variables (`DATABASE_URL`), never
through Git.

## Rules for this backend

- Never commit `.env`, passwords or API keys.
- Do not invent university facts; sample data comes from public bsu.kg pages and
  must be checked by BSU before publication.
- Every write operation (step 4+) must check permissions on the server.
