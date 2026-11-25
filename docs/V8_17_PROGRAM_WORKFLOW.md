# BSU V8.17 — образовательные программы

## Scope

- Faculty accounts can create proposals and propose edits to existing programs owned by their faculty.
- Department accounts can propose **new** faculty-scoped programs; edits to existing faculty-wide programs are not allowed until a department ownership column exists.
- CCR alone can approve or request corrections.
- New submissions and edits remain private until approved. CCR approval creates/updates the `programs` record **only in the database of the API instance used**.
- No file/photo uploads. No personal information. Public V7.4 `/programs` schema unchanged.
- Main public site (8000) remains unchanged: use the separate test preview `/programs/approved-test` reading 8001.

## Install

Extract ZIP to repository root. `python scripts/apply-v8-17.py`.
Then compile / lint and Docker image build. Run `python -m app.test_program_workflow` inside test image.
Run Alembic `upgrade head` with `DATABASE_URL` pointing **only** to `bsu_auth_v88_test`.
Restart **only** test API on 8001. Restart Next on 3100.

## Paths

- `/admin/programs-workflow` faculty/department editor
- `/admin/program-review` CCR decisions
- `/programs/approved-test` test public programs (8001)

## Security

Protected development BFF obtains token from HttpOnly cookie. Backend authorizes all operations.
Unit ownership comes from authenticated user, not from request body.
Never run migration against the main `bsu` database until reviewed for deployment.

## Limitations

No real PR merge, CI results, or production validation implied. Test locally before adopting.
