import type { Locale } from "@/lib/i18n";
import type { DocumentRecord } from "@/lib/document-data";

type Translatable = { title: string; description: string };
type Translations = Record<Exclude<Locale,"ru">, Translatable>;

export const documentsUi: Record<Locale, {
  home: string; documents: string; eyebrow: string; heading: string; intro: string; disclaimer: string;
  search: string; placeholder: string; category: string; all: string; found: string; of: string;
  more: string; empty: string; description: string; source: string; allDocs: string;
  sourceNote: string; sourceLink: string; sourceCaution: string; pageFormat: string; sourceStatus: string;
}> = {
 ru: {home:"Главная",documents:"Документы",eyebrow:"Информация и нормативная база",heading:"Документы университета",intro:"Найдите нужные положения, правила и информационные материалы. Пока документы открываются на прежнем официальном сайте БГУ.",disclaimer:"Предварительный каталог открытых источников, а не полный реестр действующих нормативных актов. Уточняйте редакции и актуальность у подразделений БГУ.",search:"Поиск документов",placeholder:"Например, академическая мобильность",category:"Категория",all:"Все категории",found:"Найдено",of:"из",more:"Подробнее",empty:"Ничего не найдено. Измените запрос или категорию.",description:"Описание",source:"Источник",allDocs:"Все документы",sourceNote:"В данном разделе приведена ссылка на официальный источник. Текст документа, номер, дата утверждения и PDF-файл не копировались без подтверждения.",sourceLink:"Открыть на сайте БГУ",sourceCaution:"Внешняя страница может содержать обновлённые материалы. Перед использованием проверяйте актуальность.",pageFormat:"Страница сайта",sourceStatus:"Ссылка на источник"},
 ky: {home:"Башкы бет",documents:"Документтер",eyebrow:"Маалымат жана ченемдик база",heading:"Университеттин документтери",intro:"Керектүү жоболорду, эрежелерди жана маалыматтык материалдарды табыңыз. Азырынча документтер БМУнун мурдагы расмий сайтында ачылат.",disclaimer:"Бул ачык булактардын алдын ала каталогу, колдонуудагы ченемдик актылардын толук реестри эмес. Документтердин редакциясын жана актуалдуулугун БМУнун тиешелүү бөлүмдөрүнөн тактаңыз.",search:"Документтерди издөө",placeholder:"Мисалы, академиялык мобилдүүлүк",category:"Категория",all:"Бардык категориялар",found:"Табылды",of:"жалпы",more:"Кененирээк",empty:"Эч нерсе табылган жок. Издөө сөзүн же категорияны өзгөртүңүз.",description:"Сүрөттөмө",source:"Булак",allDocs:"Бардык документтер",sourceNote:"Бул бөлүмдө расмий булакка шилтеме берилет. Документтин тексти, номери, бекитилген күнү жана PDF файлы ырастоосуз көчүрүлгөн эмес.",sourceLink:"БМУнун сайтынан ачуу",sourceCaution:"Тышкы баракчада жаңыртылган материалдар болушу мүмкүн. Колдонуудан мурун актуалдуулугун текшериңиз.",pageFormat:"Сайттын баракчасы",sourceStatus:"Булакка шилтеме"},
 en: {home:"Home",documents:"Documents",eyebrow:"Information and regulatory resources",heading:"University documents",intro:"Find university regulations, rules and reference materials. For now, documents open on BSU's previous official website.",disclaimer:"This is a preliminary directory of public sources, not a complete register of current regulations. Check versions and validity with the relevant BSU department.",search:"Search documents",placeholder:"For example, academic mobility",category:"Category",all:"All categories",found:"Found",of:"of",more:"Details",empty:"No results found. Try a different query or category.",description:"Description",source:"Source",allDocs:"All documents",sourceNote:"This page links to the official source. The document text, reference number, approval date and PDF have not been copied without verification.",sourceLink:"Open on BSU website",sourceCaution:"The external page may contain updated materials. Check validity before use.",pageFormat:"Website page",sourceStatus:"Source link"},
 "zh-CN": {home:"首页",documents:"文件资料",eyebrow:"信息与规章制度",heading:"大学文件资料",intro:"查找大学规章、规定和参考资料。目前相关文件仍在比什凯克国立大学原官方网站上打开。",disclaimer:"本目录是公开来源的初步汇总，并非现行规范性文件的完整清单。请向大学相关部门核实文件版本及有效性。",search:"搜索文件",placeholder:"例如：学术交流",category:"类别",all:"所有类别",found:"找到",of:"共",more:"查看详情",empty:"未找到结果，请修改关键词或类别。",description:"说明",source:"来源",allDocs:"全部文件",sourceNote:"本页面仅提供官方来源链接。未经核实，未复制文件正文、编号、批准日期或 PDF。",sourceLink:"在大学网站打开",sourceCaution:"外部页面可能包含更新资料，使用前请核实有效性。",pageFormat:"网站页面",sourceStatus:"来源链接"}
};

