import fs from 'node:fs';
import path from 'node:path';

const files = new Map();
const root = process.cwd();
const supported = [
  'src/app/faculties/page.tsx',
  'src/app/faculties/[slug]/page.tsx',
  'src/app/departments/page.tsx',
  'src/app/departments/[slug]/page.tsx',
  'src/components/faculties/FacultyDirectory.tsx',
  'src/components/departments/DepartmentDirectory.tsx',
];
for (const p of supported) {
  const full = path.join(root,p);
  if (!fs.existsSync(full)) throw Error(`Missing ${p}; run from the BSU project root`);
  files.set(p, fs.readFileSync(full,'utf8'));
}
function replace(p, oldText, newText) {
  const content = files.get(p);
  if (!content.includes(oldText)) throw Error(`Expected code not found in ${p}: ${oldText.slice(0,85)}. No files written.`);
  files.set(p,content.split(oldText).join(newText));
}
function importPublic(p) {
  const spec = p.includes("faculties/[slug]") ? "PublicTextV13, { PublicPersonV13 }" : "PublicTextV13";
  replace(p,'import type { Metadata } from "next";', `import type { Metadata } from "next";\nimport ${spec} from "@/components/i18n/PublicTextV13";`);
}
const wrap = value => `<PublicTextV13 value=${JSON.stringify(value)} />`;
function text(p,s) {
  const content = files.get(p);
  // Match text only at JSX boundaries, including an optional leading/trailing space
  // around an inline icon (e.g. <ArrowLeft/> Ко всем кафедрам).
  const forms = [
    [`>${s}<`,`>${wrap(s)}<`],
    [`/>${s}<`,`/>${wrap(s)}<`],
    [`/> ${s}<`,`/> <PublicTextV13 value=${JSON.stringify(s)} /><`],
    [`>${s} <`,`>${wrap(s)} <`],
  ];
  const matched = forms.find(([needle]) => content.includes(needle));
  if (!matched) throw Error(`Expected JSX text missing in ${p}: ${s}. No files written.`);
  replace(p,...matched);
}

