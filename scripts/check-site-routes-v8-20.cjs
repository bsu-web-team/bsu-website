/* eslint-disable @typescript-eslint/no-require-imports */
/* Static page/link audit. Never modifies files or sends network requests. */
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const app = path.join(root, 'src', 'app');
const walk = (folder, found = []) => {
  if (!fs.existsSync(folder)) return found;
  for (const entry of fs.readdirSync(folder, {withFileTypes:true})) {
    const file = path.join(folder,entry.name);
    if (entry.isDirectory()) walk(file,found);
    else if (entry.isFile()) found.push(file);
  }
  return found;
};
if (!fs.existsSync(app)) {console.error('ERROR: src/app missing'); process.exit(2);}
const pages = walk(app).filter(p => p.endsWith(`${path.sep}page.tsx`) || p.endsWith(`${path.sep}page.jsx`));
const routes = pages.map(p => '/' + path.relative(app,path.dirname(p)).split(path.sep).filter(x => !x.startsWith('(') && !x.startsWith('@')).join('/')).map(x=>x==='/'?x:x.replace(/\/$/,''));
const match = (href) => {
  const target = href.split(/[?#]/,1)[0].replace(/\/$/,'') || '/';
  if (routes.includes(target)) return true;
  return routes.some(route => {
    const re = '^' + route.split('/').map(seg=>{
      if (/^\[\[\.\.\..+\]\]$/.test(seg)) return '(?:.+)?';
      if (/^\[\.\.\..+\]$/.test(seg)) return '.+';
      if (/^\[.+\]$/.test(seg)) return '[^/]+';
      return seg.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    }).join('/') + '$';
    return new RegExp(re).test(target);
  });
};
const required = [
 '/admin','/admin/review-center','/admin/structure','/admin/unit-review',
 '/admin/staff-review','/admin/document-review','/admin/program-review',
 '/admin/editorial-review','/admin/navigation','/admin/faculty',
 '/admin/department','/admin/editor','/admin/staff','/admin/documents-workflow',
 '/admin/programs-workflow','/faculties','/departments','/staff',
 '/programs','/news','/documents','/site-map'
];
const missing = required.filter(p=>!match(p));
console.log(`Found ${pages.length} page files, ${routes.length} routable paths.`);
if (missing.length) console.error('MISSING CORE ROUTES:\n' + missing.map(x=>'  '+x).join('\n'));
else console.log(`PASS: all ${required.length} core routes exist.`);
const refs = new Map();
const rx = /\b(?:href|to)\s*=\s*["'`]((?:\/)[^"'`\s{}]*)["'`]/g;
for (const f of walk(path.join(root,'src')).filter(p=>/\.(tsx|jsx)$/.test(p))) {
 const text=fs.readFileSync(f,'utf8');
 for(const m of text.matchAll(rx)) {
   const u=m[1]; if(u.startsWith('//')||u.startsWith('/api/')||u.startsWith('/_next/')||u.includes('${')||u.includes('['))continue;
   if(!match(u)){const files=refs.get(u)||new Set(); files.add(path.relative(root,f));refs.set(u,files);}
 }
}
if(refs.size) {
 console.log(`WARN: ${refs.size} static links have no matching page route. Review (may include assets or redirects):`);
 for(const [url,files] of [...refs].sort((a,b)=>a[0].localeCompare(b[0])))console.log(`  ${url} [${[...files].slice(0,2).join(', ')}]`);
} else console.log('PASS: no unresolved static page links detected.');
if(missing.length)process.exit(1);
