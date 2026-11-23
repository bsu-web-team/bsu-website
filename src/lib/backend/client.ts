// BSU V7.5 server-side HTTP transport. Never import this module from client components.
export function backendEnabled(): boolean {
  return process.env.BSU_DATA_SOURCE === 'backend';
}

function apiBase(): URL {
  const base = process.env.BSU_API_BASE_URL;
  if (!base) throw new Error('BSU_API_BASE_URL is required when BSU_DATA_SOURCE=backend');
  const url = new URL(base.replace(/\/+$/, '') + '/');
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('BSU_API_BASE_URL must use HTTP or HTTPS');
  }
  if (url.username || url.password) throw new Error('Do not place credentials in BSU_API_BASE_URL');
  return url;
}

function timeoutMs(): number {
  const value = Number(process.env.BSU_API_TIMEOUT_MS ?? '8000');
  return Number.isInteger(value) && value >= 1000 && value <= 30000 ? value : 8000;
}

function cacheSeconds(): number {
  const raw = Number(process.env.BSU_API_REVALIDATE_SECONDS ?? '0');
  return Number.isInteger(raw) && raw >= 0 && raw <= 86400 ? raw : 0;
}

export async function backendGet<T>(endpoint: string): Promise<T> {
  // Endpoints must be relative; block accidental fetching from an external host.
  if (!endpoint || endpoint.startsWith('/') || endpoint.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(endpoint)) {
    throw new Error('Backend endpoint must be a relative path');
  }
  const base = apiBase();
  const url = new URL(endpoint, base);
  // Prevent traversal outside the configured /api/v1/ prefix.
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname) || url.hash) {
    throw new Error('Backend endpoint escapes configured API base');
  }
  const seconds = cacheSeconds();
  const options: RequestInit & { next?: { revalidate: number } } = {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(timeoutMs()),
    ...(seconds === 0 ? { cache: 'no-store' as const } : { next: { revalidate: seconds } }),
  };
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error(`BSU API unavailable (${endpoint})`, { cause: error });
  }
  if (!response.ok) throw new Error(`BSU API HTTP ${response.status} (${endpoint})`);
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('json')) throw new Error(`Expected JSON from BSU API (${endpoint})`);
  try {
    return await response.json() as T;
  } catch (error) {
    throw new Error(`Invalid JSON from BSU API (${endpoint})`, { cause: error });
  }
}
