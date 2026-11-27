/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const nav = fs.readFileSync(path.join(root, 'src/components/admin/AdminQuickNav.tsx'), 'utf8');
const layout = fs.readFileSync(path.join(root, 'src/app/admin/layout.tsx'), 'utf8');
const roles = ['ccr', 'faculty', 'department', 'news_editor'];
const paths = [...nav.matchAll(/href:\s*"(\/admin[^\"]*)"/g)].map(x => x[1]);
function isPage(route) {
  return fs.existsSync(path.join(root, 'src/app', route.replace(/^\//, ''), 'page.tsx'));
}
const missing = [...new Set(paths)].filter(x => !isPage(x));
const errors = [];
if (!layout.includes('AdminQuickNav') || !layout.includes('<AdminQuickNav role={principal.role}')) errors.push('Layout does not mount authenticated navigation');
for (const role of roles) if (!nav.includes(`${role}:`)) errors.push(`No navigation for ${role}`);
if (missing.length) errors.push(`Missing pages: ${missing.join(', ')}`);
if (errors.length) { for (const msg of errors) console.error('FAIL:', msg); process.exitCode = 1; }
else console.log(`PASS V8.21: ${roles.length} role menus, ${new Set(paths).size} page links, authenticated layout`);
