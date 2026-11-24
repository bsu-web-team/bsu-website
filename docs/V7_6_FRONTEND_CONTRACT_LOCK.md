# BSU V7.6 — Frontend-only contract lock

**The previously sent V7.4 Backend API contract remains the sole Backend requirement document.**
This change does not request any new endpoint, query parameter, database field or behavior from the Backend team.

## Changes

- Existing six collections: arrays or `{items,total}` with complete data remain supported.
- Reject duplicate slugs even in unpaginated responses.
- If an API sends a partially paginated collection, fail explicitly by default rather than assuming `?page=N&page_size=100` is supported.
- Once Swagger confirms page-number pagination, Frontend may **explicitly** opt in via `BSU_API_PAGINATION=page`. This is an implementation option, not a Backend requirement. Other pagination schemes will be adapted on Frontend to match the real API.
- Prevent a supplied relative endpoint from navigating out of configured API base path.
- `BSU_DATA_SOURCE=local` remains the default; no API/database required for current website.
- `BSU_API_REVALIDATE_SECONDS=0` remains default; do not enable caching until consistency requirements and Next.js behavior are validated.

## Non-goals

- No new Backend work tickets.
- No changes to database schema, admin authorization, public UX, translation keys or content IDs.
- No claim of production readiness or 10k simultaneous-user capacity.

## Verification

After copying the two TS files, run `npx tsc --noEmit`, `npm run lint`, `npm run build`. No stress test needed.

Keep `BSU_DATA_SOURCE=local` and `BSU_CONTENT_SOURCE=local` in `deploy/.env`.

Before switching to Backend, obtain the already requested Swagger and staging URL, then adapt Frontend only.
