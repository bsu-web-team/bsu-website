import InteriorNav from "@/components/interior/InteriorNav";
import IntegratedSectionContent from "@/components/integrated/SectionContent";
import CatalogNoteV14 from "@/components/i18n/CatalogNoteV14";
import InternalText from "@/components/i18n/InternalText";
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProgramsDirectory from "@/components/programs/ProgramsDirectory";
import { getPrograms } from "@/lib/program-data";

export const metadata: Metadata = { title: "Образовательные программы | БГУ", description: "Каталог программ бакалавриата, магистратуры и PhD БГУ." };
export default async function ProgramsPage() {
 const programs = await getPrograms();
 return <div className="min-h-screen bg-[#f5f7fb] text-slate-900"><Header/><main>
 <section className="bg-[#204774] px-5 py-16 text-white sm:px-8"><div className="mx-auto max-w-7xl"><Link href="/" className="text-sm text-blue-100 hover:underline"><InternalText text="Главная" /></Link><p className="mt-8 text-sm font-semibold uppercase tracking-widest text-[#d5b780]"><InternalText text="Образование" /></p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl"><InternalText text="Образовательные программы" /></h1><p className="mt-5 max-w-2xl text-blue-100"><InternalText text="Найдите направление подготовки по названию, уровню или факультету." /></p></div></section>
<InteriorNav route="/programs"/>

 <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8"><ProgramsDirectory programs={programs}/><p className="mt-10 text-xs leading-relaxed text-slate-500"><CatalogNoteV14 /></p></div>
 <IntegratedSectionContent section="programs" compact/>
</main><Footer/></div>;
}
