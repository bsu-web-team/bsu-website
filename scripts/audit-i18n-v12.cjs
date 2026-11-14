/* eslint-disable @typescript-eslint/no-require-imports */
/* Reports possible hard-coded Russian text in public JSX/TSX files.
 * Heuristic only: not a proof that translations are incomplete.
 * Excludes source data, translation dictionaries and the demo admin panel.
 */
const fs = require('node:fs');
const path = require('node:path');
const roots = ['src/app', 'src/components'];
const ignore = [path.sep+'admin'+path.sep, path.sep+'i18n'+path.sep];
const results = [];
function visit(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (ignore.some(part => file.includes(part))) continue;
    if (entry.isDirectory()) visit(file);
    else if (/\.tsx$/.test(entry.name)) {
      const lines=fs.readFileSync(file,'utf8').split(/\r?\n/);
      for (let i=0;i<lines.length;i++) {
        // Highlight Cyrillic in literal JSX text or quoted strings, excluding comments and imports.
        const line=lines[i];
        if (/[А-Яа-яЁёҢңӨөҮү]/.test(line) && (/>[^<{]*[А-Яа-яЁё]/.test(line) || /(?:title|placeholder|aria-label|alt)="[^"]*[А-Яа-яЁё]/.test(line))) {
          results.push(`${file}:${i+1}: ${line.trim().slice(0,180)}`);
        }
      }
    }
  }
}
roots.forEach(visit);
console.log('Potential hard-coded Cyrillic in public JSX:');
console.log(results.length ? results.join('\n') : 'No direct JSX matches found. Review dynamic data and translations manually.');
console.log(`\nCandidates: ${results.length}. Heuristic only; false positives are possible.`);
