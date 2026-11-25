# V8.16 — документы подразделений (тестовая среда)

- Установка: скопировать архив в корень проекта и запустить `python scripts/apply-v8-16.py`.
- После проверок `python -m compileall -q backend/app backend/alembic/versions`, `npx tsc --noEmit`, `npm run lint`, `docker compose build api`.
- Тест без подключения к PostgreSQL: `docker compose run --rm --no-deps api python -m app.test_document_workflow`.
- Миграция **только тестовой** базы `bsu_auth_v88_test`: `docker compose run --rm --no-deps -e "DATABASE_URL=$testUrl" api alembic upgrade head` (в PowerShell предварительно задать `$testUrl`).
- Пересоздать **только** контейнер `bsu-auth-v88-api`, который слушает 127.0.0.1:8001; не перезапускать основной API 8000.
- Редактор: `/admin/documents-workflow` (faculty/department). ЦЦР: `/admin/document-review`. Тестовая публичная страница: `/documents/approved-test`.
- Файлы PDF/DOCX/XLSX <=10 МБ. Сервер проверяет формат по содержимому; файлы лежат в тестовой PostgreSQL. Непринятые заявки недоступны публично. После одобрения файл копируется в `published_document_files`, а метаданные — в `documents` *тестовой* БД.
- Текущие документы из main DB на 8000 по-прежнему работают отдельно: тестовые утверждённые документы пока **не добавляются в основной `/documents` каталог**.
- Не вводить персональные/конфиденциальные данные в публичные документы без разрешения. Не открывать API тестовой среды во внешний интернет.
- Этот модуль не реализует удаление или изменение уже опубликованных документов — для этого нужна ревизионная модель.