const categories: Record<string, Record<Exclude<Locale,"ru">,string>> = {
 "Нормативные документы": {ky:"Ченемдик документтер",en:"Regulatory documents","zh-CN":"规章制度"},
 "Наука": {ky:"Илим",en:"Research","zh-CN":"科研"},
 "Абитуриентам": {ky:"Абитуриенттерге",en:"Admissions","zh-CN":"招生"},
 "Учебный процесс": {ky:"Окуу процесси",en:"Academic process","zh-CN":"教学管理"}
};

const translations: Record<string,Translations> = {
 "international-regulations": {
  ky:{title:"Эл аралык кызматташуу боюнча ченемдик документтер",description:"Эл аралык программалар, академиялык мобилдүүлүк, чет өлкөлүк студенттер жана эл аралык долбоорлор жөнүндө жоболор камтылган бөлүм."},
  en:{title:"Regulations on international cooperation",description:"A section covering international programs, academic mobility, international students and international projects."},
  "zh-CN":{title:"国际合作规章文件",description:"有关国际项目、学术交流、国际学生及国际合作项目的规定汇总。"}},
 "science-regulations": {
  ky:{title:"Илимий ишмердик боюнча жоболор",description:"Университеттин илимий багытына тиешелүү жоболордун расмий баракчасы. Тизмени жана файлдарды баштапкы сайттан текшерүү керек."},
  en:{title:"Regulations on research activities",description:"Official university page for research regulations. Verify the list and files on the source site."},
  "zh-CN":{title:"科研活动规定",description:"大学科研管理规定的官方页面。具体清单及文件请在原网站核实。"}},
 "admission-documents": {
  ky:{title:"Окууга тапшыруу үчүн керектүү документтер",description:"Кыргыз Республикасынын жарандары жана чет өлкөлүк абитуриенттер үчүн документтердин тизмеси."},
  en:{title:"Documents required for admission",description:"List of documents for applicants from the Kyrgyz Republic and international applicants."},
  "zh-CN":{title:"入学申请所需文件",description:"吉尔吉斯共和国公民及国际申请人的申请材料清单。"}},
 "admission-rules": {
  ky:{title:"Кирүү сынактарын өткөрүүнүн жалпы эрежелери",description:"Жарыяланган кирүү сынактарынын эрежелери жана тандоо формалары жөнүндө маалымат. Учурдагы жылдын шарттарын кабыл алуу комиссиясынан тактоо зарыл."},
  en:{title:"General rules for entrance examinations",description:"Published entrance examination rules and information on selection methods. Confirm current-year requirements with the admissions office."},
  "zh-CN":{title:"入学考试通则",description:"已公布的入学考试规则及选拔方式。请向招生办公室核实本年度要求。"}},
 "academic-department-regulations": {
  ky:{title:"Окуу бөлүмү жөнүндө жобо",description:"БМУнун окуу бөлүмүнүн милдеттерин жана иш-милдеттерин сүрөттөгөн жобо; баштапкы баракчада англисче версиясы да бар."},
  en:{title:"Regulation on the academic department",description:"Regulation describing the functions and responsibilities of BSU's academic department; an English version is available on the source page."},
  "zh-CN":{title:"教学部门管理规定",description:"规定比什凯克国立大学教学部门的职能与职责；来源页面提供英文版本。"}}
};

export function localizedCategory(category: string, locale: Locale): string {
 return locale === "ru" ? category : categories[category]?.[locale] ?? category;
}
export function localizedDocument(doc: DocumentRecord, locale: Locale) {
 const v = locale === "ru" ? undefined : translations[doc.slug]?.[locale];
 return {...doc,title:v?.title ?? doc.title,description:v?.description ?? doc.description,category:localizedCategory(doc.category,locale)};
}
