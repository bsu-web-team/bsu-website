import InteriorNav from "@/components/interior/InteriorNav";
import type { Metadata } from "next";
import PublicTextV13 from "@/components/i18n/PublicTextV13";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import DepartmentDirectory from "@/components/departments/DepartmentDirectory";
import { getDepartments } from "@/lib/department-data";

export const metadata: Metadata = {
  title: "Кафедры | БГУ",
  description: "Каталог кафедр Бишкекского государственного университета имени академика К. Карасаева",
};

export default async function DepartmentsPage() {
  const items = await getDepartments();
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 bsu-interior">
      <Header />
      <main>
        <section className="bg-[#102b4e] px-5 py-14 text-white bsu-page-hero sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Навигационная цепочка" className="mb-6 flex flex-wrap items-center gap-2 text-sm text-blue-100"><Link href="/" className="hover:underline"><PublicTextV13 value="Главная" /></Link><ChevronRight size={15}/><Link href="/faculties" className="hover:underline"><PublicTextV13 value="Факультеты" /></Link><ChevronRight size={15}/><span aria-current="page" className="text-white"><PublicTextV13 value="Кафедры" /></span></nav>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#d5b780]"><PublicTextV13 value="Структура университета" /></p>
            <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl"><PublicTextV13 value="Кафедры БГУ" /></h1>
            <p className="mt-5 max-w-2xl leading-relaxed text-blue-100"><PublicTextV13 value="Кафедры, указанные в доступных сведениях о факультетах университета. Перечень уточняется." /></p>
          </div>
        </section>
<InteriorNav route="/departments"/>

        <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 bsu-page-body"><DepartmentDirectory items={items}/><p className="mt-8 text-xs text-slate-500"><PublicTextV13 value="Предварительный каталог на основе открытого реестра факультетов. Отсутствие кафедры в каталоге не означает, что она не существует." /></p></section>
      </main>
      <Footer />
    </div>
  );
}
