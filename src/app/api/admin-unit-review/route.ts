import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, SESSION_COOKIE } from "@/lib/admin-session";

async function proxy(method: "GET" | "POST", path: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({error:"Недоступно"},{status:404});
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({error:"Необходим вход"},{status:401});
  try {
    const r = await fetch(`${adminApiBase()}/admin-unit-profiles/${path}`, {
      method, cache:"no-store", signal:AbortSignal.timeout(10000),
      headers:{Authorization:`Bearer ${token}`,...(payload===undefined?{}:{"Content-Type":"application/json"})},
      ...(payload===undefined?{}:{body:JSON.stringify(payload)}),
    });
    const data: unknown = await r.json().catch(()=>({error:`Backend HTTP ${r.status}`}));
    const out=NextResponse.json(data,{status:r.status});
    out.headers.set("Cache-Control","no-store");
    return out;
  } catch { return NextResponse.json({error:"Тестовый Backend недоступен"},{status:502}); }
}
export async function GET() { return proxy("GET","review"); }
export async function POST(request: Request) {
  if (!allowedOrigin(request)) return NextResponse.json({error:"Неверный источник"},{status:403});
  let input: unknown;
  try { input=await request.json(); }catch {return NextResponse.json({error:"Неверный JSON"},{status:400});}
  if (!input || typeof input !== "object" || Array.isArray(input)) return NextResponse.json({error:"Неверный запрос"},{status:400});
  const data=input as Record<string,unknown>;
  if (!Number.isSafeInteger(data.id) || (data.id as number)<1 || typeof data.approve!=="boolean" || typeof data.feedback!=="string" || data.feedback.length>4000 || Object.keys(data).some(k=>!['id','approve','feedback'].includes(k))) return NextResponse.json({error:"Неверные поля"},{status:400});
  return proxy("POST",`review/${data.id}/decision`,{approve:data.approve,feedback:data.feedback});
}
