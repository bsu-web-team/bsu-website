import { facultyRoster } from "@/lib/faculty-leadership";
import { faculties } from "@/lib/faculty-data";
// Selected faculty-level paragraphs from the existing official content snapshot.
import type { Material } from '@/components/pages/MaterialBlocks';
type Selection = [string, number[]];
const selections: Record<string, Selection[]> = {
 'european-civilizations': [['Миссия факультета',[27]],['Студенческая жизнь',[28]],['Приветствие декана',[24]]],
 'ecology-management': [['О факультете',[28,29]],['Образовательная среда',[30]],['Приветствие декана',[24]]],
 'economics-finance-business': [['Наша миссия',[27]],['Приветствие директора',[25]],['Научно-исследовательская работа студентов',[37]]],
 'pedagogical-education': [['Миссия факультета',[29]],['Структура и образовательная деятельность',[31,32,33]],['Приветствие декана',[24]]],
 'russian-philology': [['Миссия факультета',[28]],['Подготовка специалистов',[30]],['Международное сотрудничество',[31]],['Приветствие декана',[24]]],
 'oriental-studies-international-relations': [['Миссия факультета',[28]],['Преподаватели мирового уровня',[30]],['Студенческая жизнь',[31,32]]],
 'journalism-information-systems': [['Миссия и цель',[29,30]],['Образовательная деятельность',[31,32]],['Наука и сотрудничество',[33,34]],['Приветствие декана',[25]]],
 'continuing-distance-education': [['О подразделении',[25]],['Миссия и цель института',[26,27]],['Приветствие директора',[19,20]]],
 'kyrgyz-philology': [['Миссия факультета',[27]],['Основные задачи',[28]],['Приветствие декана',[24]]],
 'kyrgyz-chinese': [['Миссия факультета',[30]],['Преподаватели',[32]],['Приветствие декана',[27]]],
 'social-psychological': [['Подготовка специалистов',[23]],['Приветствие декана',[20]]],
};
export function facultyOverviewContent(slug:string, blocks:Material['blocks']) {
 const seen = new Set<string>();
 return (selections[slug]??[]).flatMap(([heading, indices])=>{
  const paragraphs=indices.flatMap(i=>{
   const block=blocks[i];
   const text=block?.text?.trim()??'';
   if(block?.kind!=='text'||text.length<60||text.length>1500||seen.has(text))return [];
   seen.add(text);return [text];
  });
  return paragraphs.length?[{heading,paragraphs}]:[];
 });
}

// Keep the original snapshot intact; hide only content already shown on the overview.
export function facultyRemainingContent(slug:string, data:Material):Material {
 const shown=facultyOverviewContent(slug,data.blocks);
 const moved=new Set(shown.flatMap(section=>section.paragraphs));
 const headings=new Set(shown.map(section=>section.heading.trim()));
 const rosterIndices=new Set(facultyRoster(data.blocks,faculties.find(f=>f.slug===slug)?.leader??"").indices);
 const removed=data.blocks.map((b,i)=>rosterIndices.has(i)||b.kind==='text'&&moved.has(b.text?.trim()??'')&&!b.links?.length&&!b.href&&!b.rows?.length);
 const blocks=data.blocks.filter((b,i)=>{
  if(removed[i]) return false;
  if(b.kind!=='heading'||b.links?.length||b.href||b.rows?.length) return true;
  let end=i+1;
  while(end<data.blocks.length&&data.blocks[end].kind!=='heading')end++;
  // Remove a heading only if its entire following section was moved.
  return !(end>i+1&&removed.slice(i+1,end).every(Boolean)&&(headings.has(b.text?.trim()??'')||removed[i+1]));
 });
 return {...data,blocks};
}
