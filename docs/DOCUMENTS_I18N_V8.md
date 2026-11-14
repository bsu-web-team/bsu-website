# Documents v8 — four-language UI

- Uses LocaleProvider to render RU, KY, EN, ZH-CN for the documents index and five detail pages.
- Search includes translated titles and descriptions (and the original Russian title), with category filtering via stable original category keys.
- Source URLs and original records in `src/lib/document-data.ts` remain unchanged.
- Translations are drafts; require university editorial review. Original linked pages may still be Russian.
- Server-rendered metadata remains Russian until locale-aware routing is implemented.
- Does not touch `Header.tsx`, `layout.tsx` or `globals.css`.
