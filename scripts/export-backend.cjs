/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = process.cwd();
const cache = new Map();
function load(file) {
  const full = path.resolve(root, file);
  if (cache.has(full)) return cache.get(full).exports;
  const mod = {exports:{}}; cache.set(full, mod);
  const source = fs.readFileSync(full, 'utf8');
  const js = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const localRequire = name => {
    if (name.startsWith('@/')) return load('src/'+name.slice(2)+'.ts');
    if (name.startsWith('.')) return load(path.resolve(path.dirname(full),name+'.ts'));
    return require(name);
  };
  new Function('require','module','exports',js)(localRequire,mod,mod.exports);
  return mod.exports;
}
const specs={faculties:['faculty-data','faculties'],departments:['department-data','departments'],staff:['staff-data','staff'],programs:['program-data','programRecords'],news:['news-data','newsRecords'],documents:['document-data','documents'],archiveIndex:['archive-index','archiveIndex'],sectionIndex:['integrated-index','sectionIndex']};
const data={};
for(const [key,[file,prop]] of Object.entries(specs)) {data[key]=load('src/lib/'+file+'.ts')[prop];if(!data[key])throw Error('Missing '+key);}
function collection(dir){const p=path.join(root,dir);return Object.fromEntries(fs.readdirSync(p).filter(x=>x.endsWith('.json')).sort().map(x=>[x.slice(0,-5),JSON.parse(fs.readFileSync(path.join(p,x),'utf8'))]));}
data.archive=collection('src/lib/archive-data');data.integratedContent=collection('src/lib/integrated-data');data.facultyContent=collection('src/lib/content-phase1');
const issues=[];const facultySlugs=new Set(data.faculties.map(x=>x.slug));
for(const key of ['faculties','departments','staff','programs','news','documents']){const seen=new Set();for(const x of data[key]){if(!x.slug||seen.has(x.slug))issues.push({kind:'duplicate-or-empty-slug',key,slug:x.slug});seen.add(x.slug);if(x.facultySlug&&!facultySlugs.has(x.facultySlug))issues.push({kind:'unknown-faculty',key,slug:x.slug,facultySlug:x.facultySlug});}}
for(const entry of data.archiveIndex)for(const v of entry.variants??[])if(!data.archive[v.id])issues.push({kind:'missing-archive-file',id:v.id});
const referencedMedia=new Set();function walk(x){if(typeof x==='string'){if(/^\/(migration-files|images|brand)\//.test(x))referencedMedia.add(x);}else if(x&&typeof x==='object')Object.values(x).forEach(walk);}
walk(data);for(const url of referencedMedia)if(!fs.existsSync(path.join(root,'public',url.slice(1))))issues.push({kind:'missing-media',url});
const out=path.join(root,'backend-export');fs.mkdirSync(out,{recursive:true});
const counts=Object.fromEntries(Object.entries(data).map(([k,v])=>[k,Array.isArray(v)?v.length:Object.keys(v).length]));
for(const [key,value] of Object.entries(data))fs.writeFileSync(path.join(out,key+'.json'),JSON.stringify(value,null,2));
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify({schemaVersion:1,generatedAt:new Date().toISOString(),counts,media:[...referencedMedia].sort(),issues,notes:['Archive locale cn corresponds to frontend zh-CN; ky corresponds to KG.','Staff catalogue is preliminary; additional employees remain in facultyContent.','Media files are referenced, not bundled.','Data requires university verification.']},null,2));
console.log('EXPORT:',out);console.table(counts);console.log('ISSUES:',issues.length);
