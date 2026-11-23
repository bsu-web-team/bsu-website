/**
 * Server-side news source (backend step 2).
 *
 * If BSU_API_URL is set (e.g. http://127.0.0.1:8000 in .env.local), news are
 * loaded from the FastAPI backend. If it is not set, or the API is down or
 * returns an error, the local snapshot from news-data.ts is used, so the site
 * always works.
 *
 * Server-only: do not import this file from "use client" components; pass the
 * data down as props instead. BSU_API_URL is intentionally not NEXT_PUBLIC_.
 */
import { cacheLife } from "next/cache";
import { newsRecords, type NewsRecord } from "@/lib/news-data";

const API_URL = process.env.BSU_API_URL?.replace(/\/+$/, "");
const TIMEOUT_MS = 3000;

type NewsPage = { items: NewsRecord[]; total: number; page: number; limit: number };

const localSorted = () => [...newsRecords].sort((a, b) => b.date.localeCompare(a.date));

/** GET a JSON path from the API. Returns undefined when the API cannot be used. */
async function apiGet<T>(path: string): Promise<{ status: number; data?: T } | undefined> {
  const isDev = process.env.NODE_ENV === "development";
  if (!API_URL) {
    if (isDev) console.info(`[news-api] BSU_API_URL is not set, using local news data for ${path}`);
    return undefined;
  }
  try {
    const res = await fetch(`${API_URL}${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (isDev) console.info(`[news-api] ${API_URL}${path} -> ${res.status}`);
    if (res.status === 404) return { status: 404 };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { status: res.status, data: (await res.json()) as T };
  } catch (error) {
    console.warn(`[news-api] ${path} failed, using local news data:`, error);
    return undefined;
  }
}

/** All published news, newest first. */
export async function getNews(): Promise<NewsRecord[]> {
  "use cache";
  cacheLife("minutes");
  const result = await apiGet<NewsPage>("/api/v1/news?limit=50");
  return result?.data?.items ?? localSorted();
}

/** One news item by slug, or null if it does not exist. */
export async function getNewsBySlug(slug: string): Promise<NewsRecord | null> {
  "use cache";
  cacheLife("minutes");
  const result = await apiGet<NewsRecord>(`/api/v1/news/${encodeURIComponent(slug)}`);
  if (result?.status === 404) return null;
  return result?.data ?? newsRecords.find((item) => item.slug === slug) ?? null;
}
