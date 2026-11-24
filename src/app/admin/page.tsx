import type { Metadata } from "next";
import AdminWorkspace from "@/components/admin/AdminWorkspace";
import { getFaculties } from "@/lib/faculty-data";
import { getDepartments } from "@/lib/department-data";
import { getStaff } from "@/lib/staff-data";
import { getPrograms } from "@/lib/program-data";
import { getNews } from "@/lib/news-data";
import { getDocuments } from "@/lib/document-data";

export const metadata: Metadata = {
  title: "Прототип панели управления | БГУ",
  description: "Демонстрационный интерфейс будущей административной панели БГУ.",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // The prototype stays inaccessible in production until authenticated Backend is ready.
  if (process.env.NODE_ENV !== "development") {
    return <main className="mx-auto max-w-3xl px-5 py-20"><h1 className="text-2xl font-bold">БГУ · BSU · БМУ · 比什凯克国立大学</h1><p className="mt-4">Панель управления недоступна. / Башкаруу панели жеткиликсиз. / Administration is unavailable. / 管理面板暂不可用。</p></main>;
  }

  // Preview only. Data comes from local snapshots, not PostgreSQL or Backend API.
  const [faculties, departments, staff, programs, news, documents] = await Promise.all([
    getFaculties(), getDepartments(), getStaff(), getPrograms(), getNews(), getDocuments(),
  ]);
  return <AdminWorkspace
    seedFaculties={faculties.map(f => ({id:f.slug,title:f.name,subtitle:f.category,source:f.sourceUrl}))}
    seedDepartments={departments.map(d => ({id:d.slug,title:d.name,subtitle:d.facultyName,source:d.facultySourceUrl}))}
    seedStaff={staff.map(s => ({id:s.slug,title:s.name,subtitle:s.position + " · " + s.facultyName,source:s.sourceUrl}))}
    seedPrograms={programs.map(p => ({id:p.slug,title:p.title,subtitle:p.level + " · " + p.facultyName,source:p.sourceUrl}))}
    seedNews={news.map(n => ({id:n.slug,title:n.title,subtitle:n.date + " · " + n.category,source:n.sourceUrl}))}
    seedDocuments={documents.map(d => ({id:d.slug,title:d.title,subtitle:d.category,source:d.sourceUrl}))}
  />;
}
