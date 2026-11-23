# BSU V7.4 — Backend API contract (draft)

This document records **current Next.js adapter expectations**, not a deployed API. Keep `BSU_DATA_SOURCE=local` until integration tests pass.

## Connection

`BSU_API_BASE_URL` must point to the Backend API root, including `/api/v1` (e.g. `http://backend:8000/api/v1`). Docker `localhost` points to the frontend container, not to the host or Backend container.

Switches: `BSU_DATA_SOURCE=backend` for structured content; additionally `BSU_CONTENT_SOURCE=backend` for archive material. The defaults are `local`.

## Required endpoints (GET, JSON)

| Path | Current expected response |
|---|---|
| `/faculties` | array of FacultyRecord or `{ "items": [...] }` |
| `/departments` | array of DepartmentRecord or `{ "items": [...] }` |
| `/staff` | array of StaffRecord or `{ "items": [...] }` |
| `/programs` | array of ProgramRecord or `{ "items": [...] }` |
| `/news` | array of NewsRecord or `{ "items": [...] }` |
| `/documents` | array of DocumentRecord or `{ "items": [...] }` |
| `/content/{id}` | Material JSON; only once archival Backend mode is enabled |

**Warning:** existing `src/lib/backend/data.ts` loads whole collections and looks up detail by slug in memory; `{ "items": [...], "total": 100 }` with fewer than 100 records **fails**. Do not enable paginated endpoints until the adapter supports them. Return HTTP 404 for missing details. No silent fallback after API failure.

## Frontend required fields

- FacultyRecord: `slug`, `name`, `kind` (`faculty` or `institute`), `category`, `summary`, `leadTitle` (`Декан` or `Директор`), `leader`, `sourceUrl`. Optional: `shortName`, `phone`, `email`, `address`, `departments` (string array), `programs` ({title, degree?, code?} array).
- DepartmentRecord: `slug`, `name`, `facultySlug`, `facultyName`, `facultySourceUrl`.
- StaffRecord: `slug`, `name`, `position`, `facultySlug`, `facultyName`, `sourceUrl`. Optional: `photoUrl`, `departmentSlug`, `biography`, `publications` ({title,url?} array), `personalEmail`, `personalPhone`. Do not publish private data without approval.
- ProgramRecord: `slug`, `title`, `level` (`Бакалавриат`, `Магистратура`, `PhD`), `facultySlug`, `facultyName`, `sourceUrl`. Optional: `code`, `profile`, `duration`, `languages`, `description`.
- NewsRecord: `slug`, `title`, `date` (YYYY-MM-DD), `category` (`Новости`, `Наука`, `Международное сотрудничество`, `Мероприятия`), `excerpt`, `sourceUrl`. Optional: `imageUrl`, `content` (string array), `facultySlug`, `departmentSlug`, `tags` (string array).
- DocumentRecord: `slug`, `title`, `category` (`Нормативные документы`, `Наука`, `Абитуриентам`, `Учебный процесс`), `description`, `sourceUrl`, `format` (`Страница сайта`), `status` (`Ссылка на источник`). These are currently links, not imported PDF files.
- Material: `title:string`, `lang` (`ru`,`ky`,`en`,`cn`), `blocks` ({kind,text?,href?,rows?,links?} array), `variants` ({id,lang,title} array). UI uses locale `zh-CN`, but historical Material.lang is `cn`. Preserve public IDs including `*-draft-*`.

These fields are transcribed from the repository's existing TypeScript data types; confirm with a representative JSON response rather than assuming that Backend already implements them.

## Required before enabling live API

1. Receive OpenAPI/Swagger, staging address, sample responses, pagination and authentication plans.
2. Preserve `slug`, archive IDs, faculty/department relationships, and all locale versions RU/KY/EN/CN.
3. Provide published media URLs and permission checks for private fields.
4. Agree on cache invalidation: current `backendGet()` uses `cache:'no-store'` and an 8-second timeout, which needs redesign for high traffic.
5. Validate schemas, test static and dynamic page rendering, navigation, search and mobile views; no production cutover without staging tests.
6. Deploy database with persistent volumes, indexes, backups, restore testing and connection pooling.
7. Test complete infrastructure with real Backend on a separate load-generator machine. No 10k-user guarantee from static HTML tests alone.

## Request to backend developer

Please provide Swagger/OpenAPI (`openapi.json`), staging API URL, examples for all six collections and archive content, stable slug/locale mapping, PostgreSQL migration status, expected pagination, media storage strategy and authorization design. Do not send real passwords or tokens.
