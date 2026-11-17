import http from 'k6/http';
import { check, sleep } from 'k6';
const base = (__ENV.BSU_BASE_URL || 'http://localhost:3000').replace(/\/$/, '');
// Explicit opt-in for a staging system you own and have permission to test.
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(base) && __ENV.BSU_OWNED_STAGING !== 'yes') throw new Error('Only localhost by default. Authorize your own isolated staging explicitly.');
const max = Number(__ENV.BSU_VUS || '20');
if (!Number.isInteger(max) || max < 1 || max > 5000) throw new Error('BSU_VUS must be between 1 and 5000');
export const options = { stages: [{ duration: '1m', target: Math.max(1,Math.floor(max/4)) }, { duration: '2m', target: max }, { duration: '3m', target: max }, { duration: '1m', target: 0 }], thresholds: { http_req_failed: ['rate<0.01'], http_req_duration: ['p(95)<800'], checks: ['rate>0.99'] }, discardResponseBodies: true };
const pages = ['/', '/faculties', '/departments', '/programs', '/news', '/documents'];
export default function loadTest() { const route=pages[Math.floor(Math.random()*pages.length)]; const response=http.get(base+route,{tags:{route}, redirects:0});check(response,{'public page HTTP 200':r=>r.status===200});sleep(2+Math.random()*3); }

