# BSU modern homepage — concept and integration

Design language: editorial, spacious, navy (#102b4e), muted gold (#e2c28a), ivory/white, accessible interactions.

## Sections and links
- Hero → `/admissions`, `/about`
- Quick navigation → `/admissions`, `/programs`, `/staff`, `/news`
- Faculties → `/faculties/{slug}` and `/faculties`
- Programs / science → `/programs`, `/science`
- News → `/news/{slug}`, `/news`
- Services → `/documents`, `/programs`, `/about`, `/science`
- Anchor IDs retained: `#sections`, `#education`, `#news`, `#services`

## Languages
The design uses the **existing** LocaleProvider, `src/lib/i18n.ts` dictionary and published `content-translations.ts` / `news-i18n.ts` modules. RU, KY, EN and zh-CN UI copy is fully included for the new homepage. The faculty and news content is sourced from existing fixtures, not newly invented. Editorial translations still require university review.

## Motion
- Intro fade-up on first paint
- Card reveal with IntersectionObserver
- Hover translation, focus styles, icon and underline motion
- `prefers-reduced-motion: reduce` disables motion
- No animation library dependency

## Important
Hero artwork is an **abstract design illustration**, not an actual BSU campus photograph. Replace it with an authorized university photo/video before public launch. Do not imply otherwise.

Other pages, routes, backend, language provider, shared Header and Footer are not modified. `/admin` remains unauthenticated demo and must be secured/disabled before open production deployment.

## Signature Motion extension

The motion integration adds a 1.15s branded intro, a three-slide accessible hero carousel (localized to all four languages) and a swipeable faculty rail. Motion is CSS/SVG driven and respects `prefers-reduced-motion`; no extra JavaScript animation libraries are needed. The rotating mark is an original decorative motif, not the official university emblem. Existing navigation paths remain unchanged.
