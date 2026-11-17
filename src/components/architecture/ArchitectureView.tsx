// BSU Architecture v1 — Interior v2
"use client";
import Link from "next/link";
import InteriorNav from "@/components/interior/InteriorNav";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { SiteEntry } from "@/lib/site-registry";
const labels={ru:{home:"К карте сайта",draft:"Раздел готовится. Содержимое будет добавлено после проверки.",sections:"Подразделы",ready:"Перенесённые материалы"},ky:{home:"Сайттын картасына",draft:"Бөлүм даярдалууда. Маалымат текшерилгенден кийин кошулат.",sections:"Бөлүмдөр",ready:"Көчүрүлгөн материалдар"},en:{home:"Site map",draft:"This section is being prepared. Content will be added after review.",sections:"Sections",ready:"Imported materials"},"zh-CN":{home:"网站地图",draft:"本栏目正在建设中，内容审核后将发布。",sections:"子栏目",ready:"已迁移资料"}};
export default function ArchitectureView({entry,childrenEntries,groups,materialHref}:{entry:SiteEntry;childrenEntries:SiteEntry[];groups?:{entry:SiteEntry;children:SiteEntry[]}[];materialHref?:string}){
 const {locale}=useLocale();const t=labels[locale];const title=(e:SiteEntry)=>e.titles[locale]??e.titles.ru;
 const cards=(items:SiteEntry[])=><div className="bsu-arch-grid" data-bsu-motion-list>{items.map((e,i)=><Link key={e.route} href={e.route} prefetch={false} className="bsu-arch-card" data-bsu-motion-item><span>{String(i+1).padStart(2,"0")} / BSU</span><strong>{title(e)}</strong><span aria-hidden="true">↗</span></Link>)}</div>;
 return <main className="bsu-architecture"><section className="bsu-arch-hero"><div><Link href="/site-map" prefetch={false}>{t.home}</Link><p>BSU / PORTAL</p><h1>{title(entry)}</h1></div></section>{entry.route!=="/site-map"&&<InteriorNav route={entry.route}/>}<div className="bsu-arch-body">{groups?groups.map(g=><details key={g.entry.route} className="bsu-interior-index-details"><summary>{title(g.entry)} ({g.children.length+1})</summary>{cards([g.entry,...g.children])}</details>):<>{childrenEntries.length>0&&<section><h2>{t.sections}</h2>{cards(childrenEntries)}</section>}{materialHref&&<Link className="bsu-arch-material" href={materialHref} prefetch={false}>{t.ready} ↗</Link>}<p className="bsu-arch-note">{t.draft}</p></>}</div></main>;
}
