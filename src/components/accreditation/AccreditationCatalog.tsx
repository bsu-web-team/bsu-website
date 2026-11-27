"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Award, FileText, GraduationCap, Search, ShieldCheck } from "lucide-react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n";

type Category = "normative" | "certificate" | "college" | "archive";
type Item = { title: string; url: string; category: Category };

const documentIds = [
  "1Ph1UGA-jq4UDzKnFau4OKN5roZnD2c3x", "1bThJp6YzB4mD-Lk8Qe2Y5t3r8ziHBOuE",
  "1MDbhm_Ejym3L4F2w1XaNNrV_q5oqOTFE", "1A3bElD92cvkrfRIYw87Yd9KN4h6o0M4J",
  "1DuDWOZmXI4SBguk3crhPHSUGFThQHES3", "11q_j81AzsZbUgilPQa-AOcf9Xf1WyySr",
  "1KtBw9tjcsF9RpArL_vtXWJJ45MWIQE50", "1_d2SlXngPX3N7dgrtq4mCRukDduh60l8",
  "1xvtQF_NTKAzi1tmezHgU9_jbLiLO2xdp", "10xFRoJopAF-uQexwzEcA5laQx7gN0iPj",
  "1hb6xqloketR8nYbqWc_3t6CYEVJKMcUT", "12TSHxg2qvvzPSg3uNzkpRKdIx6_1ZLKr",
  "1vEhbjWXW8uLiFOd0qkHiwIHRf7-CQDM7", "17decg508rwMW65bf8L3D7FB-0hQvBwDH",
  "1Kb4VN6_MkfsgWkZrSW88rU-d_-ymydrq"
];
const titles = [
  "Система менеджмента качества",
  "Программа стратегического развития БГУ на 2023–2028 годы",
  "Политика обеспечения качества образования",
  "Руководство по качеству",
  "Положение о самооценке",
  "Перечень процессов",
  "Положение о мониторинге и оценке удовлетворенности заинтересованных сторон",
  "Положение о внутреннем аудите",
  "Управление документацией и записями",
  "Управление несоответствиями",
  "Управление рисками",
  "Положение о Совете по качеству",
  "Ответственность руководства",
  "Утверждение миссии развития БГУ на 2024–2028 годы",
  "Сборник локальных нормативно-правовых документов"
];
const documents: Item[] = [
  ...titles.map((title, index) => ({
    title, url: `https://drive.google.com/file/d/${documentIds[index]}/view`, category: "normative" as const
  })),
  {
    title: "Сертификат аккредитации (PDF)",
    url: "https://drive.google.com/file/d/1BJhbHcZYAmwEeTDAghDROPYHTYfprHAK/view",
    category: "certificate"
  },
  ...Array.from({ length: 6 }, (_, index) => ({
    title: `Сертификат аккредитации — изображение ${index + 1}`,
    url: `https://bsu.kg/wp-content/uploads/2026/10/${index + 1}.jpg-1-1024x724.jpeg`,
    category: "certificate" as const
  })),
  { title: "Сертификат аккредитации колледжа № VK240000956",
    url: "https://drive.google.com/file/d/157h9soOIUjYDJbzH_wRcs0gC4vJafMoh/view", category: "college" },
  { title: "Лицензия колледжа",
    url: "https://drive.google.com/file/d/1RbYqKrEFnazPwsWQVhU5KDBJwKg8-m2_/view", category: "college" },
  // bsu-accreditation-extra-26-v1
  {title: "Приказ №55 Состав рабочей группы", url: "https://drive.google.com/file/d/1FmlbWIQY3dtWi2o7-Mf3-AyeSC8sQzXn/view", category: "archive"},
  {title: "Акты проверки противопожарного состояния", url: "https://drive.google.com/file/d/164IVAKCl4emvWQD09FsIKJAhgklhDvKr/view", category: "archive"},
  {title: "Сведения об использовании площадей.pdf", url: "https://drive.google.com/file/d/1v-uRt09aXKbgIonueU2sq_nHwqBeiPFv/view", category: "archive"},
  {title: "Приказ МОН о видеонаблюдении", url: "https://drive.google.com/file/d/1EzOBg43SpHCNSxBIYyc-czdwskFPLo92/view", category: "archive"},
  {title: "Инструкции по технической и пожарной безопасности", url: "https://drive.google.com/file/d/1yC8Dh0asYC-cud0HI3DswJgKQ11sLhCX/view", category: "archive"},
  {title: "Договор по оказанию медицинской помощи", url: "https://drive.google.com/file/d/1HnUeFwSAnhFTka6rjiQ8xxzkMerapYDl/view", category: "archive"},
  {title: "Договор с Кыргызской ассоциацей дистанционного образования (КАДО)", url: "https://drive.google.com/file/d/15tDsQ4trnHcvUdEFJM5ZP-2kQbYyE7Vy/view", category: "archive"},
  {title: "Договор AVN", url: "https://drive.google.com/file/d/1uvVouZCQhZNM4kmbtWH43MF18pf9fzMG/view", category: "archive"},
  {title: "График работы поликлиники БГУ", url: "https://drive.google.com/file/d/16q-Nxg20zFsdWknx8qqWLQAb_n12VEyv/view", category: "archive"},
  {title: "Акт санэпидмед Спортивный зал", url: "https://drive.google.com/file/d/1xCwRiYp1ht0HWHgE4KCFP86tqwDNnY_B/view", category: "archive"},
  {title: "Акт санэпидмед Корпус №3", url: "https://drive.google.com/file/d/16ZrA8u9MDjteoGkbLS-DT6i36p-dalJz/view", category: "archive"},
  {title: "Акт саниэпидмед Главный корпус", url: "https://drive.google.com/file/d/1ncN_3J_-VZgE5iXhzUWzABnG9Vj2xkxP/view", category: "archive"},
  {title: "530200.Политология - Отчет по самооценке.pdf", url: "https://drive.google.com/file/d/1B3eVvAGjavQrzrEZotmcI5RCTcnDntZw/view", category: "archive"},
  {title: "530003 Перевод и переводоведение - Отчет по самооценке.pdf", url: "https://drive.google.com/file/d/1ZLii9e0oqmHUHAqGGvc-z9v0i3VxUdmq/view", category: "archive"},
  {title: "530100 Философия - Отчет по самооценке.pdf", url: "https://drive.google.com/file/d/1tXpxMjV-GbfvHTy1XsaXrjC9Uu90Gh4Q/view", category: "archive"},
  {title: "530300 - Психология.pdf", url: "https://drive.google.com/file/d/15FFER4phN9DJhKrin-bFxHA9ymrCOrwa/view", category: "archive"},
  {title: "530800 Международные отношения - Отчет по самооценке.pdf", url: "https://drive.google.com/file/d/1eavBpndwumL1REv3UhYRjHwoSbUsBr3e/view", category: "archive"},
  {title: "541000 Социология - Отчет по самооценке.pdf", url: "https://drive.google.com/file/d/197_Wq2wHZPuOrrBIgj026x0PBgm-5Srd/view", category: "archive"},
  {title: "550001 Государственный язык в учреждениях образования с некыргызским языком обучения - Отчет по самооценке.pdf", url: "https://drive.google.com/file/d/1aQEw8V9PbWHKDOCwQ11MoqcNUv5Tt6gG/view", category: "archive"},
  {title: "580700 Управление бизнесом - Отчет по самооценке.pdf", url: "https://drive.google.com/file/d/15MxVWC01jiS55BOZotuaWHW9Xqhgty8u/view", category: "archive"},
  {title: "Китаеведение_Регионоведение - Отчет по самооценке.pdf", url: "https://drive.google.com/file/d/1R4dfdr0TfWD4DCI4NZfGm4DGx5y8-PgV/view", category: "archive"},
  {title: "Акт санэпидмед Корпус №2", url: "https://drive.google.com/file/d/1H6_6Uco-_eZ82rcnk-KbxTiO2fOimpxC/view", category: "archive"},
  {title: "Нормы времени на 2018-2019 уч.г.", url: "https://drive.google.com/file/d/1B3KfmW_SjKSAnjpMMAfK0pGZkWM3sYar/view", category: "archive"},
  {title: "Приказ о прохождении независимой аккредитации.pdf", url: "https://drive.google.com/file/d/1_Pg6QtIbZ9bUr_Di1L5ms33I6aUuSkuf/view", category: "archive"},
  {title: "План подготовки к независимой аккредитации", url: "https://drive.google.com/file/d/1ED7B2vrWFNFSWMsZnasDZGDEGY-Cxk_-/view", category: "archive"},
  {title: "Минимальные требования предъявляемые к аккредитуемым образовательным организациям начального, среднего и высшего профессионального образования Кыргызской Республики", url: "https://drive.google.com/file/d/1WyCMJ1os4K1cBmYiP5qZ6Lo5gO9sodil/view", category: "archive"},
];

