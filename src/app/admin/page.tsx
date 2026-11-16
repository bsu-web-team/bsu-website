import type { Metadata } from "next";
import AdminWorkspace from "@/components/admin/AdminWorkspace";
import { faculties } from "@/lib/faculty-data";
import { programRecords } from "@/lib/program-data";

export const metadata: Metadata = {
  title: "Прототип панели управления | БГУ",
  description: "Демонстрационный интерфейс будущей административной панели БГУ.",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  if (process.env.NODE_ENV !== "development") {
    return <main className="mx-auto max-w-3xl px-5 py-20"><h1 className="text-2xl font-bold">БГУ · BSU · БМУ · 比什凯克国立大学</h1><p className="mt-4">Панель управления недоступна. / Башкаруу панели жеткиликсиз. / Administration is unavailable. / 管理面板暂不可用。</p></main>;
  }
  return (
    <AdminWorkspace
      seedFaculties={faculties.map((f) => ({ id: f.slug, title: f.name, subtitle: f.category, source: f.sourceUrl }))}
      seedPrograms={programRecords.map((p) => ({ id: p.slug, title: p.title, subtitle: `${p.level} · ${p.facultyName}`, source: p.sourceUrl }))}
    />
  );
}
