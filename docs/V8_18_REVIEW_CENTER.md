# BSU V8.18 — Unified CCR review center

- URL: `/admin/review-center` (development-only, CCR role required via server session).
- Browser requests use existing same-origin BFF routes, which forward HttpOnly admin session credentials only server-side to test Backend (normally port 8001).
- Queues: news, unit profiles, staff, documents, educational programs.
- Filter by kind, status, search title/IDs; see recent actions and links to full review screens.
- This step is **read-only aggregation**. Approve/reject remains in existing CCR modules, avoiding duplicate permission/publication logic.
- Does not alter API contracts, database schema, public site or Docker images.
- Incomplete upstream loads are prominently reported; displayed totals may be partial.
- Do not expose admin modules to production before production authorization and security assessment.
