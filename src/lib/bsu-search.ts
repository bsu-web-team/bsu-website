import { archiveIndex } from "@/lib/archive-index";
import { migratedPages } from "@/lib/migration-index";
import { faculties } from '@/lib/faculty-data';
import { departments } from '@/lib/department-data';
import { staff } from '@/lib/staff-data';
import { programRecords } from '@/lib/program-data';
import { documents } from '@/lib/document-data';
import { newsRecords } from '@/lib/news-data';
import { localizeNews } from '@/lib/news-i18n';
import { translateContent } from '@/lib/content-translations';
import { getNavigation } from '@/components/layout/MegaMenu';
import type { Locale } from '@/lib/i18n';

export const categories = ['pages','faculties','departments','staff','programs','news','documents'] as const;
export type Category = typeof categories[number];
export type SearchRecord = { href:string; title:string; description:string; category:Category; aliases:string[] };
const locales:Locale[]=['ru','ky','en','zh-CN'];
const synonyms:Record<string,string[]> = {
 '/faculties/oriental-studies-international-relations':['ФВМО','МО','международка','восток','international relations'],
 '/programs/international-relations-ba':['МО','международка','дипломатия'],
 '/faculties/continuing-distance-education':['ИНДОППК','ДПО','повышение квалификации','переподготовка','курсы'],
 '/faculties/journalism-information-systems':['ФЖИС','IT','ИТ','айти'],
 '/admissions':['ОРТ','приемная комиссия','поступить','абитуриент'],
 '/admissions/tuition':['цена','стоимость','контракт','оплата','tuition'],
 '/admissions/rules':['ОРТ','правила приема','поступление'],
 '/admissions/documents':['пакет документов','справки','поступление'],
 '/science':['НИР','научная деятельность','research'],
 '/contacts':['адрес','телефон','почта','email'],
};
const labels = {
 ru:['Разделы','Факультеты','Кафедры','Сотрудники','Программы','Новости','Документы'],
 ky:['Бөлүмдөр','Факультеттер','Кафедралар','Кызматкерлер','Программалар','Жаңылыктар','Документтер'],
 en:['Pages','Faculties','Departments','Staff','Programs','News','Documents'],
 'zh-CN':['栏目','学院','教研室','教职员工','专业','新闻','文件'],
} satisfies Record<Locale,string[]>;
export function categoryLabel(c:Category,locale:Locale){return labels[locale][categories.indexOf(c)];}
const cache = new Map<Locale,SearchRecord[]>();
export function buildIndex(locale:Locale):SearchRecord[]{
 const existing=cache.get(locale); if(existing)return existing;
 const map=new Map<string,SearchRecord>();
 const tr=(s:string)=>translateContent(s,locale);
 const add=(href:string,category:Category,title:string,description:string,values:(string|undefined)[])=>{
  const aliases=[...values.filter((v):v is string=>!!v).flatMap(v=>locales.map(l=>translateContent(v,l))),...(synonyms[href]??[])];
  const old=map.get(href);if(old){old.aliases.push(title,description,...aliases);return;}
  map.set(href,{href,category,title,description,aliases});
 };
 for(const f of faculties)add('/faculties/'+f.slug,'faculties',tr(f.name),tr(f.summary),[f.name,f.shortName,f.category,f.summary,f.leader,...(f.departments??[])]);
 for(const d of departments)add('/departments/'+d.slug,'departments',tr(d.name),tr(d.facultyName),[d.name,d.facultyName]);
 for(const s of staff)add('/staff/'+s.slug,'staff',tr(s.name),[tr(s.position),tr(s.facultyName)].join(' · '),[s.name,s.position,s.facultyName,s.biography]);
 for(const p of programRecords)add('/programs/'+p.slug,'programs',tr(p.title),[tr(p.level),p.code,tr(p.facultyName)].filter(Boolean).join(' · '),[p.title,p.code,p.profile,p.level,p.facultyName,p.description,p.languages]);
 for(const n of newsRecords){const l=localizeNews(n,locale);add('/news/'+n.slug,'news',l.title,l.excerpt,locales.flatMap(lang=>{const v=localizeNews(n,lang);return [v.title,v.excerpt];}).concat(n.date,n.category,...(n.content??[])));}
 for(const d of documents)add('/documents/'+d.slug,'documents',tr(d.title),tr(d.description),[d.title,d.category,d.description]);
 const navs=locales.flatMap(l=>getNavigation(l).flatMap(s=>s.groups.flatMap(g=>g.links.flatMap(a=>a.href?[{href:a.href,label:a.label}]:[]))));
 for(const section of getNavigation(locale))for(const group of section.groups)for(const link of group.links){if(link.href?.startsWith('/')&&!link.href.startsWith('/admin'))add(link.href,'pages',link.label,section.title,navs.filter(x=>x.href===link.href).map(x=>x.label));}
 for(const p of migratedPages)add(p.href,"pages",p.title,p.description,[p.title,p.description]);
 for(const p of archiveIndex)add(p.href,"pages",p.title,p.description,[p.title,p.description,...p.variants.map(v=>v.title)]);
 const result=[...map.values()];cache.set(locale,result);return result;
}
export function normalize(s:string){return s.normalize('NFKC').toLowerCase().replace(/ё/g,'е').replace(/[^\p{L}\p{N}]+/gu,' ').trim();}
function distanceAtMostOne(a:string,b:string){if(Math.abs(a.length-b.length)>1)return false;let i=0,j=0,d=0;while(i<a.length&&j<b.length){if(a[i]===b[j]){i++;j++;continue;}if(++d>1)return false;if(a.length>=b.length)i++;if(b.length>=a.length)j++;}return d+(a.length-i)+(b.length-j)<=1;}
function score(r:SearchRecord,q:string){const title=normalize(r.title), alias=normalize(r.aliases.join(' ')), desc=normalize(r.description);if(title===q)return 1000;const tokens=q.split(' ');const titleWords=title.split(' '), words=(title+' '+alias+' '+desc).split(' ');let total=0;for(const t of tokens){if(titleWords.includes(t))total+=80;else if(t.length>2&&title.includes(t))total+=55;else if(words.includes(t))total+=30;else if(t.length>2&&(alias.includes(t)||desc.includes(t)))total+=15;else if(t.length>=5&&words.some(w=>distanceAtMostOne(t,w)))total+=5;else return 0;}return total+(title.startsWith(q)?100:title.includes(q)?60:0);}
export function searchBSU(query:string,locale:Locale,category?:Category){const q=normalize(query.slice(0,160));if(!q)return [];return buildIndex(locale).filter(r=>!category||r.category===category).map(record=>({record,score:score(record,q)})).filter(r=>r.score>0).sort((a,b)=>b.score-a.score||a.record.title.localeCompare(b.record.title,locale)).map(x=>x.record);}
