# Backend adapter V3

Default: local data, no network requests. Server route entry imports for six entity types go through src/lib/backend/data.ts. Client components and direct static array imports are unchanged. Detail lookup uses the collection endpoint; pagination and full schemas must be agreed before enabling.

BSU_DATA_SOURCE=local
BSU_API_BASE_URL=https://your-backend/api/v1

Do not enable backend until API contract, build and tests pass. No silent fallback on API failures. The current API transport uses no-store; review Next Cache Components and revalidation before production. Archive, translations, homepage static imports and leadership snapshot remain local and need a separate migration.

Run npm run lint, npx tsc --noEmit and npm run build.
