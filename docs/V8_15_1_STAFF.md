# BSU V8.15.1 — сотрудники

- `/admin/staff`: scoped faculty/department staff roster; create draft for new or existing staff.
- `/admin/staff-review`: CCR-only review; approved draft updates or inserts into `staff` in **test DB**.
- `/api/v1/admin-staff/...`: authenticated API. Scope from session, not client-supplied ids. No personal contacts accepted; photos read-only.
- `0007_staff_drafts` migration is applied **only to `bsu_auth_v88_test`**.
- Old demo staff editor in CCR workspace remains demo; new review module is separate.
- Main public Backend 8000 is untouched. To view approved staff from test API requires explicit preview configuration later; this is **not** live deployment.
- Current scope has no draft editing after save: rejected drafts can be resubmitted without changing fields. To correct content, create a new draft; later version adds real editing.
- All current staff change actions need explicit CCR approval. No bulk delete. Do not store private contact details in biography.
