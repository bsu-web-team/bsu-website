// Server-side API transport. Do not import into client components.
export function backendEnabled(): boolean { return process.env.BSU_DATA_SOURCE === 'backend'; }
export async function backendGet<T>(endpoint: string): Promise<T> {
  const base = process.env.BSU_API_BASE_URL;
  if (!base) throw new Error('BSU_API_BASE_URL is required');
  const url = new URL(base.replace(/\/$/, '') + '/' + endpoint.replace(/^\//, ''));
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Invalid backend protocol');
  const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000), cache: 'no-store' });
  if (!response.ok) throw new Error('BSU API HTTP ' + response.status + ' (' + endpoint + ')');
  return await response.json() as T;
}
