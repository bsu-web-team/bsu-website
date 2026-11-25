import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-session";
import { ArrowUpRight, Building2, ClipboardCheck, FileText, LayoutGrid, Newspaper, Users } from "lucide-react";

export const metadata: Metadata = { title: "Панель ЦЦР · БГУ", robots: { index: false, follow: false } };

const areas = [
  { href: "/admin/review-center", title: "Все согласования", desc: "Новости, профили, сотрудники, документы, программы и структура — на одной странице.", icon: ClipboardCheck, main: true },
  { href: "/admin/structure", title: "Структура и права", desc: "Факультеты, кафедры и назначение ответственных редакторов.", icon: Building2 },
  { href: "/admin/navigation", title: "Разделы сайта", desc: "Карта страниц и быстрый доступ к публичным разделам.", icon: LayoutGrid },
];
const detail = [
  { href: "/admin/editorial-review", title: "Новости", icon: Newspaper },
  { href: "/admin/staff-review", title: "Сотрудники", icon: Users },
  { href: "/admin/document-review", title: "Документы", icon: FileText },
];

export default async function AdminPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  await requireAdminRole("ccr");
  return <main className="min-h-[calc(100vh-65px)] bg-[#f5f7fb] px-4 py-10 text-slate-900 sm:px-6">
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">БГУ · Центр цифрового развития</p><h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[#173d70] sm:text-4xl">Панель управления</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Все ключевые действия — через верхнее меню. Согласование заявок собрано в одной рабочей области.</p></div>
        <span className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">Тестовая среда</span>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        {areas.map(area => <Link key={area.href} href={area.href} className={`group flex min-h-52 flex-col justify-between rounded-2xl border p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${area.main ? "border-[#173d70] bg-[#173d70] text-white" : "border-slate-200 bg-white"}`}>
          <div className="flex items-start justify-between"><span className={`flex size-12 items-center justify-center rounded-xl ${area.main ? "bg-white/15" : "bg-blue-50 text-[#173d70]"}`}><area.icon size={24}/></span><ArrowUpRight size={21} className={area.main ? "text-blue-100" : "text-slate-400"}/></div>
          <div><h2 className="mt-6 text-lg font-bold">{area.title}</h2><p className={`mt-2 text-sm leading-6 ${area.main ? "text-blue-100" : "text-slate-500"}`}>{area.desc}</p></div>
        </Link>)}
      </div>
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 className="text-lg font-bold text-[#173d70]">Быстрые переходы</h2><Link href="/admin/review-center" className="text-sm font-semibold text-blue-700 hover:underline">Открыть все заявки</Link></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">{detail.map(item => <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm font-semibold hover:border-blue-200 hover:bg-blue-50"><item.icon size={19} className="text-[#173d70]"/>{item.title}<ArrowUpRight size={16} className="ml-auto text-slate-400"/></Link>)}</div>
      </section>
      <p className="text-xs leading-5 text-slate-500">Работа с материалами и правами доступа осуществляется через защищённые тестовые API. Старый демонстрационный редактор больше не отображается на главной ЦЦР. Для публичного развёртывания административную систему необходимо отдельно подготовить и проверить.</p>
    </div>
  </main>;
}
