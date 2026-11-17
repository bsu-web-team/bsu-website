"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight, ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { siteRegistry } from "@/lib/site-registry";
const labels={ru:["Разделы","Обзор","Подробно","Кафедры","Программы","Преподаватели","Документы","Новости","Карта сайта"],ky:["Бөлүмдөр","Обзор","Толук маалымат","Кафедралар","Программалар","Окутуучулар","Документтер","Жаңылыктар","Сайттын картасы"],en:["Sections","Overview","Details","Departments","Programs","Faculty and staff","Documents","News","Site map"],"zh-CN":["栏目","概览","详细介绍","系","专业","教职员工","文件","新闻","网站地图"]};
const facultyTabs=["","details","departments","programs","staff","documents","news"];
export default function InteriorNav({route,facultyBase,activeTab=""}:{route?:string;facultyBase?:string;activeTab?:string}){
 const {locale}=useLocale();const t=labels[locale];
 const detailsRef=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{
   const outside=(event:PointerEvent)=>{const el=detailsRef.current;if(el?.open&&!el.contains(event.target as Node))el.open=false;};
   const escape=(event:KeyboardEvent)=>{const el=detailsRef.current;if(event.key==="Escape"&&el?.open){el.open=false;el.querySelector("summary")?.focus();}};
   document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
   return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
 },[]);
 const close=()=>{if(detailsRef.current)detailsRef.current.open=false;};
 let items:{href:string;label:string;active:boolean}[]=[];
 if(facultyBase){items=facultyTabs.map((tab,i)=>({href:facultyBase+(tab?`/${tab}`:""),label:t[i+1],active:tab===activeTab}));}
 else{const entry=siteRegistry.find(r=>r.route===route);if(!entry)return null;const children=siteRegistry.filter(r=>r.parent===entry.route);const parent=siteRegistry.find(r=>r.route===entry.parent);const base=entry.parent==="/"||children.length>0?entry:parent??entry;items=[base,...siteRegistry.filter(r=>r.parent===base.route)].map(r=>({href:r.route,label:r.titles[locale],active:route===r.route}));if(items.length<2)return null;}
 const currentRoute=route??facultyBase??"/faculties";const trail:string[]=[];let node=siteRegistry.find(r=>r.route===currentRoute)??siteRegistry.find(r=>r.route==="/faculties");while(node&&!trail.includes(node.route)){trail.unshift(node.route);node=siteRegistry.find(r=>r.route===node?.parent);} const crumb=(href:string)=>siteRegistry.find(r=>r.route===href)?.titles[locale]??href;
 return <><nav className="bn-crumb" aria-label={t[0]}>{trail.map((href,i)=><span key={href}>{i>0&&<span aria-hidden="true"> / </span>}{i===trail.length-1&&!facultyBase?<span aria-current="page">{crumb(href)}</span>:<Link href={href} prefetch={false}>{crumb(href)}</Link>}</span>)}{facultyBase&&<span> / {items.find(r=>r.active)?.label}</span>}</nav><nav aria-label={t[0]} className="bsu-interior-nav bsu-section-compact" data-bsu-no-motion><div className="bsu-compact-row"><span className="bsu-compact-current">{items.find(item=>item.active)?.label??items[0]?.label}</span><details ref={detailsRef} className="bsu-compact-details" key={`${currentRoute}-${activeTab}-${locale}`}><summary><span>{t[0]}</span><ChevronDown size={16} aria-hidden="true"/></summary><div className="bsu-compact-panel">{items.map(item=><Link href={item.href} key={item.href} prefetch={false} aria-current={item.active?"page":undefined} onClick={close}><span>{item.label}</span>{item.active?<Check size={16} aria-hidden="true"/>:<ArrowUpRight size={15} aria-hidden="true"/>}</Link>)}</div></details></div></nav></>;
}
