// Proposed adapter: switch server pages to these functions after contract validation.
import { backendEnabled, backendGet } from './client';
import { getFaculties as local_getFaculties, getFacultyBySlug as local_getFacultyBySlug, type FacultyRecord } from '@/lib/faculty-data';
import { getDepartments as local_getDepartments, getDepartmentBySlug as local_getDepartmentBySlug, type DepartmentRecord } from '@/lib/department-data';
import { getStaff as local_getStaff, getStaffBySlug as local_getStaffBySlug, type StaffRecord } from '@/lib/staff-data';
import { getPrograms as local_getPrograms, getProgramBySlug as local_getProgramBySlug, type ProgramRecord } from '@/lib/program-data';
import { getNews as local_getNews, getNewsBySlug as local_getNewsBySlug, type NewsRecord } from '@/lib/news-data';
import { getDocuments as local_getDocuments, getDocumentBySlug as local_getDocumentBySlug, type DocumentRecord } from '@/lib/document-data';
async function list<T>(endpoint: string, local: () => Promise<T[]>): Promise<T[]> {
  if (!backendEnabled()) return local();
  const result = await backendGet<unknown>(endpoint);
  const data = Array.isArray(result) ? result : (result && typeof result === 'object' && 'items' in result ? result.items : null);
  if (!Array.isArray(data) || !data.every(x => x && typeof x.slug === 'string')) throw new Error('Unexpected API collection: ' + endpoint);
  if (result && typeof result === 'object' && 'total' in result && typeof result.total === 'number' && result.total > data.length) throw new Error('Paginated API requires an adapter: ' + endpoint);
  return data as T[];
}
export const backendData = {
  faculties: () => list<FacultyRecord>('faculties', local_getFaculties),
  departments: () => list<DepartmentRecord>('departments', local_getDepartments),
  staff: () => list<StaffRecord>('staff', local_getStaff),
  programs: () => list<ProgramRecord>('programs', local_getPrograms),
  news: () => list<NewsRecord>('news', local_getNews),
  documents: () => list<DocumentRecord>('documents', local_getDocuments),
};

// BSU V3 server getters
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