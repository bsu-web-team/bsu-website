# BSU V8.10 – Local authenticated admin shells

**Development-only, not approved for Internet deployment.** No real content writes, publishing workflow or authorization enforcement for database mutations. Editorial and workspace editors still use local data/localStorage and are demonstrations only.

Requires separately running test FastAPI on `127.0.0.1:8001` with **test** DB `bsu_auth_v88_test` migrated to `0002_admin`, with an explicitly created test account (`ccr-test`, role `ccr`). The public production backend at 8000 and production DB must not be used for this exercise.

- Next.js server receives username/password and sends credentials to test FastAPI (server-to-server).
- FastAPI session token stored in HTTP-only, SameSite=Strict cookie; client JS cannot read it. This is an initial prototype; additional CSRF, rate-limiting and production session architecture work is required.
- Each admin route verifies `/admin-auth/me` server-side, failing closed on unavailable backend, and checks role.
- Faculty/department UI is restricted to the `facultySlug` or `departmentSlug` returned by FastAPI, without any client-side picker.
- No tokens or passwords printed by application endpoints; never put passwords in Git or screenshots.
- Next endpoints `/api/admin-auth/login` and `/api/admin-auth/logout` are limited to development and same origin.
- `.env.local` optional: `BSU_ADMIN_API_BASE_URL=http://127.0.0.1:8001/api/v1` (default).

Test in dev: `npm run lint`, `npx tsc --noEmit`, `npm run dev`; open `http://localhost:3000/admin/login` and use **test-only** account. If Next runs in Docker, localhost:8001 is not reachable inside container; this procedure targets the Windows Node process.

Important: test login guards do not convert localStorage editors into trusted data. Role permissions for any eventual CRUD API must be enforced in FastAPI; clients are never trusted for tenant/unit scoping. V7.4 public endpoints unchanged.
