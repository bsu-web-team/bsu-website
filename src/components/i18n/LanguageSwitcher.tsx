"use client";
import { useEffect, useRef, useState } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { locales, type Locale } from "@/lib/i18n";
const names: Record<Locale,string> = {ru:"Русский",ky:"Кыргызча",en:"English","zh-CN":"中文"};
const short: Record<Locale,string> = {ru:"RU",ky:"KG",en:"EN","zh-CN":"中文"};
const labels: Record<Locale,string> = {ru:"Выбрать язык",ky:"Тилди тандоо",en:"Choose language","zh-CN":"选择语言"};
export default function LanguageSwitcher(){
 const {locale,setLocale}=useLocale();
 const [open,setOpen]=useState(false);
 const root=useRef<HTMLDivElement>(null);
 const trigger=useRef<HTMLButtonElement>(null);
 useEffect(()=>{
  if(!open)return;
  function outside(e:PointerEvent){if(!root.current?.contains(e.target as Node))setOpen(false);}
  function escape(e:KeyboardEvent){if(e.key==="Escape"){setOpen(false);trigger.current?.focus();}}
  document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
  return()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
 },[open]);
 return <div ref={root} className="bn-language" onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget))setOpen(false);}}>
  <button ref={trigger} type="button" className="bn-lang-trigger" aria-label={labels[locale]} aria-expanded={open} onClick={()=>setOpen(v=>!v)}><Globe size={18} aria-hidden="true"/><span>{short[locale]}</span><ChevronDown size={13} aria-hidden="true"/></button>
  {open&&<div className="bn-lang-panel" role="group" aria-label={labels[locale]}>{locales.map(value=><button key={value} type="button" lang={value} aria-pressed={locale===value} onClick={()=>{setLocale(value);setOpen(false);trigger.current?.focus();}}><span>{names[value]}</span>{locale===value&&<Check size={16} aria-hidden="true"/>}</button>)}</div>}
 </div>;
}
