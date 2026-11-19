"use client";
import PartnersCarousel from "@/components/partners/PartnersCarousel";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ArrowUpRight, CalendarDays, Compass, GraduationCap, Newspaper, Users, ChevronLeft, ChevronRight
} from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { faculties } from "@/lib/faculty-data";
import { translateContent } from "@/lib/content-translations";
import { newsRecords, type NewsRecord } from "@/lib/news-data";
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
    kicker:"Ваш маршрут",exploreTitle:"Начните с главного",exploreIntro:"Всё необходимое для поступления, учёбы и работы в университете — без лишних переходов.",facultyKicker:"Структура университета",facultyTitle:"Факультеты и институты БГУ",facultyIntro:"Выберите своё направление обучения.",allFaculties:"Все факультеты и институты",seeDetails:"Подробнее",
    studyKicker:"Образовательные возможности",studyTitle:"От первого курса до исследований",studyIntro:"Изучайте программы и найдите подходящий уровень образования.",bachelors:"Бакалавриат",masters:"Магистратура",research:"Наука и исследования",
    newsKicker:"Жизнь университета",newsTitle:"События и новости",newsIntro:"Актуальные материалы из предварительного каталога университета.",allNews:"Читать все новости",servicesKicker:"Для студентов",servicesTitle:"Всё нужное — в одном месте",servicesIntro:"Быстрый доступ к разделам сайта и университетской информации.",documents:"Документы",programs:"Программы",library:"Библиотека",science:"Научная деятельность",closingTag:"Следующий шаг",closingTitle:"Твоя история начинается здесь",closingIntro:"Познакомьтесь с образовательными программами и условиями поступления.",closingCta:"Выбрать программу",sourceNotice:"Материалы и переводы предварительные. Перед официальной публикацией необходима проверка БГУ."
  },
  ky: {
    eyebrow:"Мүмкүнчүлүктөр университети · Бишкек",headingOne:"Келечек билимден",headingTwo:"башталат",intro:"К. Карасаев атындагы Бишкек мамлекеттик университетинде билимге, жаңы багыттарга жана эл аралык мүмкүнчүлүктөргө жол ачыңыз.",
    explore:"Университет жөнүндө",apply:"Окууга кабыл алуу",scroll:"Төмөн карай жылдырыңыз",photoLabel:"Идеялар жолуккан мейкиндик",photoCaption:"Дизайн концепциясы. Бул жерге БМУнун расмий сүрөтү жайгаштырылат.",
    kicker:"Сиздин багытыңыз",exploreTitle:"Эң негизгисинен баштаңыз",exploreIntro:"Окууга тапшыруу, билим алуу жана университетте иштөө үчүн керектүү маалымат бир жерде.",facultyKicker:"Университет бүгүн",facultyTitle:"БМУнун факультеттери жана институттары",facultyIntro:"Факультеттер менен институттар билимдин ар кандай багыттарын жана өнүгүү мүмкүнчүлүктөрүн бириктирет.",allFaculties:"Бардык факультеттер жана институттар",seeDetails:"Кененирээк",
    studyKicker:"Билим алуу мүмкүнчүлүктөрү",studyTitle:"Биринчи курстан илимге чейин",studyIntro:"Программаларды карап чыгып, билим берүүнүн ылайыктуу баскычын тандаңыз.",bachelors:"Бакалавриат",masters:"Магистратура",research:"Илим жана изилдөөлөр",
    newsKicker:"Университеттин жашоосу",newsTitle:"Окуялар жана жаңылыктар",newsIntro:"Университеттин алдын ала даярдалган жаңылыктар жыйнагынан материалдар.",allNews:"Бардык жаңылыктар",servicesKicker:"Студенттер үчүн",servicesTitle:"Керектүүнүн баары бир жерде",servicesIntro:"Сайттын бөлүмдөрүнө жана университет тууралуу маалыматка тез жетүү.",documents:"Документтер",programs:"Программалар",library:"Китепкана",science:"Илимий ишмердүүлүк",closingTag:"Кийинки кадам",closingTitle:"Сиздин тарыхыңыз ушул жерден башталат",closingIntro:"Билим берүү программалары жана кабыл алуу шарттары менен таанышыңыз.",closingCta:"Программаны тандоо",sourceNotice:"Материалдар жана котормолор алдын ала даярдалган. Расмий жарыялоодон мурда БМУ текшериши керек."
  },
  en: {
    eyebrow:"A university of opportunity · Bishkek",headingOne:"Your future starts",headingTwo:"with discovery",intro:"Explore knowledge, new disciplines and international opportunities at Bishkek State University named after K. Karasaev.",
    explore:"Discover BSU",apply:"Admissions",scroll:"Scroll to explore",photoLabel:"Where ideas come together",photoCaption:"Design concept. An approved BSU campus photo will appear here.",
    kicker:"Find your way",exploreTitle:"Start with what matters",exploreIntro:"Everything you need for admissions, study and campus life, in one place.",facultyKicker:"The university today",facultyTitle:"BSU Faculties and Institutes",facultyIntro:"Explore faculties and institutes spanning disciplines and opportunities for growth.",allFaculties:"All faculties and institutes",seeDetails:"Explore",
    studyKicker:"Learning opportunities",studyTitle:"From your first year to research",studyIntro:"Explore academic programs and find your next step.",bachelors:"Bachelor's programs",masters:"Master's programs",research:"Research and science",
    newsKicker:"Campus life",newsTitle:"News and events",newsIntro:"Highlights from the university's preliminary news catalogue.",allNews:"View all news",servicesKicker:"Student resources",servicesTitle:"Everything in one place",servicesIntro:"Find essential university information and services quickly.",documents:"Documents",programs:"Programs",library:"Library",science:"Research",closingTag:"Take the next step",closingTitle:"Your story starts here",closingIntro:"Explore academic programs and admissions information.",closingCta:"Find a program",sourceNotice:"Content and translations are preliminary and require BSU review before official publication."
  },
  "zh-CN": {
    eyebrow:"机遇之校 · 比什凯克",headingOne:"未来始于",headingTwo:"探索与学习",intro:"在以卡拉萨耶夫院士命名的比什凯克国立大学，探索知识、专业方向和国际发展机遇。",
    explore:"了解大学",apply:"招生信息",scroll:"向下探索",photoLabel:"思想交汇的地方",photoCaption:"设计概念展示。此处将使用大学提供的官方校园照片。",
    kicker:"开启旅程",exploreTitle:"从重要的事开始",exploreIntro:"招生、学习和校园生活所需信息，轻松获取。",facultyKicker:"今日大学",facultyTitle:"大学学院与研究所",facultyIntro:"探索涵盖不同学科与发展机会的学院和研究所。",allFaculties:"查看所有学院",seeDetails:"了解更多",
    studyKicker:"学习机会",studyTitle:"从本科到科学研究",studyIntro:"浏览专业项目，寻找适合自己的学习阶段。",bachelors:"本科项目",masters:"硕士项目",research:"科研与科学",
    newsKicker:"校园生活",newsTitle:"新闻与活动",newsIntro:"大学新闻目录中的精选内容。",allNews:"查看全部新闻",servicesKicker:"学生服务",servicesTitle:"所需信息，一站获取",servicesIntro:"快速访问大学的重要信息与服务。",documents:"文件资料",programs:"专业目录",library:"图书馆",science:"科研活动",closingTag:"下一步",closingTitle:"你的故事从这里开始",closingIntro:"了解专业项目与招生信息。",closingCta:"选择专业",sourceNotice:"内容与译文均为初稿，正式发布前须经大学审核。"
  }
};

