"""Apply V8.14.2 from ZIP extracted at project root. Fails closed on unexpected source."""
from pathlib import Path
import sys
root = Path(__file__).resolve().parents[1]


def replace(path, old, new):
    p = root/path
    if not p.exists():
        raise SystemExit(f'Missing file: {path}')
    s = p.read_text(encoding='utf-8-sig')
    if new in s:
        print(f'ALREADY: {path}')
        return
    if old not in s:
        raise SystemExit(f'Unexpected source / cannot patch: {path}; no changes to this file')
    p.write_text(s.replace(old,new,1),encoding='utf-8')
    print(f'PATCHED: {path}')

# V8.14.1 BFF: extend POST for submit, keep original GET/PUT.
p='src/app/api/admin-unit-profile/route.ts'
src=(root/p).read_text(encoding='utf-8-sig')
if 'export async function POST(request: Request)' not in src:
    src += '''
export async function POST(request: Request) {
  if (!allowedOrigin(request)) return NextResponse.json({error:"Неверный источник"},{status:403});
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({error:"Необходим вход"},{status:401});
  if (process.env.NODE_ENV !== "development") return NextResponse.json({error:"Недоступно"},{status:404});
  try {
    const r=await fetch(`${adminApiBase()}/admin-unit-profiles/mine/submit`,{
      method:"POST",headers:{Authorization:`Bearer ${token}`},cache:"no-store",signal:AbortSignal.timeout(10000),
    });
    const data:unknown=await r.json().catch(()=>({error:`Backend HTTP ${r.status}`}));
    const result=NextResponse.json(data,{status:r.status});result.headers.set("Cache-Control","no-store");return result;
  } catch { return NextResponse.json({error:"Тестовый Backend недоступен"},{status:502}); }
}
'''
    (root/p).write_text(src,encoding='utf-8')
    print('PATCHED:',p)
else: print('ALREADY:',p)

p='src/components/admin/EditorialDemo.tsx'
replace(p, '  const [profileStatus, setProfileStatus] = useState("");', '  const [profileStatus, setProfileStatus] = useState("");\n  const [profileFeedback, setProfileFeedback] = useState("");')
replace(p, 'setProfileStatus(value.status ?? "empty");', 'setProfileStatus(value.status ?? "empty");\n        setProfileFeedback(typeof (value as {feedback?:unknown}).feedback === "string" ? (value as {feedback:string}).feedback : "");')
replace(p, 'setProfileStatus(value.status ?? "draft");', 'setProfileStatus(value.status ?? "draft");\n      setProfileFeedback("");')
replace(p, '  function saveArticle(submit: boolean) {', '''  async function submitProfile() {
    if (profileBusy || profileStatus !== "draft") return;
    setProfileBusy(true);setNotice("");
    try {
      const response = await fetch("/api/admin-unit-profile", {method:"POST"});
      const result: {status?:string;detail?:string;error?:string}=await response.json();
      if (!response.ok) throw new Error(result.detail??result.error??`HTTP ${response.status}`);
      setProfileStatus(result.status??"submitted");
      setNotice("Заявка передана ЦЦР. До решения сведения нельзя редактировать.");
    } catch(e) {setNotice(e instanceof Error?e.message:"Не удалось отправить заявку");}
    finally {setProfileBusy(false);}
  }
  function saveArticle(submit: boolean) {''')
replace(p,'Статус: {profileStatus === "draft" ? "черновик" : "не заполнено"}.','Статус: {profileStatus === "draft" ? "черновик" : profileStatus === "submitted" ? "на проверке ЦЦР" : profileStatus === "changes_requested" ? "нужны исправления" : profileStatus === "approved" ? "одобрено ЦЦР" : "не заполнено"}.')
replace(p,'</p></div><label className="block text-sm font-medium">Описание<textarea', '</p>{profileFeedback&&<p className="mt-2 rounded-lg bg-amber-50 p-3 text-sm">Замечание ЦЦР: {profileFeedback}</p>}</div><label className="block text-sm font-medium">Описание<textarea')
replace(p, 'value={description} onChange={(e)=>setDescription(e.target.value)}', 'value={description} disabled={profileStatus === "submitted"} onChange={(e)=>setDescription(e.target.value)}')
replace(p, 'value={contact} onChange={(e)=>setContact(e.target.value)}', 'value={contact} disabled={profileStatus === "submitted"} onChange={(e)=>setContact(e.target.value)}')
replace(p, '<button type="button" className={primary} disabled={profileBusy} onClick={()=>void saveProfile()}><Save size={17}/> {profileBusy ? "Сохранение…" : "Сохранить черновик в PostgreSQL"}</button>', '<div className="flex flex-wrap gap-3"><button type="button" className={secondary} disabled={profileBusy||profileStatus === "submitted"} onClick={()=>void saveProfile()}><Save size={17}/> {profileBusy ? "Сохранение…" : "Сохранить черновик в PostgreSQL"}</button><button type="button" className={primary} disabled={profileBusy||profileStatus !== "draft"} onClick={()=>void submitProfile()}><Send size={17}/> Отправить на согласование ЦЦР</button></div>')
replace(p,'Сохраняется в тестовой PostgreSQL без публичной публикации.', 'Заявки проверяет ЦЦР. Публичные страницы пока не меняются.')
replace(p,'<span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">ДЕМО · без публикации</span>', '<span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">Профили · PostgreSQL (тест)</span>')

# Expose review dashboard from CCR admin without altering other demo modules.
p='src/components/admin/AdminWorkspace.tsx'
replace(p,'<Link href="/admin/editorial-review"', '<Link href="/admin/editorial-review"') if False else None
replace(p,'      {notice&&<div role="status"', '      <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-5"><p className="text-sm font-bold text-[#204774]">ЦЦР · заявки подразделений</p><p className="mt-1 text-sm text-slate-600">Проверка изменений профилей факультетов и кафедр в тестовой PostgreSQL</p><Link href="/admin/unit-review" className="mt-3 inline-block rounded-lg bg-[#204774] px-4 py-2 text-sm font-semibold text-white">Открыть согласование профилей</Link></div>\n      {notice&&<div role="status"')
print('PASS: V8.14.2 files installed; only test DB should be migrated')
