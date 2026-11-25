"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Building2, UserRound, UsersRound } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";

type Copy = {
  students: string; area: string; name: string; description: string; about: string;
  intro: string; pending: string; back: string; leadership: string; head: string; contacts: string;
};

const copy: Record<Locale, Copy> = {
  ky: {
    students: "Студенттерге", area: "Студенттик жашоо · БМУ",
    name: "Маданият жана жаштар менен иштөө бөлүмү",
    description: "Бөлүм жөнүндө негизги маалымат жана жетекчилиги.",
    about: "Бөлүм жөнүндө",
    intro: "Маданият жана жаштар менен иштөө бөлүмү — Бишкек мамлекеттик университетинин түзүмдүк бөлүмү.",
    pending: "Бөлүмдүн иш багыттары, иш-чаралары, байланыш маалыматтары жана сүрөттөрү расмий түрдө такталгандан кийин жарыяланат.",
    back: "Студенттер бөлүмүнө кайтуу", leadership: "Жетекчилик",
    head: "Бөлүм башчысы", contacts: "Расмий байланыш маалыматтары азырынча берилген эмес.",
  },
  ru: {
    students: "Студентам", area: "Студенческая жизнь · БГУ",
    name: "Отдел культуры и работы с молодёжью",
    description: "Основная информация об отделе и его руководстве.",
    about: "Об отделе",
    intro: "Отдел культуры и работы с молодёжью — структурное подразделение Бишкекского государственного университета.",
    pending: "Направления работы, мероприятия, контакты и фотографии будут опубликованы после официального подтверждения отделом.",
    back: "Вернуться в раздел для студентов", leadership: "Руководство",
    head: "Заведующий отделом", contacts: "Официальные контактные данные пока не предоставлены.",
  },
  en: {
    students: "Students", area: "Student life · BSU",
    name: "Department of Culture and Youth Affairs",
    description: "Basic information about the department and its leadership.",
    about: "About the department",
    intro: "The Department of Culture and Youth Affairs is an organizational unit of Bishkek State University.",
    pending: "Areas of work, events, contact details, and photographs will be published after official confirmation by the department.",
    back: "Back to student life", leadership: "Leadership",
    head: "Head of Department", contacts: "Official contact details have not yet been provided.",
  },
  "zh-CN": {
    students: "学生服务", area: "校园生活 · 比什凯克国立大学",
    name: "文化与青年事务部",
    description: "部门基本信息及负责人介绍。",
    about: "部门简介",
    intro: "文化与青年事务部是比什凯克国立大学的一个组织部门。",
    pending: "部门工作领域、活动、联系方式和照片将在获得部门正式确认后公布。",
    back: "返回学生服务", leadership: "部门负责人",
    head: "部门主任", contacts: "尚未提供官方联系方式。",
  },
};

export default function CultureYouthContent() {
  const { locale } = useLocale();
  const c = copy[locale];
  return <main>
    <section className="bg-gradient-to-br from-[#173e70] via-[#255680] to-[#3a6c87] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <nav aria-label={c.students} className="mb-8 flex flex-wrap items-center gap-2 text-sm text-blue-100">
          <Link href="/student-life" className="inline-flex items-center gap-2 hover:text-white hover:underline"><ArrowLeft size={16} />{c.students}</Link>
          <span aria-hidden="true">/</span><span aria-current="page">{c.name}</span>
        </nav>
        <div className="flex flex-wrap items-center gap-3 text-[#f0d8a7]"><UsersRound size={21} aria-hidden="true"/><span className="text-xs font-extrabold uppercase tracking-[0.16em]">{c.area}</span></div>
        <h1 className="mt-4 max-w-4xl text-3xl font-extrabold leading-tight sm:text-5xl">{c.name}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-100 sm:text-base">{c.description}</p>
      </div>
    </section>
    <div className="mx-auto grid max-w-6xl gap-6 px-5 py-10 sm:px-8 lg:grid-cols-[1.3fr_0.7fr]">
      <section className="rounded-2xl border border-[#dbe4ee] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-xl bg-[#edf4fb] text-[#204774]"><Building2 size={23}/></span><h2 className="text-xl font-bold">{c.about}</h2></div>
        <p className="mt-5 leading-8 text-slate-700">{c.intro}</p>
        <p className="mt-3 text-sm leading-7 text-slate-600">{c.pending}</p>
        <Link href="/student-life" className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#cad9e8] px-4 py-3 text-sm font-semibold text-[#204774] transition hover:bg-[#edf4fb]">{c.back}<ArrowUpRight size={17}/></Link>
      </section>
      <aside className="self-start rounded-2xl border border-[#dbe4ee] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 text-[#204774]"><UserRound size={22}/><h2 className="text-lg font-bold">{c.leadership}</h2></div>
        <p className="mt-7 text-sm font-semibold uppercase tracking-wider text-[#937344]">{c.head}</p>
        <p className="mt-2 text-2xl font-extrabold leading-snug">Султанбек уулу Азиз</p>
        <p className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500">{c.contacts}</p>
      </aside>
    </div>
  </main>;
}
