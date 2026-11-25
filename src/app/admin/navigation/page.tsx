import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminRole } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Карта административных разделов · БГУ",
  robots: { index: false, follow: false },
};

const groups = [
  { title: "Рабочий кабинет ЦЦР", links: [
    { href: "/admin", title: "Главная панель ЦЦР", note: "Обзор и демонстрационные карточки" },
    { href: "/admin/review-center", title: "Единый центр согласования", note: "Все заявки в одной очереди" },
    { href: "/admin/structure", title: "Структура университета", note: "Факультеты, кафедры и редакторы" },
  ]},
  { title: "Согласование материалов", links: [
    { href: "/admin/unit-review", title: "Профили подразделений", note: "Описание факультетов и кафедр" },
    { href: "/admin/staff-review", title: "Сотрудники", note: "ФИО, должности, биографии, фото" },
    { href: "/admin/document-review", title: "Документы", note: "Файлы и публикация" },
    { href: "/admin/program-review", title: "Образовательные программы", note: "Программы и направления" },
    { href: "/admin/editorial-review", title: "Новости", note: "Редакционная очередь" },
  ]},
  { title: "Публичные разделы", links: [
    { href: "/", title: "Главная страница", note: "Публичный сайт" },
    { href: "/faculties", title: "Факультеты", note: "Каталог факультетов" },
    { href: "/departments", title: "Кафедры", note: "Каталог кафедр" },
    { href: "/staff", title: "Сотрудники", note: "Список преподавателей" },
    { href: "/programs", title: "Программы", note: "Каталог программ" },
    { href: "/news", title: "Новости", note: "Новости университета" },
    { href: "/documents", title: "Документы", note: "Официальные материалы" },
    { href: "/site-map", title: "Карта сайта", note: "Структура публичного сайта" },
  ]},
] as const;

export default async function AdminNavigationPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  await requireAdminRole("ccr");
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="rounded-2xl bg-[#183e70] px-6 py-8 text-white">
          <Link href="/admin" className="text-sm font-semibold text-blue-100 hover:text-white">← Панель ЦЦР</Link>
          <h1 className="mt-5 text-3xl font-bold">Карта разделов БГУ</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-blue-100">V8.20 · Единая навигация по существующим страницам. Переход в кабинет факультета или кафедры выполняется отдельно под соответствующей ролью.</p>
        </header>
        {groups.map(group => (
          <section key={group.title} className="space-y-4">
            <h2 className="text-xl font-bold text-[#204774]">{group.title}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.links.map(link => (
                <Link href={link.href} key={link.href} className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-700">
                  <span className="font-bold text-[#204774]">{link.title} ↗</span>
                  <p className="mt-2 text-sm text-slate-600">{link.note}</p>
                  <p className="mt-3 break-all font-mono text-xs text-slate-500">{link.href}</p>
                </Link>
              ))}
            </div>
          </section>
        ))}
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">Административные страницы доступны только в режиме разработки. Эта карта проверяет существование маршрутов; корректность сохранения данных и публикации проверяется отдельно.</p>
      </div>
    </main>
  );
}
