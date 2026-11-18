"use client";
import PartnersCarousel from "@/components/partners/PartnersCarousel";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, BookOpen, CalendarDays, Compass, FileText, GraduationCap, LibraryBig, Microscope,
  Newspaper, Users, ChevronLeft, ChevronRight
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { faculties } from "@/lib/faculty-data";
import { translateContent } from "@/lib/content-translations";
import { newsRecords } from "@/lib/news-data";
import { localizeNews, formatLocalizedNewsDate, newsUi } from "@/lib/news-i18n";

type Texts = {
  eyebrow: string; headingOne: string; headingTwo: string; intro: string;
  explore: string; apply: string; scroll: string; photoLabel: string; photoCaption: string;
  kicker: string; exploreTitle: string; exploreIntro: string; facultyKicker: string;
  facultyTitle: string; facultyIntro: string; allFaculties: string; seeDetails: string;
  studyKicker: string; studyTitle: string; studyIntro: string; bachelors: string;
  masters: string; research: string; newsKicker: string; newsTitle: string;
  newsIntro: string; allNews: string; servicesKicker: string; servicesTitle: string;
  servicesIntro: string; documents: string; programs: string; library: string;
  science: string; closingTag: string; closingTitle: string; closingIntro: string;
  closingCta: string; sourceNotice: string;
};
const copy: Record<Locale, Texts> = {
  ru: {
    eyebrow:"Университет возможностей · Бишкек", headingOne:"Будущее начинается", headingTwo:"с образования", intro:"Открывайте знания, новые направления и международные перспективы в Бишкекском государственном университете имени К. Карасаева.",
    explore:"Узнать об университете",apply:"Поступление",scroll:"Листайте вниз",photoLabel:"Место, где встречаются идеи",photoCaption:"Визуальная концепция. Здесь будет официальная фотография БГУ.",
    kicker:"Ваш маршрут",exploreTitle:"Начните с главного",exploreIntro:"Всё необходимое для поступления, учёбы и работы в университете — без лишних переходов.",facultyKicker:"Университет сегодня",facultyTitle:"Ваше направление — ваш путь",facultyIntro:"Факультеты и институты объединяют разные области знаний и возможности развития.",allFaculties:"Все факультеты и институты",seeDetails:"Подробнее",
    studyKicker:"Образовательные возможности",studyTitle:"От первого курса до исследований",studyIntro:"Изучайте программы и найдите подходящий уровень образования.",bachelors:"Бакалавриат",masters:"Магистратура",research:"Наука и исследования",
    newsKicker:"Жизнь университета",newsTitle:"События и новости",newsIntro:"Актуальные материалы из предварительного каталога университета.",allNews:"Читать все новости",servicesKicker:"Для студентов",servicesTitle:"Всё нужное — в одном месте",servicesIntro:"Быстрый доступ к разделам сайта и университетской информации.",documents:"Документы",programs:"Программы",library:"Библиотека",science:"Научная деятельность",closingTag:"Следующий шаг",closingTitle:"Твоя история начинается здесь",closingIntro:"Познакомьтесь с образовательными программами и условиями поступления.",closingCta:"Выбрать программу",sourceNotice:"Материалы и переводы предварительные. Перед официальной публикацией необходима проверка БГУ."
  },
  ky: {
    eyebrow:"Мүмкүнчүлүктөр университети · Бишкек",headingOne:"Келечек билимден",headingTwo:"башталат",intro:"К. Карасаев атындагы Бишкек мамлекеттик университетинде билимге, жаңы багыттарга жана эл аралык мүмкүнчүлүктөргө жол ачыңыз.",
    explore:"Университет жөнүндө",apply:"Окууга кабыл алуу",scroll:"Төмөн карай жылдырыңыз",photoLabel:"Идеялар жолуккан мейкиндик",photoCaption:"Дизайн концепциясы. Бул жерге БМУнун расмий сүрөтү жайгаштырылат.",
    kicker:"Сиздин багытыңыз",exploreTitle:"Эң негизгисинен баштаңыз",exploreIntro:"Окууга тапшыруу, билим алуу жана университетте иштөө үчүн керектүү маалымат бир жерде.",facultyKicker:"Университет бүгүн",facultyTitle:"Сиздин багыт — сиздин жол",facultyIntro:"Факультеттер менен институттар билимдин ар кандай багыттарын жана өнүгүү мүмкүнчүлүктөрүн бириктирет.",allFaculties:"Бардык факультеттер жана институттар",seeDetails:"Кененирээк",
    studyKicker:"Билим алуу мүмкүнчүлүктөрү",studyTitle:"Биринчи курстан илимге чейин",studyIntro:"Программаларды карап чыгып, билим берүүнүн ылайыктуу баскычын тандаңыз.",bachelors:"Бакалавриат",masters:"Магистратура",research:"Илим жана изилдөөлөр",
    newsKicker:"Университеттин жашоосу",newsTitle:"Окуялар жана жаңылыктар",newsIntro:"Университеттин алдын ала даярдалган жаңылыктар жыйнагынан материалдар.",allNews:"Бардык жаңылыктар",servicesKicker:"Студенттер үчүн",servicesTitle:"Керектүүнүн баары бир жерде",servicesIntro:"Сайттын бөлүмдөрүнө жана университет тууралуу маалыматка тез жетүү.",documents:"Документтер",programs:"Программалар",library:"Китепкана",science:"Илимий ишмердүүлүк",closingTag:"Кийинки кадам",closingTitle:"Сиздин тарыхыңыз ушул жерден башталат",closingIntro:"Билим берүү программалары жана кабыл алуу шарттары менен таанышыңыз.",closingCta:"Программаны тандоо",sourceNotice:"Материалдар жана котормолор алдын ала даярдалган. Расмий жарыялоодон мурда БМУ текшериши керек."
  },
  en: {
    eyebrow:"A university of opportunity · Bishkek",headingOne:"Your future starts",headingTwo:"with discovery",intro:"Explore knowledge, new disciplines and international opportunities at Bishkek State University named after K. Karasaev.",
    explore:"Discover BSU",apply:"Admissions",scroll:"Scroll to explore",photoLabel:"Where ideas come together",photoCaption:"Design concept. An approved BSU campus photo will appear here.",
    kicker:"Find your way",exploreTitle:"Start with what matters",exploreIntro:"Everything you need for admissions, study and campus life, in one place.",facultyKicker:"The university today",facultyTitle:"A place for every ambition",facultyIntro:"Explore faculties and institutes spanning disciplines and opportunities for growth.",allFaculties:"All faculties and institutes",seeDetails:"Explore",
    studyKicker:"Learning opportunities",studyTitle:"From your first year to research",studyIntro:"Explore academic programs and find your next step.",bachelors:"Bachelor's programs",masters:"Master's programs",research:"Research and science",
    newsKicker:"Campus life",newsTitle:"News and events",newsIntro:"Highlights from the university's preliminary news catalogue.",allNews:"View all news",servicesKicker:"Student resources",servicesTitle:"Everything in one place",servicesIntro:"Find essential university information and services quickly.",documents:"Documents",programs:"Programs",library:"Library",science:"Research",closingTag:"Take the next step",closingTitle:"Your story starts here",closingIntro:"Explore academic programs and admissions information.",closingCta:"Find a program",sourceNotice:"Content and translations are preliminary and require BSU review before official publication."
  },
  "zh-CN": {
    eyebrow:"机遇之校 · 比什凯克",headingOne:"未来始于",headingTwo:"探索与学习",intro:"在以卡拉萨耶夫院士命名的比什凯克国立大学，探索知识、专业方向和国际发展机遇。",
    explore:"了解大学",apply:"招生信息",scroll:"向下探索",photoLabel:"思想交汇的地方",photoCaption:"设计概念展示。此处将使用大学提供的官方校园照片。",
    kicker:"开启旅程",exploreTitle:"从重要的事开始",exploreIntro:"招生、学习和校园生活所需信息，轻松获取。",facultyKicker:"今日大学",facultyTitle:"找到属于你的方向",facultyIntro:"探索涵盖不同学科与发展机会的学院和研究所。",allFaculties:"查看所有学院",seeDetails:"了解更多",
    studyKicker:"学习机会",studyTitle:"从本科到科学研究",studyIntro:"浏览专业项目，寻找适合自己的学习阶段。",bachelors:"本科项目",masters:"硕士项目",research:"科研与科学",
    newsKicker:"校园生活",newsTitle:"新闻与活动",newsIntro:"大学新闻目录中的精选内容。",allNews:"查看全部新闻",servicesKicker:"学生服务",servicesTitle:"所需信息，一站获取",servicesIntro:"快速访问大学的重要信息与服务。",documents:"文件资料",programs:"专业目录",library:"图书馆",science:"科研活动",closingTag:"下一步",closingTitle:"你的故事从这里开始",closingIntro:"了解专业项目与招生信息。",closingCta:"选择专业",sourceNotice:"内容与译文均为初稿，正式发布前须经大学审核。"
  }
};

