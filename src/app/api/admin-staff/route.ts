import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, SESSION_COOKIE, adminAccessEnabled } from "@/lib/admin-session";

export async function GET(request: Request) { return proxy(request, "GET"); }
export async function POST(request: Request) { return proxy(request, "POST"); }
export async function PUT(request: Request) { return proxy(request, "PUT"); }

async function proxy(request: Request, method: "GET" | "POST" | "PUT") {
  if (!adminAccessEnabled()) return NextResponse.json({error:"Недоступно"},{status:404});
  const token=(await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({error:"Нужен вход"},{status:401});
  const url=new URL(request.url);
  const action=url.searchParams.get("action")??"mine";
  const id=url.searchParams.get("id");
  if (method!=="GET" && !allowedOrigin(request)) return NextResponse.json({error:"Неверный источник"},{status:403});
  let path: string;
  if (method==="GET" && (action==="mine" || action==="review")) path=action;
  else if (method==="POST" && action==="create") path="drafts";
  else if (method==="PUT" && action==="update" && id && /^[1-9]\d*$/.test(id)) path=`drafts/${id}`;
  else if (method==="POST" && (action==="submit" || action==="decision") && id && /^[1-9]\d*$/.test(id)) path=`drafts/${id}/${action}`;
  else return NextResponse.json({error:"Недопустимый запрос"},{status:400});
  let body: unknown;
  if (method!=="GET") {
    try { body=await request.json(); } catch { return NextResponse.json({error:"Неверный JSON"},{status:400}); }
    if (!body || typeof body!=="object" || Array.isArray(body)) return NextResponse.json({error:"Неверный запрос"},{status:400});
  }
  try {
    const response=await fetch(`${adminApiBase()}/admin-staff/${path}`,{
      method,cache:"no-store",signal:AbortSignal.timeout(12000),
      headers:{Authorization:`Bearer ${token}`,...(body===undefined?{}:{"Content-Type":"application/json"})},
      ...(body===undefined?{}:{body:JSON.stringify(body)}),
    });
    const result:unknown=await response.json().catch(()=>({error:`Backend HTTP ${response.status}`}));
    const output=NextResponse.json(result,{status:response.status});
    output.headers.set("Cache-Control","no-store");
    return output;
  } catch {return NextResponse.json({error:"Тестовый Backend недоступен"},{status:502});}
}