// Server pages retain route params and data retrieval; only render translated client text.
const facultyIndex='src/app/faculties/page.tsx';
const facultyDetail='src/app/faculties/[slug]/page.tsx';
const deptIndex='src/app/departments/page.tsx';
const deptDetail='src/app/departments/[slug]/page.tsx';
for(const p of [facultyIndex,facultyDetail,deptIndex,deptDetail])importPublic(p);
for(const s of ['Главная','Факультеты и институты','Образование в БГУ','Откройте подразделение, чтобы узнать о руководстве, кафедрах, образовательных направлениях и контактах.','Данные перенесены из открытых страниц bsu.kg для предварительного ознакомления. Состав и контакты требуют подтверждения университетом перед публикацией.'])text(facultyIndex,s);
// Repeated "Факультеты и институты" in the heading and breadcrumb are already replaced globally.
for(const s of ['Главная','Факультеты','Кафедры','Структура университета','Кафедры БГУ','Кафедры, указанные в доступных сведениях о факультетах университета. Перечень уточняется.','Предварительный каталог на основе открытого реестра факультетов. Отсутствие кафедры в каталоге не означает, что она не существует.'])text(deptIndex,s);
for(const s of ['Главная','Факультеты и институты','О подразделении','Ниже приведены сведения, опубликованные на прежнем сайте университета. Полная историческая справка и дополнительные материалы будут добавляться после согласования с редакторами БГУ.','Кафедры','Опубликованный на старом сайте перечень; структура требует проверки на актуальность.','Направления подготовки','Вернуться к списку факультетов','Контакты','Официальная страница','Проверьте актуальные сведения на официальном сайте БГУ.'])text(facultyDetail,s);
for(const [oldStr,newStr] of [
  ['>{faculty.shortName ?? faculty.name}</span>', '><PublicTextV13 value={faculty.name} /></span>'],
  ['>{faculty.name}</h1>', '><PublicTextV13 value={faculty.name} /></h1>'],
  ['>{faculty.summary}</p>', '><PublicTextV13 value={faculty.summary} /></p>'],
  [' · {faculty.category}</p>', ' · <PublicTextV13 value={faculty.category} /></p>'],
  ['>{faculty.leadTitle}</div>', '><PublicTextV13 value={faculty.leadTitle} /></div>'],
  ['>{program.title}</h3>', '><PublicTextV13 value={program.title} /></h3>'],
  ['>{program.degree}</p>', '><PublicTextV13 value={program.degree} /></p>'],
  ['>{name}</li>', '><PublicTextV13 value={name} /></li>'],
])replace(facultyDetail,oldStr,newStr);
replace(facultyDetail,'{faculty.kind === "faculty" ? "Факультет" : "Институт"}', '<PublicTextV13 value={faculty.kind === "faculty" ? "Факультет" : "Институт"} />');
replace(facultyDetail,'>{faculty.leader}</h2>', '><PublicPersonV13 name={faculty.leader} /></h2>');
// Dynamic postal addresses are preserved as official source data until reviewed localized addresses exist.
for(const s of ['Главная','Факультеты','Кафедры','Кафедра','О кафедре','Кафедра входит в структуру факультета. Описание деятельности, история кафедры и направления исследований будут размещены после подтверждения университетом.','Сотрудники и программы','Список преподавателей, заведующий кафедрой, учебные программы и документы пока уточняются. Backend-команда сможет предоставлять эти сведения через API.','Ко всем кафедрам','Факультет','Источник на сайте БГУ','Информация требует проверки на актуальность перед официальной публикацией.'])text(deptDetail,s);
replace(deptDetail,'>{department.name}</span>', '><PublicTextV13 value={department.name} /></span>');
replace(deptDetail,'>{department.name}</h1>', '><PublicTextV13 value={department.name} /></h1>');
replace(deptDetail,'>{department.facultyName}</p>', '><PublicTextV13 value={department.facultyName} /></p>');
replace(deptDetail,'>{department.facultyName}</Link>', '><PublicTextV13 value={department.facultyName} /></Link>');
// Faculty directory: translate visible content and search in RU + active language.
const fd='src/components/faculties/FacultyDirectory.tsx';
replace(fd,'import type { FacultyRecord } from "@/lib/faculty-data";', 'import type { FacultyRecord } from "@/lib/faculty-data";\nimport { useLocale } from "@/components/i18n/LocaleProvider";\nimport { publicV13Text } from "@/lib/public-v13-i18n";');
replace(fd,'export default function FacultyDirectory({ items }: { items: FacultyRecord[] }) {','export default function FacultyDirectory({ items }: { items: FacultyRecord[] }) {\n  const {locale} = useLocale();');
replace(fd,'search.trim().toLocaleLowerCase("ru-RU")','search.trim().toLocaleLowerCase(locale)');
replace(fd,'[item.name, item.shortName, item.category, item.summary].filter(Boolean).join(" ").toLocaleLowerCase("ru-RU")', '[item.name,item.shortName,item.category,item.summary,publicV13Text(item.name,locale),publicV13Text(item.category,locale),publicV13Text(item.summary,locale)].filter(Boolean).join(" ").toLocaleLowerCase(locale)');
replace(fd,'[items, search, filter]','[items, search, filter, locale]');
for(const s of ['Поиск факультетов и институтов','Поиск по названию, направлению или специализации','Очистить поиск','Тип подразделения'])replace(fd,`="${s}"`,`={publicV13Text("${s}",locale)}`);
replace(fd,'>{label}</button>', '>{publicV13Text(label,locale)}</button>');
for(const s of ['Найдено подразделений:','Ничего не найдено','Попробуйте другой запрос или сбросьте фильтр.','Показать все','Подробнее'])replace(fd,s,`{publicV13Text(${JSON.stringify(s)},locale)}`);
for(const [before,after] of [
  ['{item.kind === "faculty" ? "Факультет" : "Институт"}','{publicV13Text(item.kind === "faculty" ? "Факультет" : "Институт",locale)}'],
  ['{item.category}','{publicV13Text(item.category,locale)}'],['{item.name}','{publicV13Text(item.name,locale)}'],['{item.summary}','{publicV13Text(item.summary,locale)}']
])replace(fd,before,after);
// Department directory: translate visible fields and search in RU + active language.
const dd='src/components/departments/DepartmentDirectory.tsx';
replace(dd,'import type { DepartmentRecord } from "@/lib/department-data";', 'import type { DepartmentRecord } from "@/lib/department-data";\nimport { useLocale } from "@/components/i18n/LocaleProvider";\nimport { publicV13Text } from "@/lib/public-v13-i18n";');
replace(dd,'export default function DepartmentDirectory({ items }: { items: DepartmentRecord[] }) {','export default function DepartmentDirectory({ items }: { items: DepartmentRecord[] }) {\n  const {locale}=useLocale();');
replace(dd,'query.toLocaleLowerCase("ru").trim()','query.toLocaleLowerCase(locale).trim()');
replace(dd,'`${item.name} ${item.facultyName}`.toLocaleLowerCase("ru").includes(search)', '[item.name,item.facultyName,publicV13Text(item.name,locale),publicV13Text(item.facultyName,locale)].join(" ").toLocaleLowerCase(locale).includes(search)');
replace(dd,'[items, query, faculty]','[items, query, faculty, locale]');
for(const s of ['Поиск кафедры','Факультет','Все подразделения','Найдено кафедр:','По вашему запросу кафедры не найдены.','Кафедра','Подробнее'])replace(dd,s,`{publicV13Text(${JSON.stringify(s)},locale)}`);
replace(dd,'placeholder="Название кафедры..."','placeholder={publicV13Text("Название кафедры...",locale)}');
replace(dd,'>{name}</option>','>{publicV13Text(name,locale)}</option>');
replace(dd,'{department.name}','{publicV13Text(department.name,locale)}');
replace(dd,'{department.facultyName}','{publicV13Text(department.facultyName,locale)}');
// Validate ALL patches before writing anything, preventing partial updates on incompatible branches.
for(const [p,data] of files)fs.writeFileSync(path.join(root,p),data,'utf8');
console.log(`Applied v13 recovery to ${files.size} files, preserving v14 and existing layouts.`);
