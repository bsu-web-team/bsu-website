# BSU Backend Ready V1

Proposed contract (not yet agreed with backend). Base URL includes /api/v1.

GET /faculties, /departments, /staff, /programs, /news, /documents: return an array matching the current *Record types in src/lib, or { items, total }. Pagination must be agreed before enabling. Preserve stable slugs, relationships, and archive IDs.

Run node scripts/export-backend.cjs to create backend-export/ with JSON snapshots and manifest. It does not write to the database. Copy the referenced public media separately. Do not delete raw archive records.

Environment: BSU_DATA_SOURCE=local (default), BSU_API_BASE_URL=https://backend.example/api/v1. Set backend only after API contract and response validation. The adapter is staged but not wired into pages yet. Existing static imports require separate migration. No automatic fallback on server errors. No secrets in NEXT_PUBLIC variables.

Archive language codes ru, ky, en, cn; frontend ru, ky, en, zh-CN. Preserve original locale and map cn to zh-CN at boundary.
