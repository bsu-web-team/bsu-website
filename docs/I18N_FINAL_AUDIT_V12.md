# BSU multilingual audit v12

This update is intentionally limited to accessible navigation labels in the public UI.

- Header home link: label follows the selected language.
- Mega-menu: navigation label follows the selected language.
- No font, footer, content, or logo files are replaced by this package.
- `scripts/audit-i18n-v12.cjs` reports *candidates* for untranslated Cyrillic JSX. It is a heuristic and may have false positives.

## Still out of scope

- `/admin` is a demo, and its interface currently contains Russian literals. Translate and redesign this area when implementing the real admin panel.
- Editorial verification of KG/EN/CN translations, legal documents, and official institutional names.
- Browser and mobile regression tests in all four languages.
