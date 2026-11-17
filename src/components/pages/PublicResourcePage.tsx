"use client";
import Link from "next/link";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { publicPages } from "@/lib/pages-data";
import { localBooks } from "@/lib/library-books";
const copy = {
 ru:{home:"Главная",resources:"Ресурсы и возможности",books:"Собственный фонд БГУ",empty:"Электронные книги появятся здесь после загрузки и проверки ЦЦР.",read:"Читать PDF"},
 ky:{home:"Башкы бет",resources:"Ресурстар жана мүмкүнчүлүктөр",books:"БМУнун өз фонду",empty:"Электрондук китептер жүктөлүп, текшерилгенден кийин жарыяланат.",read:"PDF окуу"},
 en:{home:"Home",resources:"Resources and opportunities",books:"BSU local collection",empty:"Books will appear after upload and approval.",read:"Read PDF"},
 "zh-CN":{home:"首页",resources:"资源与机会",books:"本校馆藏",empty:"电子书将在上传并审核后发布。",read:"阅读 PDF"}
};
export default function PublicResourcePage({route}:{route:string}){
 const {locale}=useLocale(); const t=copy[locale]; const page=publicPages[route];
 return <main>
  <section className="bsu-page-hero bg-[#102b4e] px-5 py-16 text-white sm:px-8 sm:py-20"><div className="mx-auto max-w-7xl"><nav className="mb-8 text-sm text-blue-100"><Link href="/" className="hover:underline">{t.home}</Link> / <span aria-current="page">{page.title[locale]}</span></nav><p className="text-xs font-bold tracking-[.25em] text-[#dfbd7e]">BSU / PORTAL</p><h1 className="mt-4 max-w-4xl text-4xl font-extrabold sm:text-6xl">{page.title[locale]}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-blue-100">{page.intro[locale]}</p></div></section>
  <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8"><h2 className="mb-7 text-3xl font-bold text-[#102b4e]">{t.resources}</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-bsu-motion-list>{page.links.map((item,i)=>{const content=<><div className="flex items-center justify-between text-[#a7864c]"><span className="text-xs font-bold tracking-widest">{String(i+1).padStart(2,"0")} / BSU</span><ArrowUpRight size={24}/></div><h3 className="mt-7 text-xl font-bold leading-snug text-[#102b4e]">{item.label[locale]}</h3></>;const cls="group min-h-40 rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-[#a7864c]";return item.href.startsWith("https://")?<a key={item.href} data-bsu-motion-item href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>{content}</a>:<Link key={item.href} data-bsu-motion-item href={item.href} className={cls}>{content}</Link>})}</div></section>
  {route==="library"&&<section id="local-books" className="mx-auto max-w-7xl px-5 pb-16 sm:px-8"><h2 className="mb-6 text-3xl font-bold text-[#102b4e]">{t.books}</h2>{localBooks.length===0?<p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">{t.empty}</p>:<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" data-bsu-motion-list>{localBooks.map(book=><article key={book.id} data-bsu-motion-item className="rounded-xl border border-slate-200 bg-white p-6"><BookOpen className="text-[#a7864c]"/><h3 className="mt-4 font-bold">{book.title}</h3><p className="mt-2 text-sm text-slate-600">{book.author}</p><a className="mt-5 inline-flex font-semibold text-[#102b4e] underline" href={book.url} target="_blank" rel="noopener noreferrer">{t.read}</a></article>)}</div>}</section>}
 </main>;
}