const paths = [
  { href: "/admissions", icon: GraduationCap, key: "admissions" },
  { href: "/programs", icon: Compass, key: "programs" },
  { href: "/staff", icon: Users, key: "staff" },
  { href: "/news", icon: Newspaper, key: "news" },
] as const;
const educationPaths = [
  { href: "/programs", icon: GraduationCap, key: "bachelors" },
  { href: "/programs", icon: BookOpen, key: "masters" },
  { href: "/science", icon: Microscope, key: "research" },
] as const;
const services = [
  { href: "/documents", icon: FileText, key: "documents" },
  { href: "/programs", icon: GraduationCap, key: "programs" },
  { href: "/library", icon: LibraryBig, key: "library" },
  { href: "/science", icon: Microscope, key: "science" },
] as const;

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

const motionLabels: Record<Locale,{previous:string;next:string;facultyPrevious:string;facultyNext:string;intro:string}> = {
  ru:{previous:"Предыдущий слайд",next:"Следующий слайд",facultyPrevious:"Прокрутить факультеты назад",facultyNext:"Прокрутить факультеты вперёд",intro:"Бишкекский государственный университет"},
  ky:{previous:"Мурунку слайд",next:"Кийинки слайд",facultyPrevious:"Факультеттерди артка жылдыруу",facultyNext:"Факультеттерди алдыга жылдыруу",intro:"Бишкек мамлекеттик университети"},
  en:{previous:"Previous slide",next:"Next slide",facultyPrevious:"Scroll faculties back",facultyNext:"Scroll faculties forward",intro:"Bishkek State University"},
  "zh-CN":{previous:"上一张",next:"下一张",facultyPrevious:"向前浏览学院",facultyNext:"向后浏览学院",intro:"比什凯克国立大学"}
};

