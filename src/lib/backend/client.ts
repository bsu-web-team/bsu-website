// Server-side API transport. Do not import into client components.
import { cacheLife } from 'next/cache';

export function backendEnabled(): boolean { return process.env.BSU_DATA_SOURCE === 'backend'; }

// Cached with "use cache" (Next.js Cache Components): pages can be prerendered from API data,
// and the API is called again after the "minutes" cache profile expires instead of on every request.
// A `cache: 'no-store'` fetch fails `next build` with cacheComponents enabled ("uncached data during prerendering").
export async function backendGet<T>(endpoint: string): Promise<T> {
  'use cache';
  cacheLife('minutes');
  const base = process.env.BSU_API_BASE_URL;
  if (!base) throw new Error('BSU_API_BASE_URL is required');
  const url = new URL(base.replace(/\/$/, '') + '/' + endpoint.replace(/^\//, ''));
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid backend protocol');
  const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('BSU API HTTP ' + response.status + ' (' + endpoint + ')');
  return await response.json() as T;
}