type UI = {
  eyebrow: string; heading: string; intro: string; search: string; all: string;
  normative: string; certificates: string; college: string; open: string;
  count: string; empty: string; back: string; original: string; source: string;
  notice: string;
};
const ui: Record<Locale, UI> = {
  ru: { eyebrow: "БГУ / Официальные документы", heading: "Аккредитация",
    intro: "Сертификаты, нормативные документы системы менеджмента качества и документы колледжа в одном каталоге.",
    search: "Найти документ по названию", all: "Все", normative: "Нормативные документы",
    certificates: "Сертификаты", college: "Колледж", open: "Открыть документ", count: "Найдено",
    empty: "Документы не найдены", back: "Все документы", original: "Исходные разделы",
    source: "Нормативные документы на старом сайте", notice: "Официальные названия сохранены на русском языке. Ссылки ведут к исходным файлам; доступность и сроки действия требуют проверки." },
  ky: { eyebrow: "БМУ / Расмий документтер", heading: "Аккредитация",
    intro: "Сертификаттар, сапат менеджменти системасынын документтери жана колледждин документтери бир каталогдо.",
    search: "Документтин аталышы боюнча издөө", all: "Баары", normative: "Ченемдик документтер",
    certificates: "Сертификаттар", college: "Колледж", open: "Документти ачуу", count: "Табылды",
    empty: "Документтер табылган жок", back: "Бардык документтер", original: "Баштапкы бөлүмдөр",
    source: "Эски сайттагы ченемдик документтер", notice: "Расмий аталыштар орус тилинде сакталган. Шилтемелер баштапкы файлдарга алып барат; жеткиликтүүлүгү жана колдонуу мөөнөтү текшерилиши керек." },
  en: { eyebrow: "BSU / Official documents", heading: "Accreditation",
    intro: "Accreditation certificates, quality management documents and college records in one catalogue.",
    search: "Search documents by title", all: "All", normative: "Regulations",
    certificates: "Certificates", college: "College", open: "Open document", count: "Results",
    empty: "No documents found", back: "All documents", original: "Original sections",
    source: "Regulations on the previous website", notice: "Official document titles are retained in Russian. Links open original sources; access and validity dates still need verification." },
  "zh-CN": { eyebrow: "BSU / 官方文件", heading: "认证与评估",
    intro: "统一浏览认证证书、质量管理规范文件和学院相关文件。",
    search: "按标题搜索文件", all: "全部", normative: "规范文件",
    certificates: "证书", college: "学院", open: "打开文件", count: "结果",
    empty: "未找到文件", back: "全部文件", original: "原始页面",
    source: "旧网站的规范文件", notice: "官方文件名称保留俄文。链接指向原始资料；访问权限及有效期仍需核实。" }
};

