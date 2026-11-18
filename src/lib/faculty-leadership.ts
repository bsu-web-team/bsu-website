import type { Material } from '@/components/pages/MaterialBlocks';
type Block=Material['blocks'][number];
export type LeadershipPerson={name:string;position:string;photo?:string};
const normalize=(s:string)=>s.toLowerCase().replace(/[^\p{L}]/gu,'');
const cleanName=(s:string)=>s.trim().replace(/([а-яёүөң])([А-ЯЁҮӨҢ])/gu,'$1 $2').replace(/\s+/g,' ');
const cleanRole=(s:string)=>s.trim().replace(/(декана|директора|кафедрой|кафедры)(?=[а-яё])/gi,'$1 ').replace(/\s+/g,' ');
const rolePattern=/декан|директор|завед|зав[.\s]|преподавател|доцент|профессор|методист|секретар|специалист|орун\s*басар|башчы|окутуучу|лаборант|ассистент|координатор/i;
// The archive has an administrative roster before the welcome/history/mission section.
export function facultyRoster(blocks:Block[],leader:string){
 const boundary=blocks.findIndex(b=>b.kind==='heading'&&/^(приветствие|история (факультета|института)|про фви|о факультете|о институте|наша миссия)/i.test(b.text?.trim()??''));
 const limit=boundary<0?Math.min(blocks.length,35):boundary;
 const records:{person:LeadershipPerson;indices:number[]}[]=[];
 for(let i=0;i<limit;i++){
  const b=blocks[i];if(b.kind!=='heading'||!b.text)continue;
  const name=cleanName(b.text);if(!/^[\p{L} .’'’-]+$/u.test(name)||name.split(/\s+/).length<2||name.length>100)continue;
  const previous=blocks[i-1], next=blocks[i+1];
  const photo=previous?.kind==='image'&&previous.href?.startsWith('/migration-files/')?previous.href:undefined;
  const role=next?.kind==='text'?cleanRole(next.text??''):'';
  const isLeader=normalize(name)===normalize(leader);
  if(!isLeader&&(!role||role.length>200||!rolePattern.test(role)))continue;
  if(isLeader&&!rolePattern.test(role)) {if(photo)records.push({person:{name,position:'',photo},indices:[i-1,i]});continue;}
  records.push({person:{name,position:role,photo},indices:[...(photo?[i-1]:[]),i,i+1]});
 }
 const people=new Map<string,LeadershipPerson>();
 for(const {person} of records){const key=normalize(person.name);const old=people.get(key);if(!old)people.set(key,person);else people.set(key,{...old,photo:old.photo??person.photo,position:[...new Set([old.position,person.position].filter(Boolean))].join(' · ')});}
 const dean=people.get(normalize(leader));
 return {people:[...people.values()].filter(x=>normalize(x.name)!==normalize(leader)),deanPhoto:dean?.photo,indices:records.filter(x=>normalize(x.person.name)!==normalize(leader)).flatMap(x=>x.indices)};
}
