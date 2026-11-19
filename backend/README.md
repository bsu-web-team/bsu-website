# BSU Backend (FastAPI)

REST API для сайта БГУ им. К. Карасаева. Архитектура и план: [`docs/backend/ARCHITECTURE.md`](../docs/backend/ARCHITECTURE.md).

> Статус: **каркас (этапы 1–2)**. Есть конфигурация, единый формат ошибок, языки, health-проверки,
> миграции и тесты. Контентных эндпоинтов, авторизации и админки пока **нет**. Тестового URL пока нет.

## Что нужно

- Python 3.12+ и [uv](https://docs.astral.sh/uv/) — **или** Docker Desktop.
- PostgreSQL 16 (локально или через Docker Compose).

## Вариант 1: Docker Compose (проще всего)

```bash
cd backend
docker compose up --build
```

- API: http://localhost:8000/api/v1/health
- Swagger: http://localhost:8000/api/docs
- Миграции применяются автоматически при старте.

## Вариант 2: без Docker

```bash
cd backend
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload
```

В `.env` укажите `DATABASE_URL` своей локальной базы. База и пользователь должны существовать заранее.

Установка uv на Windows (PowerShell):

```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

## Тесты и линтер

```bash
uv run pytest
uv run ruff check .
uv run ruff format --check .
```

Тесты, которым нужна база, запускаются, только если задан `TEST_DATABASE_URL`, например
`postgresql+asyncpg://bsu:bsu@localhost:5432/bsu_test`.
Без него проверяется обратное: при недоступной БД `/health/ready` отвечает 503.

## Миграции

```bash
uv run alembic revision --autogenerate -m "describe change"
uv run alembic upgrade head
uv run alembic downgrade -1
```

## Эндпоинты (сейчас)

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/v1/health` | Процесс жив (без БД) |
| GET | `/api/v1/health/ready` | Готовность, проверяет БД; 503 если БД недоступна |
| GET | `/api/v1/locales?lang=` | Поддерживаемые языки и язык, выбранный для запроса |
| GET | `/api/docs`, `/api/openapi.json` | Swagger UI и схема OpenAPI |

## Соглашения для frontend

- **Язык:** `?lang=ru|ky|en|zh-CN` (принимаются синонимы `cn`, `kg` и т.п.), иначе `Accept-Language`, иначе `ru`.
  Неизвестный язык → `400 unsupported_language`.
- **Пагинация:** `?page=1&limit=20` (max 100) → `{items, page, limit, total, pages}`.
- **Ошибки:** всегда `{"error": {"code", "message", "details", "request_id"}}`.
  Коды перечислены в `ARCHITECTURE.md`, раздел 6.
- **`X-Request-ID`** приходит в каждом ответе. Сообщайте его при баг-репортах.

## Структура

```
app/
  main.py          # create_app(): middleware, CORS, ошибки, роутеры
  core/            # config, errors, i18n, pagination, middleware
  db/              # Base (naming convention), async engine/session
  api/v1/          # роутеры
alembic/           # миграции
tests/
```
