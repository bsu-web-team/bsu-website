# V8.15.3 — фотографии сотрудников

Установка: распаковать ZIP в корень проекта, `python scripts/apply-v8-15-3.py`.

Обновление содержит отдельные хранилища изображения заявки (`staff_draft_photos`) и утверждённого фото (`staff_public_photos`). MIME и содержимое проверяет Pillow (JPEG, PNG, WebP; 5MB; 25MP). Административный предпросмотр требует действующую сессию; публичный путь отдаёт только копию, утверждённую ЦЦР. Для тестовой публикации Next проксирует `/api/staff-photo-public?slug=...` к 8001. В production этот маршрут возвращает 404.

Проверки: `python -m compileall -q backend/app backend/alembic/versions`; `npx tsc --noEmit`; `npm run lint`; `docker compose build api`; `docker compose run --rm --no-deps api python -m app.test_staff_photos`.

Миграция ТОЛЬКО тестовой базы `bsu_auth_v88_test`: `docker compose run --rm --no-deps -e "DATABASE_URL=$testUrl" api alembic upgrade head` (revision `0008_staff_photos`). Перезапустить контейнер API на 8001 с `DATABASE_URL=$testUrl`; 8000 и главную БД не трогать.

Важно: вкладка «Сотрудники» читает список из тестовой базы; оригинальный публичный список на 8000 пока не изменится. Новая фотография попадает на публичный тестовый маршрут только при одобрении ЦЦР. При новой заявке старое фото сохраняется до одобрения.