const featuredFaculties = [faculties[1], faculties[0], faculties[3], faculties[8]].filter(Boolean);
const sortedNews = [...newsRecords].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

export default function ModernHome() {
  const { locale, t } = useLocale();
  const c = copy[locale];
  const [activeSlide, setActiveSlide] = useState(0);
  // Keep the server and initial client render identical; CSS hides reduced-motion intro.
  const [showIntro, setShowIntro] = useState(true);
  const facultyRailRef = useRef<HTMLDivElement | null>(null);
  const slide = signatureSlides[locale][activeSlide];
  const labels = motionLabels[locale];
  useEffect(() => {
    const introTimer = window.setTimeout(() => setShowIntro(false), 1150);
    return () => { window.clearTimeout(introTimer); };
  }, []);
  // Restart the slide timer after both automatic and manual changes so that
  // the active indicator always fills during the current slide's duration.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;
    const interval = window.setInterval(() => {
      if (!document.hidden) setActiveSlide(current => (current + 1) % 3);
    }, 6500);
    return () => window.clearInterval(interval);
  }, [activeSlide]);
  const scrollFaculties = (direction: number) => {
    facultyRailRef.current?.scrollBy({left: direction * Math.min(360, facultyRailRef.current.clientWidth * .85), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  };
  useEffect(() => {
    const nodes = document.querySelectorAll<HTMLElement>(".bsu-modern-home [data-bsu-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("bsu-revealed"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        // Replay the lightweight CSS reveal each time the block re-enters the viewport.
        // No scroll listeners, timers, or JS-driven frame updates are needed.
        entry.target.classList.toggle("bsu-revealed", entry.isIntersecting);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  const facultyItems = featuredFaculties;
  const latest = sortedNews.map(n => localizeNews(n, locale));
  const newsCategories = newsUi[locale].categories;
  const shortcutLabels = { admissions:t("forApplicants"), programs:t("programCatalog"),staff:t("staff"),news:t("newsShort") };

  return <main>
    {showIntro && <div className="bsu-motion-intro" role="presentation" aria-hidden="true">
      <div className="bsu-motion-intro-mark"><svg viewBox="0 0 120 120" fill="none" aria-hidden="true"><circle cx="60" cy="60" r="47" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 8"/><circle cx="60" cy="60" r="33" stroke="currentColor" strokeOpacity=".5"/><path d="M60 23C78 45 78 75 60 97C42 75 42 45 60 23ZM23 60C45 42 75 42 97 60C75 78 45 78 23 60Z" stroke="currentColor" strokeWidth="2"/><circle cx="60" cy="60" r="8" fill="currentColor"/></svg></div>
      <div className="bsu-motion-intro-type"><span>БГУ · BSU · БМУ</span><small>{labels.intro}</small></div>
    </div>}
    <section className="bsu-portal" aria-labelledby="bsu-hero-heading">
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
            {campusPhotos.map((photo,index)=><div key={photo.url} className={`bsu-portal-image${activeSlide===index?' is-on':''}`} style={{backgroundImage:`url("${photo.url}")`,backgroundPosition:photo.position}} aria-hidden="true"/>)}
            <div className="bsu-portal-overlay" />
            <div className="bsu-portal-frame-tag">01 / {locale === 'ru' ? 'КАМПУС' : locale === 'ky' ? 'КАМПУС' : locale === 'en' ? 'CAMPUS' : '校园'}</div>
          </div>
          <div className="bsu-portal-frame bsu-portal-frame-two" aria-hidden="true">
            {campusPhotos.map((photo,index)=><div key={photo.url} className={`bsu-portal-image${activeSlide===index?' is-on':''}`} style={{backgroundImage:`url("${photo.url}")`,backgroundPosition:photo.position}}/>)}
            <div className="bsu-portal-overlay" />
          </div>
          <div className="bsu-portal-ring" aria-hidden="true"><span>BSU</span><span>✳</span></div>
          <div className="bsu-portal-caption">{locale === 'ru' ? 'Идеи. Люди. Будущее.' : locale === 'ky' ? 'Идеялар. Адамдар. Келечек.' : locale === 'en' ? 'Ideas. People. Future.' : '思想 · 人才 · 未来'}</div>
        </div>
      </div>
      <div className="bsu-portal-navigator">
        <div className="bsu-portal-arrowset">
          <button type="button" aria-label={labels.previous} onClick={()=>setActiveSlide(i=>(i+2)%3)}><ChevronLeft size={20}/></button>
          <button type="button" aria-label={labels.next} onClick={()=>setActiveSlide(i=>(i+1)%3)}><ChevronRight size={20}/></button>
        </div>
        <div className="bsu-portal-dots" role="group" aria-label={locale === 'ru' ? 'Слайды главной страницы' : locale === 'ky' ? 'Башкы беттин слайддары' : locale === 'en' ? 'Homepage slides' : '首页轮播幻灯片'}>
          {signatureSlides[locale].map((_,index)=><button key={index} type="button" aria-label={`${index+1}/3`} aria-current={activeSlide===index?'true':undefined} className={`bsu-portal-dot${activeSlide===index?' is-active':''}`} onClick={()=>setActiveSlide(index)}><span>{activeSlide===index && <i key={`${activeSlide}-${locale}`}/>}</span></button>)}
        </div>
        <span className="bsu-portal-navigator-label">{c.scroll}<ArrowUpRight size={14}/></span>
      </div>
    </section>

    <section id="sections" className="bsu-section bsu-section-light">
      <div className="bsu-container">
        <div data-bsu-reveal className="bsu-section-heading"><p className="bsu-kicker">01 / {c.kicker}</p><h2>{c.exploreTitle}</h2><p>{c.exploreIntro}</p></div>
        <div className="bsu-quick-grid">{paths.map((item,i)=>{
          const Icon=item.icon;
          return <Link key={item.href} href={item.href} className="bsu-quick-card" data-bsu-reveal style={{transitionDelay:`${i*65}ms`}}>
            <div className="bsu-card-top"><span>0{i+1}</span><ArrowUpRight size={20}/></div>
            <div className="bsu-quick-icon"><Icon size={29}/></div>
            <h3>{shortcutLabels[item.key]}</h3><span className="bsu-card-line" />
          </Link>;
        })}</div>
      </div>
    </section>

    <section id="education" className="bsu-section bsu-section-white">
      <div className="bsu-container">
        <div data-bsu-reveal className="bsu-section-heading bsu-heading-between"><div><p className="bsu-kicker">02 / {c.facultyKicker}</p><h2>{c.facultyTitle}</h2><p>{c.facultyIntro}</p></div><Link href="/faculties" className="bsu-text-link">{c.allFaculties}<ArrowUpRight size={18}/></Link></div>
        <div className="bsu-motion-faculty-tools"><button type="button" onClick={()=>scrollFaculties(-1)} aria-label={labels.facultyPrevious}><ChevronLeft size={22}/></button><button type="button" onClick={()=>scrollFaculties(1)} aria-label={labels.facultyNext}><ChevronRight size={22}/></button></div>
        <div ref={facultyRailRef} className="bsu-faculty-grid bsu-motion-faculty-rail">{facultyItems.map((faculty,i)=>{
          const name=translateContent(faculty.name,locale);
          const category=translateContent(faculty.category,locale);
          return <Link key={faculty.slug} href={`/faculties/${faculty.slug}`} className="bsu-faculty-card" data-bsu-reveal style={{transitionDelay:`${i*65}ms`}}>
            <div className={`bsu-faculty-art bsu-faculty-art-${i+1}`}><span className="bsu-faculty-number">0{i+1}</span><span className="bsu-faculty-symbol"><GraduationCap size={36}/></span></div>
            <div className="bsu-faculty-info"><span className="bsu-faculty-type">{category}</span><h3>{name}</h3><span className="bsu-faculty-more">{c.seeDetails}<ArrowUpRight size={17}/></span></div>
          </Link>;
        })}</div>
      </div>
    </section>

    <section className="bsu-section bsu-study-section">
      <div className="bsu-container bsu-study-inner">
        <div data-bsu-reveal className="bsu-study-intro"><p className="bsu-kicker">03 / {c.studyKicker}</p><h2>{c.studyTitle}</h2><p>{c.studyIntro}</p><Link href="/programs" className="bsu-button bsu-button-gold">{c.closingCta}<ArrowUpRight size={18}/></Link></div>
        <div className="bsu-study-cards">{educationPaths.map((item,i)=>{const Icon=item.icon;return <Link key={item.key} href={item.href} className="bsu-study-card" data-bsu-reveal style={{transitionDelay:`${i*70}ms`}}><span><Icon size={22}/>{c[item.key]}</span><ArrowUpRight size={21}/></Link>})}</div>
      </div>
    </section>

    <section id="news" className="bsu-section bsu-section-light">
      <div className="bsu-container">
        <div data-bsu-reveal className="bsu-section-heading bsu-heading-between"><div><p className="bsu-kicker">04 / {c.newsKicker}</p><h2>{c.newsTitle}</h2><p>{c.newsIntro}</p></div><Link href="/news" className="bsu-text-link">{c.allNews}<ArrowUpRight size={18}/></Link></div>
        <div className="bsu-news-grid">{latest.map((item,i)=><Link key={item.slug} href={`/news/${item.slug}`} className="bsu-news-card" data-bsu-reveal style={{transitionDelay:`${i*70}ms`}}><div className={`bsu-news-art bsu-news-art-${i+1}`}><Newspaper size={35}/><span>{newsCategories[item.category]}</span></div><div className="bsu-news-body"><p className="bsu-news-date"><CalendarDays size={15}/>{formatLocalizedNewsDate(item.date,locale)}</p><h3>{item.title}</h3><p>{item.excerpt}</p><span className="bsu-news-arrow"><ArrowUpRight size={19}/></span></div></Link>)}</div>
      </div>
    </section>

    <section id="services" className="bsu-section bsu-section-white">
      <div className="bsu-container"><div data-bsu-reveal className="bsu-section-heading"><p className="bsu-kicker">05 / {c.servicesKicker}</p><h2>{c.servicesTitle}</h2><p>{c.servicesIntro}</p></div><div className="bsu-services-grid">{services.map((item,i)=>{const Icon=item.icon;return <Link key={item.key} href={item.href} className="bsu-service" data-bsu-reveal style={{transitionDelay:`${i*50}ms`}}><Icon size={22}/><span>{c[item.key]}</span><ArrowUpRight size={18}/></Link>})}</div></div>
    </section>

    <section className="bsu-closing"><div className="bsu-container bsu-closing-inner" data-bsu-reveal><div><p className="bsu-kicker">{c.closingTag}</p><h2>{c.closingTitle}</h2><p>{c.closingIntro}</p></div><Link href="/programs" className="bsu-button bsu-button-gold">{c.closingCta}<ArrowUpRight size={19}/></Link></div></section>
    <PartnersCarousel showLink/><p className="bsu-container bsu-editorial-note">{c.sourceNotice}</p>
  </main>;
}
