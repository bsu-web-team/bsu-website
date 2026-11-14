/* eslint-disable @typescript-eslint/no-require-imports */
/* Safe, repeatable update for localized accessibility labels. */
const fs = require('node:fs');
const path = require('node:path');
const changes = [
  {
    file: 'src/components/layout/Header.tsx',
    before: 'aria-label="BSU home"',
    after: 'aria-label={t("uniName")}',
  },
  {
    file: 'src/components/layout/MegaMenu.tsx',
    before: 'aria-label="Main navigation"',
    after: 'aria-label={t("navLabel")}',
  },
];
let changed = 0;
for (const item of changes) {
  const filePath = path.join(process.cwd(), item.file);
  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${item.file}`);
    process.exitCode = 1;
    continue;
  }
  const source = fs.readFileSync(filePath, 'utf8');
  if (source.includes(item.after)) {
    console.log(`Already fixed: ${item.file}`);
    continue;
  }
  if (!source.includes(item.before)) {
    console.error(`Unexpected contents in ${item.file}; no change applied`);
    process.exitCode = 1;
    continue;
  }
  const updated = source.replace(item.before, item.after);
  fs.writeFileSync(filePath, updated, 'utf8');
  changed++;
  console.log(`Updated: ${item.file}`);
}
console.log(`Done. Updated ${changed} file(s).`);
