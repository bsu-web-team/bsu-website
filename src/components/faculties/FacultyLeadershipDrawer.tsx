"use client";
import { useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, UserRound, Users, X } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import PublicTextV13, { PublicPersonV13 } from "@/components/i18n/PublicTextV13";
type Person = {name:string; position:string; photo?:string};
const labels = {
 ru: {title:"Структура руководства",deputies:"Заместители",heads:"Заведующие кафедрами",other:"Другие сотрудники",staff:"Общий каталог сотрудников",close:"Закрыть",empty:"Дополнительные сведения пока не опубликованы."},
 ky: {title:"Жетекчилик түзүмү",deputies:"Орун басарлар",heads:"Кафедра башчылары",other:"Башка кызматкерлер",staff:"Кызматкерлердин каталогу",close:"Жабуу",empty:"Кошумча маалымат азырынча жарыялана элек."},
 en: {title:"Leadership structure",deputies:"Deputies",heads:"Heads of departments",other:"Other staff",staff:"University staff directory",close:"Close",empty:"Additional information has not been published yet."},
 "zh-CN": {title:"领导架构",deputies:"副院长及副主任",heads:"系主任",other:"其他工作人员",staff:"教职员工名录",close:"关闭",empty:"暂无更多资料。"},
};
function PersonCard({person,major=false}:{person:Person;major?:boolean}) {
 return <article className={"bsu-leadership-person"+(major?" is-leader":"")}>
 {person.photo?<Image src={person.photo} alt="" width={96} height={116} unoptimized loading="lazy"/>:<span className="bsu-leadership-avatar"><UserRound size={27}/></span>}
 <div><strong><PublicPersonV13 name={person.name}/></strong><p><PublicTextV13 value={person.position}/></p></div></article>;
}
export default function FacultyLeadershipDrawer({leader,people}:{leader:Person;people:Person[]}) {
 const {locale}=useLocale(); const t=labels[locale]; const dialog=useRef<HTMLDialogElement>(null); const trigger=useRef<HTMLButtonElement>(null); const titleId=useId(); const [open,setOpen]=useState(false);
 const normalize=(name:string)=>name.toLowerCase().replace(/[^\p{L}]/gu,"");
 const rest=people.filter(p=>normalize(p.name)!==normalize(leader.name));
 const deputy=(p:Person)=>/замест|зам[.\s]|орун\s*басар|deputy|vice[- ]?(dean|director)/i.test(p.position);
 const head=(p:Person)=>/завед|зав[.\s]|кафедра.*башчы|башчысы|head of|chair/i.test(p.position);
 const deputies=rest.filter(deputy); const heads=rest.filter(p=>!deputy(p)&&head(p)); const others=rest.filter(p=>!deputy(p)&&!head(p));
 function group(title:string,items:Person[],collapse=false):ReactNode {
 if(!items.length)return null;
 return collapse?<details className="bsu-leadership-group"><summary>{title}<span>{items.length} <ChevronDown size={16}/></span></summary><div className="bsu-leadership-list">{items.map((p,i)=><PersonCard key={p.name+i} person={p}/>)}</div></details>:<section className="bsu-leadership-group"><h3>{title}<span>{items.length}</span></h3><div className="bsu-leadership-list">{items.map((p,i)=><PersonCard key={p.name+i} person={p}/>)}</div></section>;
 }
 return <><button ref={trigger} className="bsu-leadership-trigger" type="button" aria-haspopup="dialog" aria-expanded={open} onClick={()=>{dialog.current?.showModal();setOpen(true);}}><Users size={18}/><span>{t.title}</span><ArrowUpRight size={16}/></button>
 <dialog ref={dialog} className="bsu-leadership-drawer" aria-labelledby={titleId} onClose={()=>{setOpen(false);trigger.current?.focus();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}}}>
 {open&&<><header className="bsu-leadership-header"><h2 id={titleId}>{t.title}</h2><button type="button" aria-label={t.close} onClick={()=>dialog.current?.close()}><X size={23}/></button></header><div className="bsu-leadership-body"><PersonCard person={leader} major/>{group(t.deputies,deputies)}{group(t.heads,heads)}{group(t.other,others)}{!rest.length&&<p className="bsu-leadership-empty">{t.empty}</p>}<Link className="bsu-leadership-directory" href="/staff" prefetch={false} onClick={()=>dialog.current?.close()}>{t.staff}<ArrowUpRight size={16}/></Link></div></>}
 </dialog></>;
}
