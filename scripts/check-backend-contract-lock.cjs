/* eslint-disable @typescript-eslint/no-require-imports */
// Read-only guard; run with node scripts/check-backend-contract-lock.cjs
// Does not contact Backend and does not change any project files.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = process.cwd();
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const client = read('src/lib/backend/client.ts');
const data = read('src/lib/backend/data.ts');
const compose = read('deploy/compose.yaml');
const contract = read('docs/BACKEND_API_CONTRACT_V7_4.md');
assert.match(compose, /BSU_DATA_SOURCE:.*:-local/);
assert.match(compose, /BSU_CONTENT_SOURCE:.*:-local/);
assert.match(data, /BSU_API_PAGINATION !== 'page'/);
assert.match(data, /Duplicate BSU API slug:/);
assert.match(client, /endpoint escapes configured API base/);
for(const name of ['faculties','departments','staff','programs','news','documents']){
  assert.match(data, new RegExp(`['\"]${name}['\"]`));
  assert.match(contract, new RegExp(name));
}
console.log('PASS V7.6: Local mode remains default, V7.4 collection names unchanged; pagination requires explicit opt-in.');

