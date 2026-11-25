/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const target = path.join(process.cwd(), 'src', 'components', 'admin', 'AdminWorkspace.tsx');
if (!fs.existsSync(target)) { console.error('AdminWorkspace.tsx not found'); process.exit(1); }
const src = fs.readFileSync(target, 'utf8');
const anchor = '<main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">';
const marker = 'data-ccr-news-review="v8.5"';
if (src.includes(marker)) { console.log('CCR moderation link already installed.'); process.exit(0); }
if (!src.includes(anchor)) { console.error('AdminWorkspace layout changed; no modifications made.'); process.exit(1); }
const insert = `<div ${marker} className="mb-6 flex flex-col gap-4 rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50 to-white p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">ЦЦР · редакционная работа</p><h2 className="mt-1 text-lg font-bold text-[#204774]">Проверка новостей от факультетов и кафедр</h2><p className="mt-1 text-sm text-slate-600">Единая очередь: одобрение, возврат на доработку и история решений (демо).</p></div><Link href="/admin/review" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#204774] px-5 py-3 text-sm font-semibold text-white hover:bg-[#163760]"><Newspaper size={18}/> Открыть проверку новостей</Link></div>`;
const backup = target + '.v8-5.bak';
if (!fs.existsSync(backup)) fs.copyFileSync(target, backup);
fs.writeFileSync(target, src.replace(anchor, anchor + insert), 'utf8');
console.log('CCR moderation section installed in /admin. Backup:', backup);
