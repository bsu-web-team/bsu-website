# BSU website — conversation decisions and project context

_Last assembled: 2026-11-16. This is a decision log, not proof that every feature was merged or deployed. Inspect local files / GitHub before making claims._

## 1. Goal and stakeholders
Develop a complete, polished, accessible, multilingual website for **Bishkek State University named after Academician Kusein Karasaev (БГУ)**. The client asked for a strong distinctive first impression and creative animations, while keeping the university identity recognizable and the site fast on phones and work computers. It should scale to many concurrent visitors; performance and backend architecture will be addressed separately from the visual redesign. The user works in a **three-person developer team** (user plus a second frontend dev and one backend developer).

Communication: the user generally communicates in Russian and likes concrete, tested changes applied to the *actual* project. Prefer direct file edits through VS Code Codex instead of exchanging ZIP archives. The user often wants to inspect a working result, then iterate.

## 2. Repository, teams, deployment, environments
- GitHub repo: `bsu-web-team/bsu-website` — **this is now the canonical URL**, transferred from the personal repo `cyaneat/bsu-website` on 2026-11-16.
- User GitHub login: `RyskeldievB`; organization `bsu-web-team`; confirmed **Admin permissions** on repo via GitHub connector. `cyaneat` was original personal owner/second developer.
- `main` branch is shared production baseline; previous PRs/features included home page, news, faculties/departments, staff/programs, admissions, science, documents, i18n and more.
- Vercel account is connected/imported for staging; actual successful deployment and live URL **must be checked**. No claim about an already published live address without evidence.
- Some office PCs: project folder `C:\Users\Байэл Рыскельдиев\Projects\bsu-frontend`, elsewhere `C:\Users\adamb\bsu-website`. Do not assume a fixed directory across all machines.
- Windows setup: Git may be in `D:\Programs\Git\cmd\git.exe`, Node in `C:\Program Files\nodejs`; after adding relevant directories to session PATH `git`, `node`, `npm.cmd` work. Observed Node v26.13.1, npm v11.20.0. Git previously appeared missing only due to PATH.
- The user ran `Expand-Archive` for multiple design patch ZIPs *in the local project*. Their local worktree may have modifications unseen on remote. Avoid destructive checkout or reset; preserve and commit/review first.
- On 2026-11-16 GitHub `main` `src/app/page.tsx` still imports old `Hero`, `QuickLinks`, `Education`, `News`, `Services`. `ModernHome.tsx` and `modern-home.css` were not in that branch. **LOCAL state is source of truth for current accepted design until pushed.**

## 3. Stack and architecture
- Next.js **16.4.6**, React **19.3.0**, TypeScript, Tailwind CSS **4.3.3**, `lucide-react`, app router; `next.config.ts` has `cacheComponents: true` and `partialPrefetching: true` at time of audit. Verify before editing.
- Typical source areas: `src/app`, `src/components/layout` (`Header`, `MegaMenu`, `Footer`), `src/components/home`, `src/components/i18n`, `src/lib` data and translations, `docs` for proposed API contracts.
- All pages should preserve header, mobile navigation, footer, search, accurate content hierarchy, existing relative URL routes and accessibility.
- CSS exists in global Tailwind and `modern-home.css` (local, after design patches). Historic iterations left duplicated selectors; previous local patch claimed CSS cleanup from ~44.2 KB to ~22.1 KB. **Re-measure; those were patch figures, not verified production bundle metrics.**

## 4. Languages, typography, localized content
Mandatory languages: **Russian (`ru`), Kyrgyz (`ky`), English (`en`), simplified Chinese (`zh-CN`)**.
- `src/lib/i18n.ts` contains UI dictionaries.
- `src/components/i18n/LocaleProvider.tsx` uses `useSyncExternalStore`, localStorage key `bsu-ui-locale`, event `bsu-locale-change`; `LanguageSwitcher` updates it. Preserve mechanism unless migration approved.
- `src/lib/content-translations.ts` contains exact-text translation fallback for selected content; long-term CMS must store independently edited fields for each locale, e.g. `{ title: { ru,ky,en,"zh-CN" } }`. Exact-match translation can fail silently when Russian text changes; flag fallbacks transparently.
- Kyrgyz fonts must display **ң, ө, ү** correctly; project has `Noto Sans` configured in `src/app/layout.tsx`. Chinese font fallback may use Microsoft YaHei/PingFang SC/Noto Sans CJK SC. Avoid introducing fonts breaking non-Latin scripts.
- Prior final i18n audit still listed hardcoded Cyrillic strings to review; don't assume entire site is fully translated. Existing mock news have editorial draft translations and warnings.

