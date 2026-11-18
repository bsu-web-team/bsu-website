"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, Newspaper } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { newsRecords } from "@/lib/news-data";
import { formatLocalizedNewsDate, localizeNews, newsUi } from "@/lib/news-i18n";

export default function News() {
  const { t, locale } = useLocale();
  const ui = newsUi[locale];
  const latest = [...newsRecords]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((record) => localizeNews(record, locale));

  return (
    <section id="news" className="scroll-mt-28 bg-[#f5f7fb] py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#a7864c]">{t("pressCenter")}</p>
            <h2 className="text-3xl font-bold text-[#204774]">{t("homeNews")}</h2>
          </div>
          <Link href="/news" className="inline-flex items-center gap-2 rounded-xl bg-[#204774] px-5 py-3 text-sm font-semibold text-white hover:bg-blue-900">
            {t("allNews")}<ArrowRight size={17} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {latest.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-center gap-3 text-sm font-semibold text-[#a7864c]">
                <Newspaper size={17} />{ui.categories[item.category]}
              </div>
              <h3 className="mt-4 text-lg font-bold leading-snug text-[#204774] group-hover:underline">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.excerpt}</p>
              <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
                <CalendarDays size={15} />{formatLocalizedNewsDate(item.date, locale)}
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-5 text-xs text-slate-500">{locale === "ru" ? t("newsFrom") : t("newsFallback")}</p>
      </div>
    </section>
  );
}
