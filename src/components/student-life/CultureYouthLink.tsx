"use client";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";
const copy: Record<Locale,{eyebrow:string;name:string;head:string;button:string}> = {
 ky:{eyebrow:"Студенттик жашоо",name:"Маданият жана жаштар менен иштөө бөлүмү",head:"Бөлүм башчысы",button:"Бөлүм тууралуу маалымат"},
 ru:{eyebrow:"Студенческая жизнь",name:"Отдел культуры и работы с молодёжью",head:"Заведующий отделом",button:"Подробнее об отделе"},
 en:{eyebrow:"Student life",name:"Department of Culture and Youth Affairs",head:"Head of Department",button:"Department details"},
 "zh-CN":{eyebrow:"校园生活",name:"文化与青年事务部",head:"部门主任",button:"了解部门"},
};
export default function CultureYouthLink(){const {locale}=useLocale();const c=copy[locale];return <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8" aria-labelledby="youth-culture-title"><div className="flex flex-col gap-5 rounded-2xl border border-[#d4e1ee] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8"><div><p className="text-xs font-extrabold uppercase tracking-widest text-[#9d7b49]">{c.eyebrow}</p><h2 id="youth-culture-title" className="mt-2 text-xl font-bold text-[#204774]">{c.name}</h2><p className="mt-2 text-sm text-slate-600">{c.head}: Султанбек уулу Азиз</p></div><Link href="/about/administration/culture" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#204774] px-5 py-3 text-sm font-semibold text-white hover:bg-[#163760]">{c.button} →</Link></div></section>}