## 5. Information architecture and currently planned content
Major routes and sections (keep exact existing route structure, including dynamic detail routes):
- `/` — Homepage, highlighted BSU Portal visual system, news, education, quick paths, services.
- `/about` — University info, history, mission, rectorate/leadership, structure, contacts; nested pages where present.
- `/faculties`, `/faculties/[slug]` — Faculties and institutes; source adapter `src/lib/faculty-data.ts`.
- `/departments`, `/departments/[slug]` — Departments.
- `/staff`, `/staff/[slug]` — Academics and staff.
- `/programs`, `/programs/[slug]` — Degree programs (bachelor's, master's, PhD/postgraduate where applicable).
- `/admissions` — Admissions, rules, FAQ, international applicants, program paths.
- `/news`, `/news/[slug]` — University news and events.
- `/science`, nested research/conferences/publications/dissertation councils — Science section.
- `/documents`, `/documents/[slug]` — Official documents.
- `/admin` — **prototype only, no real auth/data persistence**.
- Current footer, header and search rely on translation keys and menu configuration; keep links working.

Static adapters and pages are provisional: samples from university sources are not live news feed, official current faculty roster, or full migration. Do not invent content; verify source before presenting facts.

## 6. Design decision history — essential
There were several design experiments in one day. The **LATEST ACCEPTED** decision overrides older concepts:

### First attempts (rejected or superseded)
1. Original university design: typical blue hero with text and separate square image block. Rejected as ordinary and too similar to the existing site.
2. BSU Signature Motion: branded preloader with ornament and university emblem concept; 3-slide carousel, moving headlines, horizontal faculty carousel, scroll reveal. Useful animation decisions retained.
3. Repeated-scroll reveal: user specifically wants blocks to animate not only on first downward scroll but also when scrolling up and returning down. Retained.
4. Carousel indicators: put **three small indicators bottom-center**; inactive circles/dots, active becomes a short loading/progress line. Retained.
5. Campus photos test: three existing BSU/campus photos, soft transitions and subtle zoom; used to judge animations. Photos were from external sources for preview; production requires approved images.
6. Full-width cinematic hero: campus photo filling hero, text overlay, fade/zoom. User found it too similar to current university site. **Do not revert**.
7. “Open Future”: cream background, coral accent, big editorial text and arch-like images. User explicitly said **brand colors cannot change** and result still looked ordinary. **Rejected**.

### CURRENT ACCEPTED: **BSU Portal**
- First screen is a **distinctive layered composition**, not the typical photo-and-text banner.
- Retain familiar brand palette **deep navy + white + gold**. Never switch to cream/coral/mint palette unless asked.
- Large distinctive typography integrated with visual composition.
- Two crossing/overlapping photographic panels with independent subtle motion, creating depth.
- Moving orbit/ring-like graphic detail; avoid gratuitous 3D/canvas dependencies.
- Three carousel scenes with synced text/photos.
- Inactive indicators small dots; active indicator a filling short line centered at bottom of hero. Carousel auto-advances about 6.5 seconds; arrows/manual interaction where currently implemented.
- Responsive on phone; text never overlaps key UI.
- Lightweight CSS GPU-friendly transforms, masking where supported, with reduced-motion accessibility.
- Continue design vocabulary to the rest of the site later, only with user approval; at present user said this concept is satisfactory and wants **code optimization** without changing the look.

## 7. Animation / performance acceptance criteria
- Keep original short branded preloader where present and non-obstructive (previous example about 1.15 sec); show only as appropriate, never slow site/navigation arbitrarily.
- Hero carousel 3 scenes, ~6.5 sec timing; progress line synchronized and resets on manual switch.
- Hero photo transitions should be perceptibly smooth (prior fade/zoom approx 1.1 s) with no flashes/layout shift.
- Scroll reveal animation should replay on each exit/re-entry using `IntersectionObserver`. Debounce/hysteresis or sensible thresholds if needed to avoid flicker near viewport boundary.
- Subtle hover and kinetic effects; accessible buttons, focus states, no motion for `prefers-reduced-motion: reduce`.
- Avoid heavy images, redundant timers, memory leaks, unnecessary `useEffect`, extra rerenders, duplicated CSS and extra packages.
- Most images were test remote URLs; prefer compressed, correctly licensed official university photos hosted locally or approved CDN, and proper Next `Image` sizing/optimization. Respect image hosting config and rights.

