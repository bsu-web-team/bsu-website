// BSU V7.4 read-only API preflight; no writes and no credentials.
// node scripts/check-backend-api.cjs http://127.0.0.1:8000/api/v1
const base = process.argv[2] || process.env.BSU_API_BASE_URL;
if (!base) { console.error('Usage: node scripts/check-backend-api.cjs <staging-api-base-url>'); process.exit(2); }
let root;
try { root = new URL(base.replace(/\/+$/, '') + '/'); if (!['http:', 'https:'].includes(root.protocol)) throw Error('HTTP(S) required'); }
catch (e) { console.error('Invalid URL: ' + e.message); process.exit(2); }
(async () => {
  let failures = 0;
  for (const route of ['faculties', 'departments', 'staff', 'programs', 'news', 'documents']) {
    try {
      const response = await fetch(new URL(route, root), { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw Error('HTTP ' + response.status);
      const json = await response.json();
      const records = Array.isArray(json) ? json : json?.items;
      if (!Array.isArray(records)) throw Error('expected array or {items:[]}');
      if (records.some(x => !x || typeof x.slug !== 'string' || !x.slug)) throw Error('one or more records lack slug');
      if (typeof json?.total === 'number' && json.total > records.length) throw Error('pagination not supported by current frontend adapter');
      console.log('PASS', route, records.length, 'records');
    } catch (e) { failures++; console.error('FAIL', route, e.message); }
  }
  console.log(failures ? `FAILED: ${failures} endpoints` : 'PASS: 6 collection structures');
  if (failures) process.exitCode = 1;
})().catch(e => { console.error(e); process.exitCode = 1; });
