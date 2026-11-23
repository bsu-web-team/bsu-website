// BSU V7.5 adapter. Local mode remains unchanged; API mode is opt-in.
import { backendEnabled, backendGet } from './client';
import { getFaculties as local_getFaculties, getFacultyBySlug as local_getFacultyBySlug, type FacultyRecord } from '@/lib/faculty-data';
import { getDepartments as local_getDepartments, getDepartmentBySlug as local_getDepartmentBySlug, type DepartmentRecord } from '@/lib/department-data';
import { getStaff as local_getStaff, getStaffBySlug as local_getStaffBySlug, type StaffRecord } from '@/lib/staff-data';
import { getPrograms as local_getPrograms, getProgramBySlug as local_getProgramBySlug, type ProgramRecord } from '@/lib/program-data';
import { getNews as local_getNews, getNewsBySlug as local_getNewsBySlug, type NewsRecord } from '@/lib/news-data';
import { getDocuments as local_getDocuments, getDocumentBySlug as local_getDocumentBySlug, type DocumentRecord } from '@/lib/document-data';

type Page<T> = { items: T[]; total?: number };
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function parsePage<T>(response: unknown, endpoint: string): Page<T> {
  const items = Array.isArray(response) ? response : isRecord(response) ? response.items : undefined;
  if (!Array.isArray(items) || !items.every(item => isRecord(item) && typeof item.slug === 'string' && item.slug.length > 0)) {
    throw new Error(`Invalid BSU API collection or missing slug: ${endpoint}`);
  }
  const total = isRecord(response) ? response.total : undefined;
  if (total !== undefined && (!Number.isSafeInteger(total) || (total as number) < 0)) {
    throw new Error(`Invalid BSU API total: ${endpoint}`);
  }
  if (typeof total === 'number' && total < items.length) {
    throw new Error(`BSU API total smaller than items: ${endpoint}`);
  }
  return { items: items as T[], total: total as number | undefined };
}

function pageSize(): number {
  const value = Number(process.env.BSU_API_PAGE_SIZE ?? '100');
  return Number.isInteger(value) && value >= 1 && value <= 1000 ? value : 100;
}
function maxPages(): number {
  const value = Number(process.env.BSU_API_MAX_PAGES ?? '100');
  return Number.isInteger(value) && value >= 1 && value <= 1000 ? value : 100;
}

async function list<T extends {slug: string}>(endpoint: string, local: () => Promise<T[]>): Promise<T[]> {
  if (!backendEnabled()) return local();
  const first = parsePage<T>(await backendGet<unknown>(endpoint), endpoint);
  if (first.total === undefined || first.total === first.items.length) return first.items;
  if (first.items.length === 0) throw new Error(`Empty first page with nonzero total: ${endpoint}`);

  // Pagination contract (PROPOSED): GET /collection?page=2&page_size=100.
  // Confirm Swagger before enabling backend mode. No silent partial results.
  const results = [...first.items];
  const slugs = new Set(results.map(item => item.slug));
  const size = pageSize();
  const limit = maxPages();
  for (let page = 2; results.length < first.total; page++) {
    if (page > limit) throw new Error(`BSU API exceeded maximum ${limit} pages: ${endpoint}`);
    const uri = `${endpoint}?page=${page}&page_size=${size}`;
    const next = parsePage<T>(await backendGet<unknown>(uri), uri);
    if (next.total !== undefined && next.total !== first.total) {
      throw new Error(`BSU API changed total during pagination: ${endpoint}`);
    }
    if (!next.items.length) throw new Error(`BSU API returned empty page before total reached: ${uri}`);
    for (const record of next.items) {
      if (slugs.has(record.slug)) throw new Error(`Duplicate BSU API slug across pages: ${endpoint}/${record.slug}`);
      slugs.add(record.slug);
      results.push(record);
    }
    if (results.length > first.total) throw new Error(`BSU API returned more records than total: ${endpoint}`);
  }
  return results;
}

export const backendData = {
  faculties: () => list<FacultyRecord>('faculties', local_getFaculties),
  departments: () => list<DepartmentRecord>('departments', local_getDepartments),
  staff: () => list<StaffRecord>('staff', local_getStaff),
  programs: () => list<ProgramRecord>('programs', local_getPrograms),
  news: () => list<NewsRecord>('news', local_getNews),
  documents: () => list<DocumentRecord>('documents', local_getDocuments),
};

export async function getFaculties() { return backendData.faculties(); }
export async function getFacultyBySlug(slug: string) {
  if (!backendEnabled()) return local_getFacultyBySlug(slug);
  return (await backendData.faculties()).find(item => item.slug === slug) ?? null;
}
export async function getDepartments() { return backendData.departments(); }
export async function getDepartmentBySlug(slug: string) {
  if (!backendEnabled()) return local_getDepartmentBySlug(slug);
  return (await backendData.departments()).find(item => item.slug === slug) ?? null;
}
export async function getStaff() { return backendData.staff(); }
export async function getStaffBySlug(slug: string) {
  if (!backendEnabled()) return local_getStaffBySlug(slug);
  return (await backendData.staff()).find(item => item.slug === slug) ?? null;
}
export async function getPrograms() { return backendData.programs(); }
export async function getProgramBySlug(slug: string) {
  if (!backendEnabled()) return local_getProgramBySlug(slug);
  return (await backendData.programs()).find(item => item.slug === slug) ?? null;
}
export async function getNews() { return backendData.news(); }
export async function getNewsBySlug(slug: string) {
  if (!backendEnabled()) return local_getNewsBySlug(slug);
  return (await backendData.news()).find(item => item.slug === slug) ?? null;
}
export async function getDocuments() { return backendData.documents(); }
export async function getDocumentBySlug(slug: string) {
  if (!backendEnabled()) return local_getDocumentBySlug(slug);
  return (await backendData.documents()).find(item => item.slug === slug) ?? null;
}