## 8. Backend and API plan (NOT yet connected)
Discussed approach: **FastAPI + PostgreSQL + file storage**, to be agreed with backend teammate. Frontend currently relies on local static data for most modules. Proposed REST prefix `/api/v1`.
- Public read APIs: `/faculties`, `/departments`, `/staff`, `/programs`, `/news`, `/documents`, `/pages/{slug}`, `/science/...`, admissions/search. Use pagination and filtering.
- Protected admin: `/api/v1/admin/me`, `/api/v1/admin/{resource}` GET/POST; `/{id}` GET/PATCH/DELETE; `/{id}/publish` POST; `/api/v1/admin/media` POST.
- Security: server-enforced authentication and role-based authorization, secure cookies, CSRF defense, rate limits, audit logs, editorial publication workflow, sanitized rich text, restricted file uploads, backups.
- Separate locale fields in CMS for reviewed translations; SEO/canonical URLs and redirects from legacy `bsu.kg`, preserve stable slugs.
- Read existing `docs/ADMIN_API_CONTRACT.md`, `docs/NEWS_API_CONTRACT.md`, `docs/SCIENCE_API_CONTRACT.md` etc. before changing API shapes.
- Google Translate/DeepL, Maps/2GIS, analytics, email, Cloudflare/S3 etc. were mentioned as **optional**, not essential or approved paid subscriptions.

## 9. Security and launch readiness
- `/admin` is a demo client-only interface, **not authenticated**, no persistent data. DO NOT put publicly usable administrator functionality on internet in this state. Before public staging, enforce protection (deployment auth, route lockout, or proper server auth) depending on supported Vercel settings. Client-side hiding is not security.
- Vercel project was initiated/imported from GitHub organization but deployment URL, success and protection status not verified here. Never invent a URL/status.
- Avoid claiming >1000 concurrent users supported based solely on framework choice. Test under actual workloads; use appropriate caching, edge/CDN, backend load tests and database planning later.

## 10. Latest local update sequence (not guaranteed pushed)
Chronologically user downloaded/extracted archives into local project:
- `bsu-modern-homepage.zip` — initial modern homepage.
- `bsu-signature-motion-integration.zip` — preloader/carousel/orbit/scroll/faculty interactions.
- `bsu-repeat-scroll-animations.zip` — replay reveals on scroll up/down.
- `bsu-carousel-dots.zip` — 3 dots/active progress line bottom center.
- `bsu-carousel-campus-photos.zip` — test campus photos.
- `bsu-fullwidth-hero.zip` — discarded photographic full width hero.
- `bsu-open-future-redesign.zip` — rejected palette/arch design.
- `bsu-portal-wow-concept.zip` — **accepted design**.
- `bsu-portal-optimized.zip` — most recent cleanup, claiming major CSS reduction.

These archives were generated in conversation and downloaded by user, **not necessarily committed**; Codex should inspect existing files instead of recreating past ZIPs or assuming every local patch applied.

## 11. Working instructions for Codex
On first run:
1. Inspect `git status`, branch, origin and homepage imports, check whether `ModernHome.tsx`, `modern-home.css` are actually used.
2. **Save local uncommitted work carefully** (recommend a feature branch / non-destructive backup; ask before modifications when necessary). GitHub `main` may be older than local design.
3. Review current `AGENTS.md` and repository docs. Do not blindly rewrite all architecture or introduce unapproved new appearance.
4. Audit unused CSS, dead imports, duplicated data/translations, timers/observers, image-loading and hydration. Confirm if any old designs remain.
5. Run lint and production build; when tests cannot run report why. Prior lint may fail on legacy CommonJS helper scripts, so isolate pre-existing failures from regressions.
6. Show a prioritized improvement plan; implement only requested scope. Explain exact files changed and how to preview.

## 12. Things not to confuse
- University's main domain `bsu.kg` is the old source and brand reference; `bhu.kg` may occur in some faculty emails. Do not silently change official contact details.
- Temporary prototype screenshots are not production assets.
- User approved BSU Portal visual *direction*, not a blanket redesign or publication to live site.
- The user wants excellent animations **AND** performance; do not solve performance by deleting the signature animated behavior.
