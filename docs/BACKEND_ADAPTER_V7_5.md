# BSU V7.5 — API adapter (proposed)

## Safe defaults

`BSU_DATA_SOURCE=local` and `BSU_CONTENT_SOURCE=local` remain unchanged. No API or PostgreSQL is required. `BSU_API_REVALIDATE_SECONDS=0` (default) preserves fetch `no-store` behavior; revalidation is opt-in after verifying Next.js 16 cache settings, API freshness, and interaction with multiple replicas. Different Docker replicas do **not** share an in-memory cache by default.

## Backend mode only

- Requests fail explicitly for timeouts, non-JSON responses, HTTP errors or invalid `slug`; no silent switch to local snapshots.
- Supports the existing unpaginated arrays and `{items,total}` payloads.
- When `total>items.length`, expects **page-number pagination** at `?page=N&page_size=100`, with every response including `items` and, preferably, consistent `total`. This is a **proposed contract**, NOT confirmed by Backend. Test against Swagger before setting `BSU_DATA_SOURCE=backend`.
- Refuses duplicate slugs, empty pages, changed totals, and exceeding `BSU_API_MAX_PAGES` (default 100). Snapshot consistency during concurrent writes must be agreed with Backend (cursor pagination is preferable for changing datasets).
- Collection detail lookups still fetch the full list; a future version should use single-item detail endpoints once agreed. Search and homepage static imports remain unchanged.
- Current schema checking verifies `slug` but is not full runtime validation of each record's fields; full validation requires Backend contract fixtures.

## Optional variables (for a staging Backend, NOT needed now)

```
BSU_DATA_SOURCE=local
BSU_CONTENT_SOURCE=local
BSU_API_BASE_URL=
BSU_API_REVALIDATE_SECONDS=0
BSU_API_TIMEOUT_MS=8000
BSU_API_PAGE_SIZE=100
BSU_API_MAX_PAGES=100
```

Do not commit secrets or credentials. Never point a public production site to a development API.

## Integration verification

1. Copy the two `.ts` files into `src/lib/backend/` (replace existing files after backup).
2. Run `npx tsc --noEmit`, `npm run lint`, and `npm run build`.
3. Keep the local source mode. Verify faculty, department, staff, news, programs, document and archive pages.
4. After Backend Swagger available: test staging API with actual content and page 2, language mappings, consistency, error handling, and revalidation.
5. Only then consider switching `BSU_DATA_SOURCE=backend` and `BSU_CONTENT_SOURCE=backend` separately.

No Docker or Caddy changes in this patch. No stress tests required for this phase.
