"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Building2, Globe } from "lucide-react";
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
function InfiniteRail({group,locale}:{group:"university"|"organization";locale:Locale}) {
 const t=labels[locale];
 const rail=useRef<HTMLDivElement>(null);
 const items=partnerItems.filter(p=>p.group===group);
 const instructions={ru:"Прокрутка партнёров. Стрелки клавиатуры — перемещение, пробел — пауза или продолжение.",ky:"Өнөктөштөрдү жылдыруу. Жебелер — жылдыруу, боштук — токтотуу же улантуу.",en:"Partner carousel. Arrow keys to scroll; Space to pause or resume.","zh-CN":"合作伙伴轮播。方向键滚动，空格键暂停或继续。"}[locale];
 useEffect(()=>{
  const el=rail.current;
  if(!el||!items.length)return;
  const reduce=window.matchMedia("(prefers-reduced-motion: reduce)");
  let cycle=0, visible=false, hovered=false, focused=false, paused=false;
  let frame=0, last=0, fractional=0, manualUntil=0, written=0;
  let drag:{id:number;x:number;left:number}|null=null;
  let touching=false;
  const markManual=()=>{manualUntil=performance.now()+1300;fractional=0;};
  const write=(value:number)=>{el.scrollLeft=value;written=el.scrollLeft;};
  const wrap=()=>{
   if(!cycle)return;
   const x=el.scrollLeft;
   if(x<cycle*.5) {const shift=cycle;write(x+shift);if(drag)drag.left+=shift;}
   else if(x>=cycle*1.5){const shift=-cycle;write(x+shift);if(drag)drag.left+=shift;}
  };
  const measure=()=>{
   const first=el.children[0], copy=el.children[items.length];
   if(!first||!copy)return;
   const next=copy.getBoundingClientRect().left-first.getBoundingClientRect().left;
   if(next<=0)return;
   const phase=cycle?((el.scrollLeft%cycle)+cycle)%cycle/cycle:0;
   cycle=next;write(cycle+phase*cycle);wrap();
  };
  const tick=(now:number)=>{
   frame=0;
   const dt=last?Math.min(now-last,50):0;last=now;
   if(visible&&!document.hidden&&!reduce.matches&&!hovered&&!focused&&!paused&&!drag&&!touching&&now>manualUntil&&cycle){
    fractional+=dt*(group==="university"?0.035:0.028);
    const step=Math.floor(fractional);
    if(step){fractional-=step;write(el.scrollLeft+step);wrap();}
   }else fractional=0;
   if(visible&&!document.hidden&&!reduce.matches)frame=requestAnimationFrame(tick);
  };
  const sync=()=>{
   if(visible&&!document.hidden&&!reduce.matches){if(!frame){last=0;frame=requestAnimationFrame(tick);}}
   else if(frame){cancelAnimationFrame(frame);frame=0;last=0;}
  };
  const onScroll=()=>{if(Math.abs(el.scrollLeft-written)>1)markManual();wrap();};
  const onEnter=(e:PointerEvent)=>{if(e.pointerType==="mouse")hovered=true;};
  const onLeave=(e:PointerEvent)=>{if(e.pointerType==="mouse"){hovered=false;markManual();}};
  const onFocus=()=>{focused=true;};
  const onBlur=(e:FocusEvent)=>{if(!el.contains(e.relatedTarget as Node|null)){focused=false;markManual();}};
  const onDown=(e:PointerEvent)=>{
   markManual();
   if(e.pointerType==="touch"||e.pointerType==="pen"){touching=true;return;}
   if(e.button!==0||!cycle)return;
   drag={id:e.pointerId,x:e.clientX,left:el.scrollLeft};
   el.setPointerCapture(e.pointerId);el.classList.add("is-dragging");e.preventDefault();
  };
  const onMove=(e:PointerEvent)=>{if(!drag||drag.id!==e.pointerId)return;markManual();write(drag.left+drag.x-e.clientX);wrap();};
  const onEnd=(e:PointerEvent)=>{
   if(e.pointerType==="touch"||e.pointerType==="pen"){touching=false;markManual();}
   if(drag?.id!==e.pointerId)return;
   drag=null;el.classList.remove("is-dragging");markManual();
   if(el.hasPointerCapture(e.pointerId))el.releasePointerCapture(e.pointerId);
  };
  const onWheel=(e:WheelEvent)=>{
   if(Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.shiftKey){
    e.preventDefault();markManual();
    const multiplier=e.deltaMode===1?16:e.deltaMode===2?el.clientWidth:1;
    write(el.scrollLeft+(e.deltaX||e.deltaY)*multiplier);wrap();
   }
  };
  const onKey=(e:KeyboardEvent)=>{
   if(e.key==="ArrowLeft"||e.key==="ArrowRight"){e.preventDefault();markManual();write(el.scrollLeft+(e.key==="ArrowRight"?1:-1)*220);wrap();}
   else if(e.code==="Space"){e.preventDefault();paused=!paused;focused=false;markManual();}
  };
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync();});observer.observe(el);
  const size=new ResizeObserver(measure);size.observe(el);measure();
  el.addEventListener("scroll",onScroll,{passive:true});el.addEventListener("pointerenter",onEnter);el.addEventListener("pointerleave",onLeave);
  el.addEventListener("focusin",onFocus);el.addEventListener("focusout",onBlur);
  el.addEventListener("pointerdown",onDown);el.addEventListener("pointermove",onMove);el.addEventListener("lostpointercapture",onEnd);
  window.addEventListener("pointerup",onEnd);window.addEventListener("pointercancel",onEnd);
  el.addEventListener("wheel",onWheel,{passive:false});el.addEventListener("keydown",onKey);
  document.addEventListener("visibilitychange",sync);reduce.addEventListener("change",sync);
  return()=>{
   observer.disconnect();size.disconnect();if(frame)cancelAnimationFrame(frame);
   el.removeEventListener("scroll",onScroll);el.removeEventListener("pointerenter",onEnter);el.removeEventListener("pointerleave",onLeave);
   el.removeEventListener("focusin",onFocus);el.removeEventListener("focusout",onBlur);
   el.removeEventListener("pointerdown",onDown);el.removeEventListener("pointermove",onMove);el.removeEventListener("lostpointercapture",onEnd);
   window.removeEventListener("pointerup",onEnd);window.removeEventListener("pointercancel",onEnd);
   el.removeEventListener("wheel",onWheel);el.removeEventListener("keydown",onKey);
   document.removeEventListener("visibilitychange",sync);reduce.removeEventListener("change",sync);
  };
 },[group,items.length]);
 return <section className="bsu-partner-group"><div className="bsu-partner-tools"><h3>{group==="university"?t.u:t.o} <small>{items.length}</small></h3></div><div ref={rail} className="bsu-partner-rail bsu-partner-infinite" tabIndex={0} role="region" aria-label={(group==="university"?t.u:t.o)+". "+instructions}>{[0,1,2].flatMap(copy=>items.map((p,i)=><article className="bsu-partner-card" key={copy+"-"+p.id} aria-hidden={copy!==1?true:undefined}><div className="bsu-partner-top"><span>{String(i+1).padStart(2,"0")} / BSU</span>{group==="university"?<Building2 size={23}/>:<Globe size={23}/>}</div><p>{p.names[locale]}</p></article>))}</div></section>;
}
export default function PartnersCarousel({locale:fixedLocale,showLink=false}:{locale?:Locale;showLink?:boolean}){const {locale:uiLocale}=useLocale();const locale=fixedLocale??uiLocale;const t=labels[locale];return <section className="bsu-partners" lang={locale}><div className="bsu-partner-heading"><div><p>BSU / INTERNATIONAL</p><h2>{t.title}</h2></div>{showLink&&<Link href="/international/partners" className="bsu-partner-more">{t.all}<ArrowUpRight size={17}/></Link>}</div><p className="bsu-partner-note">{t.note}</p><InfiniteRail group="university" locale={locale}/><InfiniteRail group="organization" locale={locale}/></section>}
