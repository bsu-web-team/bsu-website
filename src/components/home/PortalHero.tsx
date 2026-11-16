"use client";
import {useEffect,useState,useSyncExternalStore, type CSSProperties} from "react";
import Link from "next/link";
import Image from "next/image";
import {ArrowRight,ArrowUpRight,ChevronLeft,ChevronRight,Pause,Play} from "lucide-react";
import {useLocale} from "@/components/i18n/LocaleProvider";
import type {Locale} from "@/lib/i18n";
const SLIDE_DURATION = 6500;
const exploreLabels={ru:"?? ????????????",ky:"??????????? ???????",en:"EXPLORE THE UNIVERSITY","zh-CN":"????"};
const playback={ru:["????????????? ??????","?????????? ??????"],ky:["?????????? ????????","?????????? ???????"],en:["Pause slides","Resume slides"],"zh-CN":["????","????"]};
function subscribeMotion(callback:()=>void){const media=window.matchMedia("(prefers-reduced-motion: reduce)");media.addEventListener("change",callback);return ()=>media.removeEventListener("change",callback);}
function subscribeVisibility(callback:()=>void){document.addEventListener("visibilitychange",callback);return ()=>document.removeEventListener("visibilitychange",callback);}
const signatureSlides: Record<Locale, { first: string; second: string; description: string }[]> = {
  ru: [
    {first:"Знания. Культура.",second:"Будущее.",description:"Учитесь, исследуйте и создавайте будущее вместе с Бишкекским государственным университетом имени К. Карасаева."},
    {first:"Исследуй. Учись.",second:"Создавай.",description:"От первых открытий до профессионального роста — найдите собственный путь в БГУ."},
    {first:"Мир открыт",second:"для тебя.",description:"Языки, международное сотрудничество, образование и научные возможности объединяют людей и идеи."}
  ],
  ky: [
    {first:"Билим. Маданият.",second:"Келечек.",description:"К. Карасаев атындагы Бишкек мамлекеттик университети менен бирге билим алып, изилдеп, келечекти түзүңүз."},
    {first:"Изилде. Оку.",second:"Жарат.",description:"Алгачкы ачылыштардан кесиптик өсүүгө чейин — БМУда өз жолуңузду табыңыз."},
    {first:"Дүйнө сиз үчүн",second:"ачык.",description:"Тилдер, эл аралык кызматташтык, билим берүү жана илим адамдарды жана идеяларды бириктирет."}
  ],
  en: [
    {first:"Knowledge. Culture.",second:"Tomorrow.",description:"Learn, discover and shape tomorrow at Bishkek State University named after K. Karasaev."},
    {first:"Explore. Learn.",second:"Create.",description:"From first discoveries to professional growth, find your own path at BSU."},
    {first:"The world is",second:"open to you.",description:"Languages, international collaboration, education and research bring people and ideas together."}
  ],
  "zh-CN": [
    {first:"知识 · 文化",second:"· 未来",description:"与以卡拉萨耶夫院士命名的比什凯克国立大学一起学习、探索、创造未来。"},
    {first:"探索 · 学习",second:"· 创造",description:"从最初的发现到职业成长，在大学找到属于自己的道路。"},
    {first:"世界向你",second:"敞开。",description:"语言、国际合作、教育与科研将人与思想连接起来。"}
  ]
};
// Preview photography of the actual Bishkek State University campus.
// External sources are temporary; replace with approved locally hosted BSU photos before launch.
const campusPhotos = [
  { url: "https://cdn-1.aki.kg/st_gallery/24/984124.7d8b588e322af6c4dc7ce1a0c29cba70.jpg", position: "center 50%" },
  { url: "https://www.siluxgc.com/image/2024-01-13/1195823654929203200.jpg", position: "center center" },
  { url: "https://cdn.ruwiki.ru/commonswiki/files/thumb/2/27/BHU_fantan.jpg/1200px-BHU_fantan.jpg", position: "center center" },
] as const;