const paths = [
  { href: "/admissions", icon: GraduationCap, key: "admissions" },
  { href: "/programs", icon: Compass, key: "programs" },
  { href: "/staff", icon: Users, key: "staff" },
  { href: "/news", icon: Newspaper, key: "news" },
  { href: "/schedule", icon: CalendarDays, key: "schedule" },
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

// BSU faculty order v2
const facultyOrder = ["kyrgyz-philology","kyrgyz-chinese","russian-philology","journalism-information-systems","oriental-studies-international-relations","european-civilizations","pedagogical-education","social-psychological","ecology-management","economics-finance-business"];
const featuredFaculties = [
  ...facultyOrder.map(slug => faculties.find(f => f.slug === slug)!).map(f => ({slug:f.slug, name:f.name, category:f.category, href:`/faculties/${f.slug}`, labels:undefined as Record<Locale,string>|undefined})),
  {slug:"college",name:"Колледж БГУ",category:"Колледж",href:"/college",labels:{ru:"Колледж БГУ",ky:"БМУнун колледжи",en:"BSU College","zh-CN":"大学附属学院"}},
  {slug:"international-education-center",name:"Международный образовательный институт",category:"Институт",href:"/international/education-center",labels:{ru:"Международный образовательный институт",ky:"Эл аралык билим берүү институту",en:"International Education Institute","zh-CN":"国际教育学院"}}
];
const sortedNews = [...newsRecords].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3);

