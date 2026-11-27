import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft, ArrowUpRight, Building2, ClipboardCheck, FileText,
  LayoutGrid, Newspaper, Users, GraduationCap, ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Демо админ-панели БГУ",
  robots: { index: false, follow: false },
};

const sections = [
  { title: "Все согласования", info: "Заявки на публикацию и изменения", icon: ClipboardCheck, count: "12" },
  { title: "Структура и права", info: "Факультеты, кафедры, сотрудники", icon: Building2, count: "17" },
  { title: "Разделы сайта", info: "Навигация и страницы портала", icon: LayoutGrid, count: "8" },
  { title: "Новости", info: "Черновики, редактура, публикации", icon: Newspaper, count: "24" },
  { title: "Документы", info: "Аккредитация и внутренние документы", icon: FileText, count: "50" },
  { title: "Сотрудники", info: "Профили и заявки на изменения", icon: Users, count: "65" },
  { title: "Образовательные программы", info: "Карточки программ и согласование", icon: GraduationCap, count: "30" },
];

export default function AdminPreviewPage() {
  return (
    <main className="min-h-screen bg-[#f5f7fb] text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#173d70] p-3 text-white"><ShieldCheck size={25}/></div>
            <div><div className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">БГУ · Центр цифрового развития</div>
              <h1 className="text-xl font-extrabold">Панель управления — демонстрация</h1></div>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:underline"><ArrowLeft size={16}/> На сайт БГУ</Link>
        </div>
      </header>
      <div className="mx-auto max-w-7xl space-y-8 px-5 py-9">
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
          <div className="font-bold">Демонстрационный режим</div>
          <p className="mt-1 text-sm leading-6">Это только интерфейс. Данные ниже являются примерами, а не фактическими показателями БГУ. Вход, сохранение, согласование и управление пользователями отключены.</p>
        </section>
        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-2xl font-extrabold text-[#173d70]">Рабочая область ЦЦР</h2>
              <p className="mt-2 text-sm text-slate-600">Основные разделы административной панели</p></div>
            <span className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-bold text-blue-800">Предпросмотр · без Backend</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((s, i) => <article key={s.title} className={`flex min-h-52 flex-col justify-between rounded-2xl border p-6 shadow-sm ${i === 0 ? "border-[#173d70] bg-[#173d70] text-white" : "border-slate-200 bg-white"}`}>
              <div className="flex items-start justify-between">
                <span className={`rounded-xl p-3 ${i === 0 ? "bg-white/15" : "bg-blue-50 text-[#173d70]"}`}><s.icon size={25}/></span>
                <ArrowUpRight size={20} className={i === 0 ? "text-blue-200" : "text-slate-400"}/>
              </div>
              <div><div className={`mb-1 text-xs font-bold uppercase tracking-widest ${i === 0 ? "text-blue-200" : "text-slate-400"}`}>Раздел {String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className={`mt-2 text-sm ${i === 0 ? "text-blue-100" : "text-slate-500"}`}>{s.info}</p></div>
            </article>)}
          </div>
        </section>
        <section className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-extrabold text-[#173d70]">Пример очереди согласования</h2>
            <div className="mt-5 space-y-3">
              {["Публикация новости", "Обновление профиля сотрудника", "Документ аккредитации"].map((item, i) => <div key={item} className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm"><span>{item}</span><span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">{i === 2 ? "На проверке" : "Ожидает"}</span></div>)}
            </div>
            <p className="mt-4 text-xs text-slate-500">Примерные записи, не связаны с базой данных.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-extrabold text-[#173d70]">Модель работы</h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-slate-700">
              <p><strong>Редактор:</strong> создаёт материалы и направляет их на согласование.</p>
              <p><strong>ЦЦР:</strong> проверяет, утверждает или возвращает на доработку.</p>
              <p><strong>Посетитель:</strong> видит только опубликованные материалы.</p>
            </div>
            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-sm text-blue-900">Для рабочего режима потребуются Backend, PostgreSQL и защищённая авторизация.</div>
          </div>
        </section>
      </div>
    </main>
  );
}