export default function PortalHero({c,labels}:{c:{eyebrow:string;apply:string;explore:string;scroll:string;photoLabel:string};labels:{previous:string;next:string}}){
 const {locale}=useLocale();
 const [activeSlide,setActiveSlide]=useState(0);
 const [revision,setRevision]=useState(0);
 const [paused,setPaused]=useState(false);
 const reduced=useSyncExternalStore(subscribeMotion,()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches,()=>false);
 const hidden=useSyncExternalStore(subscribeVisibility,()=>document.hidden,()=>false);
 const slide=signatureSlides[locale][activeSlide];
 function changeSlide(index:number){setActiveSlide(index);setRevision(value=>value+1);}
 useEffect(()=>{
   if(paused || reduced || hidden)return;
   const timer=window.setTimeout(()=>{setActiveSlide(value=>(value+1)%3);setRevision(value=>value+1);},SLIDE_DURATION);
   return ()=>window.clearTimeout(timer);
 },[activeSlide,revision,locale,paused,reduced,hidden]);
 return <section className="bsu-portal" data-paused={paused || reduced || hidden} style={{"--bsu-slide-duration": `${SLIDE_DURATION}ms`} as CSSProperties} aria-labelledby="bsu-hero-heading">
      <div className="bsu-portal-noise" aria-hidden="true" />
      <div className="bsu-portal-topline" aria-hidden="true"><span>BSU <i>×</i> BISHKEK</span><span>EST. / UNIVERSITY</span></div>
      <div className="bsu-portal-stage">
        <div className="bsu-portal-typography">
          <p className="bsu-portal-overline"><span className="bsu-portal-pulse" />{c.eyebrow}</p>
          <p className="bsu-portal-index">0{activeSlide + 1}<span> / 03</span></p>
          <div key={`${locale}-${activeSlide}`} className="bsu-portal-words">
            <h1 id="bsu-hero-heading"><span>{slide.first}</span><strong>{slide.second}</strong></h1>
            <p>{slide.description}</p>
          </div>
          <div className="bsu-portal-links">
            <Link href="/admissions" className="bsu-portal-primary">{c.apply}<ArrowUpRight size={20}/></Link>
            <Link href="/about" className="bsu-portal-secondary">{c.explore}<ArrowRight size={19}/></Link>
          </div>
          <div className="bsu-portal-minitext"><span>KY / RU / EN / 中文</span><span>{c.scroll} ↓</span></div>
        </div>
        <div className="bsu-portal-gallery" aria-label={c.photoLabel}>
          <div className="bsu-portal-massive" aria-hidden="true">БГУ</div>
          <div className="bsu-portal-frame bsu-portal-frame-one">
            {campusPhotos.map((photo,index)=><div key={photo.url} className={`bsu-portal-image${activeSlide===index?' is-on':''}`} ><Image src={photo.url} alt="" fill sizes="(max-width: 520px) 80vw, (max-width: 900px) 70vw, 45vw" loading={index===0?"eager":"lazy"} style={{objectFit:"cover",objectPosition:photo.position}}/></div>)}
            <div className="bsu-portal-overlay" />
            <div className="bsu-portal-frame-tag">01 / {locale === 'ru' ? 'КАМПУС' : locale === 'ky' ? 'КАМПУС' : locale === 'en' ? 'CAMPUS' : '校园'}</div>
          </div>
          <div className="bsu-portal-frame bsu-portal-frame-two" aria-hidden="true">
            {campusPhotos.map((photo,index)=><div key={photo.url} className={`bsu-portal-image${activeSlide===index?' is-on':''}`} ><Image src={photo.url} alt="" fill sizes="(max-width: 520px) 80vw, (max-width: 900px) 70vw, 45vw" loading={index===0?"eager":"lazy"} style={{objectFit:"cover",objectPosition:photo.position}}/></div>)}
            <div className="bsu-portal-overlay" />
          </div>
          <div className="bsu-portal-ring" aria-hidden="true"><span>BSU</span><span>✳</span></div>
          <div className="bsu-portal-caption">{locale === 'ru' ? 'Идеи. Люди. Будущее.' : locale === 'ky' ? 'Идеялар. Адамдар. Келечек.' : locale === 'en' ? 'Ideas. People. Future.' : '思想 · 人才 · 未来'}</div>
        </div>
      </div>
      <div className="bsu-portal-navigator">
        <div className="bsu-portal-arrowset"><button type="button" aria-label={playback[locale][paused?1:0]} aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{paused ? <Play size={16}/> : <Pause size={16}/>}</button>
          <button type="button" aria-label={labels.previous} onClick={()=>changeSlide((activeSlide+2)%3)}><ChevronLeft size={20}/></button>
          <button type="button" aria-label={labels.next} onClick={()=>changeSlide((activeSlide+1)%3)}><ChevronRight size={20}/></button>
        </div>
        <div className="bsu-portal-dots" role="group" aria-label={locale === 'ru' ? 'Слайды главной страницы' : locale === 'ky' ? 'Башкы беттин слайддары' : locale === 'en' ? 'Homepage slides' : '首页轮播幻灯片'}>
          {signatureSlides[locale].map((_,index)=><button key={index} type="button" aria-label={`${index+1}/3`} aria-current={activeSlide===index?'true':undefined} className={`bsu-portal-dot${activeSlide===index?' is-active':''}`} onClick={()=>changeSlide(index)}><span>{activeSlide===index && <i key={`${revision}-${locale}-${paused}-${reduced}-${hidden}`}/>}</span></button>)}
        </div>
        <span className="bsu-portal-navigator-label">{exploreLabels[locale]} <ArrowUpRight size={14}/></span>
      </div>
    </section>;
}
