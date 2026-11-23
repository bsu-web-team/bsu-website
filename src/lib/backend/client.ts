// BSU V8.0: merge frontend API safety checks with Next.js 16 Cache Components.
// Server-only transport. Never import into client components.
import { cacheLife } from 'next/cache';

export function backendEnabled(): boolean {
  return process.env.BSU_DATA_SOURCE === 'backend';
}

function apiUrl(endpoint: string): URL {
  const base = process.env.BSU_API_BASE_URL;
  if (!base) throw new Error('BSU_API_BASE_URL is required when BSU_DATA_SOURCE=backend');
  if (!endpoint || endpoint.startsWith('/') || /^[a-z][a-z\d+.-]*:/i.test(endpoint)) {
    throw new Error('Backend endpoint must be a relative path');
  }

  const root = new URL(base.replace(/\/+$/, '') + '/');
  if (root.protocol !== 'http:' && root.protocol !== 'https:') {
    throw new Error('BSU_API_BASE_URL must use HTTP or HTTPS');
  }
  if (root.username || root.password || root.search || root.hash) {
    throw new Error('BSU_API_BASE_URL must not contain credentials, query or fragment');
  }

  const target = new URL(endpoint, root);
  if (target.origin !== root.origin || !target.pathname.startsWith(root.pathname) || target.hash) {
    throw new Error('Backend endpoint escapes configured API base');
  }
  return target;
}

function apiTimeout(): number {
  const value = Number(process.env.BSU_API_TIMEOUT_MS ?? '8000');
  return Number.isInteger(value) && value >= 1000 && value <= 30000 ? value : 8000;
}

// Next.js Cache Components requires explicit caching for data read during prerender.
// Never call "no-store" here: the backend branch confirmed it breaks `next build`.
async function cachedJson<T>(url: string, timeout: number): Promise<T> {
  'use cache';
  cacheLife('minutes');
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(timeout),
    });
  } catch (error) {
    throw new Error('BSU API unavailable', { cause: error });
  }
  if (!response.ok) throw new Error(`BSU API HTTP ${response.status}`);
  const type = response.headers.get('content-type') ?? '';
  if (!type.toLowerCase().includes('json')) throw new Error('BSU API did not return JSON');
  try {
    return (await response.json()) as T;
  } catch (error) {
    throw new Error('BSU API returned invalid JSON', { cause: error });
  }
}

export async function backendGet<T>(endpoint: string): Promise<T> {
  return cachedJson<T>(apiUrl(endpoint).toString(), apiTimeout());
}
