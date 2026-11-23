import { getFaculties } from '@/lib/backend/data';


import type { Metadata } from "next";
import PublicTextV13 from "@/components/i18n/PublicTextV13";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FacultyDirectory from "@/components/faculties/FacultyDirectory";


export const metadata: Metadata = {
  title: "Факультеты и институты | БГУ",
  description: "Каталог факультетов и институтов Бишкекского государственного университета имени академика К. Карасаева.",
};

export default async function FacultiesPage() {
  const items = await getFaculties();
  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 bsu-interior">
      <Header />
      <main>
        <section className="bg-[#204774] px-5 py-14 text-white bsu-page-hero sm:px-8 sm:py-20">
          <div className="mx-auto max-w-7xl">
            <nav aria-label="Навигационная цепочка" className="mb-6 flex items-center gap-2 text-sm text-blue-100"><Link href="/" className="hover:underline"><PublicTextV13 value="Главная" /></Link><ChevronRight size={15}/><span aria-current="page"><PublicTextV13 value="Факультеты и институты" /></span></nav>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#d5b780]"><PublicTextV13 value="Образование в БГУ" /></p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl"><PublicTextV13 value="Факультеты и институты" /></h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-100"><PublicTextV13 value="Откройте подразделение, чтобы узнать о руководстве, кафедрах, образовательных направлениях и контактах." /></p>
          </div>
        </section>


        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 bsu-page-body">
          <FacultyDirectory items={items} />
          <p className="mt-8 text-xs text-slate-500"><PublicTextV13 value="Данные перенесены из открытых страниц bsu.kg для предварительного ознакомления. Состав и контакты требуют подтверждения университетом перед публикацией." /></p>
        </div>
      <div className="bsu-faculty-archive-link mx-auto max-w-7xl px-5 pb-8 sm:px-8"><Link href="/faculties/content" prefetch={false} className="bsu-faculty-resource"><PublicTextV13 value="Материалы факультетов"/> ↗</Link></div>
</main>
      <Footer />
    </div>
  );
}
