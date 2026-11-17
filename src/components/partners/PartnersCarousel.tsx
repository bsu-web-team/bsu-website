"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, Globe, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { partnerItems } from "@/lib/partners-carousel-data";
import "./partners.css";
const labels = {
 ru:{title:"Международные партнёры",u:"Университеты",o:"Организации и программы",note:"Перечень из материалов БГУ. Актуальность соглашений уточняется.",prev:"Назад",next:"Вперёд",pause:"Остановить прокрутку",play:"Возобновить прокрутку",all:"Все партнёры"},
 ky:{title:"Эл аралык өнөктөштөр",u:"Университеттер",o:"Уюмдар жана программалар",note:"БМУнун материалдарындагы тизме. Келишимдердин актуалдуулугу такталууда.",prev:"Артка",next:"Алдыга",pause:"Жылдырууну токтотуу",play:"Жылдырууну улантуу",all:"Бардык өнөктөштөр"},
 en:{title:"International partners",u:"Universities",o:"Organisations and programmes",note:"List from BSU materials. Current agreement status is subject to confirmation.",prev:"Previous",next:"Next",pause:"Pause scrolling",play:"Resume scrolling",all:"All partners"},
 "zh-CN":{title:"国际合作伙伴",u:"大学",o:"组织与项目",note:"名单来自比什凯克国立大学资料。协议的当前状态有待确认。",prev:"上一项",next:"下一项",pause:"暂停滚动",play:"继续滚动",all:"全部合作伙伴"}
} as const;
function Rail({group,locale}:{group:"university"|"organization";locale:Locale}) {
 const t=labels[locale], rail=useRef<HTMLDivElement>(null), host=useRef<HTMLElement>(null);
 const [paused,setPaused]=useState(false);
 const [hover,setHover]=useState(false);
 const items=partnerItems.filter(p=>p.group===group);
 function move(direction:number){const el=rail.current;if(!el)return;const step=(el.firstElementChild as HTMLElement|null)?.offsetWidth??250; const max=el.scrollWidth-el.clientWidth;const x=el.scrollLeft+direction*(step+16);const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;el.scrollTo({left:direction>0&&el.scrollLeft>=max-4?0:direction<0&&el.scrollLeft<=4?max:Math.max(0,Math.min(max,x)),behavior:reduced?"auto":"smooth"});}
 useEffect(()=>{if(paused||hover||window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;let visible=false;const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});if(host.current)observer.observe(host.current);const timer=window.setInterval(()=>{const el=rail.current;if(!visible||document.hidden||!el||host.current?.contains(document.activeElement))return; const max=el.scrollWidth-el.clientWidth;const step=(el.firstElementChild as HTMLElement|null)?.offsetWidth??250;el.scrollTo({left:el.scrollLeft>=max-4?0:Math.min(max,el.scrollLeft+step+16),behavior:"smooth"});},4500);return()=>{observer.disconnect();window.clearInterval(timer);};},[paused,hover]);
 return <section ref={host} className="bsu-partner-group" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}><div className="bsu-partner-tools"><h3>{group==="university"?t.u:t.o} <small>{items.length}</small></h3><div className="bsu-partner-buttons"><button type="button" aria-label={paused?t.play:t.pause} title={paused?t.play:t.pause} aria-pressed={paused} onClick={()=>setPaused(v=>!v)}>{paused?<Play size={18}/>:<Pause size={18}/>}</button><button type="button" aria-label={t.prev} onClick={()=>move(-1)}><ChevronLeft size={20}/></button><button type="button" aria-label={t.next} onClick={()=>move(1)}><ChevronRight size={20}/></button></div></div><div ref={rail} className="bsu-partner-rail" tabIndex={0} role="region" aria-label={group==="university"?t.u:t.o}>{items.map((p,i)=><article className="bsu-partner-card" key={p.id}><div className="bsu-partner-top"><span>{String(i+1).padStart(2,"0")} / BSU</span>{group==="university"?<Building2 size={23}/>:<Globe size={23}/>}</div><p>{p.names[locale]}</p><span className="bsu-partner-line" aria-hidden="true"/></article>)}</div></section>;
}
export default function PartnersCarousel({locale:fixedLocale,showLink=false}:{locale?:Locale;showLink?:boolean}){const {locale:uiLocale}=useLocale();const locale=fixedLocale??uiLocale;const t=labels[locale];return <section className="bsu-partners" lang={locale}><div className="bsu-partner-heading"><div><p>BSU / INTERNATIONAL</p><h2>{t.title}</h2></div>{showLink&&<Link href="/international/partners" className="bsu-partner-more">{t.all}<ArrowUpRight size={17}/></Link>}</div><p className="bsu-partner-note">{t.note}</p><Rail group="university" locale={locale}/><Rail group="organization" locale={locale}/></section>}