/** latestNews comes from the server (API or local fallback); local data is used if it is not passed. */
export default function ModernHome({ latestNews = sortedNews }: { latestNews?: NewsRecord[] }) {
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
    const el = facultyRailRef.current;
    if (!el) return;
    const cards = Array.from(el.children) as HTMLElement[];
    const current = el.scrollLeft;
    const max = el.scrollWidth - el.clientWidth;
    if(max <= 1 || !cards.length) return;
    const offsets = cards.map(card => card.offsetLeft - cards[0].offsetLeft);
    const target = direction > 0 ? (offsets.find(x => x > current + 5) ?? max) : ([...offsets].reverse().find(x => x < current - 5) ?? 0);
    el.scrollTo({left:Math.max(0,Math.min(max,target)),behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
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
  const latest = latestNews.slice(0, 3).map(n => localizeNews(n, locale));
  const newsCategories = newsUi[locale].categories;
  const shortcutLabels = { admissions:t("forApplicants"), programs:t("programCatalog"),staff:t("staff"),news:t("newsShort"), schedule:t("schedule") };

  return <main>
    {showIntro && (
      <div className="bsu-motion-intro" aria-hidden="true">
        <div className="bsu-emblem-intro">
          <span className="bsu-emblem-ring ring-one" />
          <span className="bsu-emblem-ring ring-two" />
          <Image
            src="/brand/bsu-emblem.svg"
            alt=""
            width={100}
            height={100}
            priority
            unoptimized
          />
        </div>
      </div>
    )}
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
            <div className="bsu-card-top"><span>{String(i+1).padStart(2,"0")}</span><ArrowUpRight size={20}/></div>
            <div className="bsu-quick-icon"><Icon size={29}/></div>
            <h3>{shortcutLabels[item.key]}</h3><span className="bsu-card-line" />
          </Link>;
        })}</div>
      </div>
    </section>

    <section id="rector-greeting" className="bsu-rector-block bsu-container" aria-labelledby="bsu-rector-title">
      <div className="bsu-rector-photo"><Image src="/images/rector-bsu.jpg" alt={({ru:"Дылдаев Мирлан Муктарович",ky:"Дылдаев Мирлан Муктарович",en:"Mirlan Muktarovich Dyldaev","zh-CN":"米尔兰·迪尔达耶夫"})[locale]} width={853} height={1024} sizes="(max-width: 640px) 210px, 300px" /></div>
      <div className="bsu-rector-copy"><p className="bsu-kicker">BSU / UNIVERSITY</p><h2 id="bsu-rector-title">{({ru:"Приветствие ректора",ky:"Ректордун кайрылуусу",en:"Rector’s greeting","zh-CN":"校长致辞"})[locale]}</h2>
      <p className="bsu-rector-message">{({ru:"Приветствую Вас на официальном сайте Бишкекского государственного университета имени академика Кусеина Карасаева. Я искренне рад, что вы проявляете интерес к нашему университету.",ky:"Академик Кусеин Карасаев атындагы Бишкек мамлекеттик университетинин расмий сайтына кош келиңиздер. Биздин университетке кызыгуу көрсөтүп жатканыңызга чын жүрөктөн кубанычтамын!",en:"Welcome to the official website of Bishkek State University named after Academician Kusein Karasaev. I am sincerely glad that you are interested in our university.","zh-CN":"欢迎来到比什凯克国立库塞因·卡拉萨耶夫院士大学官方网站。我真的很高兴您对我们大学感兴趣。"})[locale]}</p>
      <div className="bsu-rector-sign"><strong>{({ru:"Дылдаев Мирлан Муктарович",ky:"Дылдаев Мирлан Муктарович",en:"Mirlan Muktarovich Dyldaev","zh-CN":"米尔兰·迪尔达耶夫"})[locale]}</strong><span>{({ru:"Ректор БГУ",ky:"БМУнун ректору",en:"Rector of BSU","zh-CN":"比什凯克国立大学校长"})[locale]}</span></div></div>
    </section>

    <section id="avn-portal" className="bsu-container py-8 sm:py-12" aria-label="AVN">
      <div className="relative isolate overflow-hidden rounded-[26px] border border-[#d2e2f1] bg-gradient-to-br from-[#f7fbff] via-[#e8f3ff] to-[#c6e1fb] text-[#204774] shadow-[0_16px_42px_#24517f14]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-35" style={{backgroundImage:"radial-gradient(#7fa7d1 1px, transparent 1px)",backgroundSize:"22px 22px",maskImage:"linear-gradient(90deg,transparent 35%,black)"}} />
        <div className="relative grid items-center gap-5 px-6 py-7 sm:px-10 sm:py-10 lg:grid-cols-[1.35fr_1fr] lg:gap-8">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#bad3eb] bg-white/80 px-3 py-1.5 text-[11px] font-extrabold tracking-[.12em] text-[#24517f]">
              <span className="size-2 rounded-full bg-[#2c85c8]" aria-hidden="true"/> BSU / DIGITAL
            </div>
            <h2 className="mt-4 max-w-2xl text-[clamp(26px,3.2vw,46px)] font-extrabold leading-[1.12] tracking-tight">{({ru:"Образовательный портал АВН",ky:"AVN билим берүү порталы",en:"AVN education portal","zh-CN":"AVN 教育门户"})[locale]}</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-[#405c79] sm:text-base">{({ru:"Расписание занятий и электронные образовательные сервисы БГУ — в одном месте.",ky:"БМУнун сабактар жадыбалы жана электрондук билим берүү кызматтары — бир жерде.",en:"Class schedules and BSU online education services in one place.","zh-CN":"在同一平台查看课程表及比什凯克国立大学在线教育服务。"})[locale]}</p>
            <a href="https://avn.bhu.kg/" target="_blank" rel="noopener noreferrer" className="group mt-6 inline-flex min-h-12 max-w-full items-center justify-between gap-5 rounded-xl bg-[#2464a5] px-6 py-3.5 text-sm font-extrabold !text-white shadow-[0_8px_20px_#2464a52e] transition-colors hover:bg-[#1c4e85] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#204774] sm:text-base">
              <span>{({ru:"Войти в АВН",ky:"AVN порталына кирүү",en:"Open AVN","zh-CN":"进入 AVN"})[locale]}</span><ArrowUpRight size={21} className="shrink-0 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
          <div aria-hidden="true" className="pointer-events-none relative hidden min-h-[225px] items-center justify-center sm:flex">
            <div className="absolute h-52 w-52 rounded-full border border-[#86b4df]/60 ring-[22px] ring-white/30" />
            <div className="absolute right-[8%] top-[8%] size-3 rounded-full bg-[#c3964f]" />
            <div className="relative w-[min(100%,310px)] rotate-[-5deg] rounded-[22px] border border-white/90 bg-white/90 p-5 shadow-[0_20px_45px_#255c9626]">
              <div className="flex items-center justify-between"><span className="flex gap-1.5"><i className="size-2 rounded-full bg-[#a7c8e8]"/><i className="size-2 rounded-full bg-[#bdd5ec]"/><i className="size-2 rounded-full bg-[#dfbd7e]"/></span><span className="text-[10px] font-bold tracking-widest text-[#526e88]">BSU</span></div>
              <div className="mt-4 flex items-center gap-3"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#2464a5] text-white"><GraduationCap size={27}/></span><span className="text-4xl font-black tracking-tight text-[#204774]">AVN</span></div>
              <div className="mt-5 grid grid-cols-3 gap-2">{[0,1,2].map(i=><span key={i} className="h-9 rounded-lg bg-[#e5f0fb]"/>)}</div>
              <div className="mt-3 h-2 w-2/3 rounded-full bg-[#d1e4f5]"/>
            </div>
            <span className="absolute bottom-[5%] right-[3%] grid size-12 place-items-center rounded-2xl border border-white bg-[#f1d49c] text-[#204774] shadow-lg"><ArrowUpRight size={23}/></span>
          </div>
        </div>
      </div>
    </section>

    <section id="education" className="bsu-section bsu-section-white">
      <div className="bsu-container">
        <div data-bsu-reveal className="bsu-section-heading bsu-heading-between"><div><p className="bsu-kicker">02 / {c.facultyKicker}</p><h2>{c.facultyTitle}</h2><p>{c.facultyIntro}</p></div><Link href="/faculties" className="bsu-text-link">{c.allFaculties}<ArrowUpRight size={18}/></Link></div>
        <div className="bsu-motion-faculty-tools"><button type="button" onClick={()=>scrollFaculties(-1)} aria-label={labels.facultyPrevious}><ChevronLeft size={22}/></button><button type="button" onClick={()=>scrollFaculties(1)} aria-label={labels.facultyNext}><ChevronRight size={22}/></button></div>
        <div ref={facultyRailRef} className="bsu-faculty-grid bsu-motion-faculty-rail">{facultyItems.map((faculty,i)=>{
          const name=faculty.labels?.[locale] ?? translateContent(faculty.name,locale);
          const category=faculty.slug === "college" ? ({ru:"Колледж",ky:"Колледж",en:"College","zh-CN":"学院"}[locale]) : faculty.slug === "international-education-center" ? ({ru:"Институт",ky:"Институт",en:"Institute","zh-CN":"学院"}[locale]) : translateContent(faculty.category,locale);
          return <Link key={faculty.slug} href={faculty.href} className="bsu-faculty-card">
            <div className={`bsu-faculty-art bsu-faculty-art-${i+1}`}><span className="bsu-faculty-number">0{i+1}</span><span className="bsu-faculty-symbol"><GraduationCap size={36}/></span></div>
            <div className="bsu-faculty-info"><span className="bsu-faculty-type">{category}</span><h3>{name}</h3><span className="bsu-faculty-more">{c.seeDetails}<ArrowUpRight size={17}/></span></div>
          </Link>;
        })}</div>
      </div>
    </section>

    

    <section id="news" className="bsu-section bsu-section-light">
      <div className="bsu-container">
        <div data-bsu-reveal className="bsu-section-heading bsu-heading-between"><div><p className="bsu-kicker">04 / {c.newsKicker}</p><h2>{c.newsTitle}</h2><p>{c.newsIntro}</p></div><Link href="/news" className="bsu-text-link">{c.allNews}<ArrowUpRight size={18}/></Link></div>
        <div className="bsu-news-grid">{latest.map((item,i)=><Link key={item.slug} href={`/news/${item.slug}`} className="bsu-news-card" data-bsu-reveal style={{transitionDelay:`${i*70}ms`}}><div className={`bsu-news-art bsu-news-art-${i+1}`}><Newspaper size={35}/><span>{newsCategories[item.category]}</span></div><div className="bsu-news-body"><p className="bsu-news-date"><CalendarDays size={15}/>{formatLocalizedNewsDate(item.date,locale)}</p><h3>{item.title}</h3><p>{item.excerpt}</p><span className="bsu-news-arrow"><ArrowUpRight size={19}/></span></div></Link>)}</div>
      </div>
    </section>

    

    
    <PartnersCarousel showLink/><p className="bsu-container bsu-editorial-note">{c.sourceNotice}</p>
  </main>;
}



