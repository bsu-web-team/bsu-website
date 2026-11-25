# V8.14.3: Approved-only public unit profile overlay

- API existing `/api/v1/faculties` and `/api/v1/departments` remains unchanged; V7.4 contract preserved.
- New public GET `/api/v1/admin-unit-profiles/published/{faculty|department}/{slug}` returns only a CCR-approved snapshot. No admin credentials required. `published:false` before approval.
- Pending, rejected and newly edited drafts never affect the last approved public snapshot.
- Frontend opt-in via `BSU_UNIT_PUBLICATION_BASE_URL=http://127.0.0.1:8001/api/v1` in `.env.local`. Remove line to disable overlay.
- Cache Components uses `cacheLife('minutes')`: refresh after caching interval, not necessarily instant. Restart Next dev after env change.
- No migration required. Main Backend port 8000 remains untouched.
- IMPORTANT: `contact` is a free text field, and is displayed as an approved contact text block. Does not overwrite existing phone/email/address because parsing free text is unsafe.
- After successful tests, coordinate with backend owner before production deployment. All admin routes remain development-only.
