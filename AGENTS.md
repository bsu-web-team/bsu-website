# AGENTS.md — BSU Website / Codex working rules

> Applies to this entire repository. Read `docs/PROJECT_CONTEXT.md` before planning or editing. The user's language is Russian; respond to the user in Russian.

## Project identity and non-negotiable requirements
- Product: official website redesign for **Bishkek State University named after Academician Kusein Karasaev** (БГУ имени академика Кусеина Карасаева; КР), replacing/modernizing the experience of `bsu.kg`.
- Repository: `https://github.com/bsu-web-team/bsu-website` (transferred from `cyaneat/bsu-website`). Default branch `main`. Use feature branches and PRs; do not commit directly to `main` unless expressly asked.
- Stack: **Next.js 16.4.6, React 19, TypeScript, Tailwind CSS 4, lucide-react**; check actual `package.json` before changing dependencies.
- Preserve **four UI languages**: `ru`, `ky`, `en`, `zh-CN`; retain real Kyrgyz glyphs (ң ө ү) and Chinese support. Existing i18n lives in `src/lib/i18n.ts`, `src/components/i18n/LocaleProvider.tsx`, `LanguageSwitcher.tsx`; content translation is not the same as UI translation. Do not replace existing localization wholesale.
- Preserve **existing URL paths** and linked page content: `/`, `/about`, `/admissions`, `/faculties`, `/departments`, `/staff`, `/programs`, `/news`, `/documents`, `/science`, `/admin` and nested detail routes. No accidental broken links or page removals.
- **Design chosen by user (16 Nov 2026): BSU Portal** — impactful layered/overlapping photographic panels, large expressive typography, lightweight orbit graphics, 3 distinct scenes, original university navy/white/gold palette. The user explicitly REJECTED changing brand colors, standard full-bleed photo-with-text hero, small rectangular photo cards, and earlier “Open Future” cream/coral redesign. Do not revert to them.
- Current visual requirements: 3 carousel indicators **bottom-center**; inactive indicators are dots, active indicator becomes a short **progress-filling line** that resets when slide changes. Rough observed interval: 6.5 s. Preserve manual switching and mobile responsiveness.
- Scroll reveal animation **must replay** when sections leave/re-enter viewport, up/down. Prefer `IntersectionObserver`, CSS `opacity`/`transform`, respect `prefers-reduced-motion`. Avoid expensive scroll handlers and huge animation libraries for trivial motions.
- Keep intro/loading animation tasteful; avoid blocking real navigation, loading, hydration, and accessibility.
- Keep performance a priority: efficient images, lazy-load offscreen assets, avoid CLS, minimize JS; no animations that substantially reduce usability on lower-end PCs or phones.

## Critical source-of-truth warning
- As checked on **2026-11-16**, GitHub `main` still uses `Hero`, `QuickLinks`, `Education`, `News`, `Services` in `src/app/page.tsx`; `src/components/home/ModernHome.tsx` and `src/app/modern-home.css` were **NOT present in GitHub main**. The selected BSU Portal exists in the user's **local worktree** from downloaded patches and may be uncommitted. **NEVER run `git reset --hard`, `git clean -fd`, switch branches, pull/rebase, or replace local design files without first inspecting status and protecting user work.**
- Before edits: run `pwd`, `git status --short --branch`, `git remote -v`, `git branch --show-current`, inspect `src/app/page.tsx`, `src/components/home/ModernHome.tsx`, `src/app/modern-home.css` if they exist, and compare what is ACTUALLY wired into the homepage. Do not assume ZIP patches installed successfully merely because files are present.
- If `AGENTS.md` or `docs/PROJECT_CONTEXT.md` already exists, merge useful content rather than overwriting.

## Workflow
1. Inspect repository and report a concise state summary: local branch, changed/untracked files, current homepage implementation, `package.json`.
2. For requested work, propose the smallest safe change and implement it in the local project (not a standalone demo). Use separate components for complex interactions and keep CSS scoped and maintainable.
3. Preserve behavior/routes/translations; update localized strings for all 4 locales. Keep real facts about university from verified sources, do not invent rankings, numbers, current leaders or news.
4. Validate with `npm.cmd run lint`, `npm.cmd run build` on Windows (or `npm run ...` in non-Windows shells); test desktop/mobile, keyboard, language switching, animations, reduced-motion. Clearly distinguish tests actually run from tests not run.
5. Show changed files, results, performance implications, and suggested commit; NEVER merge, deploy or expose `/admin` without authorization.
6. Do not add external SaaS/API keys, costs, dependencies or large media files without explaining why and obtaining appropriate approval.

## Safety and API
- `/admin` is currently a **client-only, unauthenticated prototype**; never describe it as production-ready or expose an unrestricted editable admin interface. Backend must enforce auth/authz, publication scopes, audit logging, uploads validation, etc. Read `docs/ADMIN_API_CONTRACT.md`.
- Backend not yet integrated; content is often temporary arrays and sample editorial copy. Never claim live API integration or persistent CMS functionality without verifying.
- Target backend discussed: FastAPI + PostgreSQL + storage, subject to team agreement. REST endpoints use `/api/v1/...`; see docs contracts before changes.
- Do not leak tokens, credentials, private data, or secret keys to browser code. Respect copyright/licensing of campus photos; use approved local university images for production.

## Local environment
- Known Windows work folder: `C:\Users\Байэл Рыскельдиев\Projects\bsu-frontend`.
- Git executable may be installed at `D:\Programs\Git\cmd\git.exe` (not always in PATH). Node at `C:\Program Files\nodejs\node.exe` (observed 26.13.1), npm 11.20.0.
- If command not recognized in PowerShell, for current session only: `$env:Path += ';D:\Programs\Git\cmd;C:\Program Files\nodejs'`.
- Staging uses Vercel with GitHub organization; confirm actual deployment status, do not invent live URL. Treat unprotected `/admin` as launch blocker.

## Current priority
- User approved BSU Portal look and the latest local CSS/component cleanup. Keep this design, audit/optimize code without altering appearance, animations, colors or pages. Next work to be decided by user, not prematurely rebuilding the entire site.

Read `docs/PROJECT_CONTEXT.md` for design history, IA, API outline, ongoing concerns, and context transfer.