export default function AccreditationCatalog() {
  const { locale } = useLocale();
  const t = ui[locale];
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState<"all" | Category>("all");
  const archiveTitle = ({ru:"Материалы аккредитации",ky:"Аккредитация материалдары",en:"Accreditation records","zh-CN":"认证资料"})[locale];
  const categories = [
    { id: "all" as const, text: t.all, count: documents.length },
    { id: "normative" as const, text: t.normative, count: 15 },
    { id: "certificate" as const, text: t.certificates, count: 7 },
    { id: "college" as const, text: t.college, count: 2 },
    { id: "archive" as const, text: archiveTitle, count: 26 }
  ];
  const results = useMemo(() => documents.filter(d =>
    (category === "all" || d.category === category) &&
    d.title.toLocaleLowerCase().includes(term.trim().toLocaleLowerCase())
  ), [category, term]);
  const labels: Record<Category, string> = {
    normative: t.normative, certificate: t.certificates, college: t.college, archive: archiveTitle
  };
  const icons = { normative: FileText, certificate: Award, college: GraduationCap, archive: FileText };
  return (
    <main className="bg-[#f6f8fc] min-h-screen text-slate-900">
      <section className="bg-gradient-to-br from-[#102b4e] via-[#1b4776] to-[#2767a0] text-white">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <Link href="/documents" className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white">
            <ArrowLeft size={16}/>{t.back}
          </Link>
          <div className="mt-9 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck size={15}/>{t.eyebrow}
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{t.heading}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-100">{t.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-blue-100">
            <span className="rounded-full border border-white/20 px-4 py-2">15 · {t.normative}</span>
            <span className="rounded-full border border-white/20 px-4 py-2">7 · {t.certificates}</span>
            <span className="rounded-full border border-white/20 px-4 py-2">2 · {t.college}</span>
            <span className="rounded-full border border-white/20 px-4 py-2">26 · {archiveTitle}</span>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-14">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 focus-within:border-blue-500">
            <Search size={20} className="shrink-0 text-slate-500"/>
            <input type="search" value={term} onChange={e=>setTerm(e.target.value)}
              placeholder={t.search} aria-label={t.search}
              className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-slate-500"/>
          </label>
          <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={t.heading}>
            {categories.map(c=><button key={c.id} type="button" onClick={()=>setCategory(c.id)}
              aria-pressed={category===c.id}
              className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${category===c.id ? "bg-[#1b4776] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>
              {c.text} <span className="ml-1 opacity-75">{c.count}</span>
            </button>)}
          </div>
        </div>
        <p className="my-6 text-sm text-slate-500">{t.count}: {results.length}</p>
        {results.length===0 ? <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">{t.empty}</div> :
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map(d=>{
            const Icon=icons[d.category];
            return <article key={d.url} className="group flex min-h-56 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#1b4776]"><Icon size={24}/></div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">{labels[d.category]}</span>
              </div>
              <h2 className="mt-5 flex-1 text-base font-semibold leading-6 text-slate-900">{d.title}</h2>
              <a href={d.url} target="_blank" rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#1b4776] hover:text-blue-600">
                {t.open}<ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
              </a>
            </article>;
          })}
        </div>}
        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-800">{t.original}</p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm font-medium text-blue-700">
            <a href="https://bsu.kg/normativnye-dokumenty-akkreditacii/" target="_blank" rel="noopener noreferrer" className="hover:underline">{t.source} ↗</a>
            <a href="https://bsu.kg/sertifikaty/" target="_blank" rel="noopener noreferrer" className="hover:underline">{t.certificates} ↗</a>
          </div>
          {/* bsu-accreditation-final-sources-v2: links to further original sections; not counted as document files */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <a href="https://lookerstudio.google.com/embed/reporting/1qvsNYpsWg3gfP2SJPr11l_kEWr5HNtlM/page/No5Y" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-[#1b4776] hover:border-blue-300 hover:bg-blue-50">
              {({ru:"Договоры аккредитации",ky:"Аккредитация келишимдери",en:"Accreditation agreements","zh-CN":"认证协议"})[locale]} <ArrowUpRight size={15} className="inline-block"/>
              <span className="mt-1 block text-xs font-normal text-slate-500">Looker Studio · {({ru:"внешний каталог",ky:"тышкы каталог",en:"external catalogue","zh-CN":"外部目录"})[locale]}</span>
            </a>
            <a href="https://bhu.kg/ru/prikazy-akkreditacii/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-[#1b4776] hover:border-blue-300 hover:bg-blue-50">
              {({ru:"Приказы по аккредитации",ky:"Аккредитация боюнча буйруктар",en:"Accreditation orders","zh-CN":"认证相关命令"})[locale]} <ArrowUpRight size={15} className="inline-block"/>
              <span className="mt-1 block text-xs font-normal text-slate-500">{({ru:"исходная страница",ky:"баштапкы баракча",en:"original page","zh-CN":"原始页面"})[locale]}</span>
            </a>
            <a href="https://bhu.kg/ru/sistema-menedzhmenta-kachestva/" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-[#1b4776] hover:border-blue-300 hover:bg-blue-50 sm:col-span-2">
              {({ru:"Система менеджмента качества — исходный раздел",ky:"Сапат менеджменти системасы — баштапкы бөлүм",en:"Quality management system — original section","zh-CN":"质量管理体系 — 原始栏目"})[locale]} <ArrowUpRight size={15} className="inline-block"/>
            </a>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">{t.notice}</p>
        </div>
      </section>
    </main>
  );
}
