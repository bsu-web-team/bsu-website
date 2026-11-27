import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, SESSION_COOKIE, adminAccessEnabled } from "@/lib/admin-session";

// Local development BFF: the bearer token stays in an HttpOnly cookie.
async function upstream(method: "GET" | "PUT", payload?: unknown) {
  if (!adminAccessEnabled()) return NextResponse.json({ error: "Недоступно" }, { status: 404 });
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Необходим вход" }, { status: 401 });
  try {
    const response = await fetch(`${adminApiBase()}/admin-unit-profiles/mine`, {
      method, cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${token}`, ...(payload === undefined ? {} : { "Content-Type": "application/json" }) },
      ...(payload === undefined ? {} : { body: JSON.stringify(payload) }),
    });
    const result: unknown = await response.json().catch(() => ({ error: `Backend HTTP ${response.status}` }));
    const output = NextResponse.json(result, { status: response.status });
    output.headers.set("Cache-Control", "no-store");
    return output;
  } catch {
    return NextResponse.json({ error: "Тестовый Backend недоступен" }, { status: 502 });
  }
}
export async function GET() { return upstream("GET"); }
export async function PUT(request: Request) {
  if (!allowedOrigin(request)) return NextResponse.json({ error: "Неверный источник" }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Неверный JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
  const item = body as Record<string, unknown>;
  if (Object.keys(item).some(key => key !== "description" && key !== "contact") ||
      typeof item.description !== "string" || typeof item.contact !== "string") {
    return NextResponse.json({ error: "Допустимы только description и contact" }, { status: 400 });
  }
  return upstream("PUT", { description: item.description, contact: item.contact });
}

export async function POST(request: Request) {
  if (!allowedOrigin(request)) return NextResponse.json({error:"Неверный источник"},{status:403});
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({error:"Необходим вход"},{status:401});
  if (!adminAccessEnabled()) return NextResponse.json({error:"Недоступно"},{status:404});
  try {
    const r=await fetch(`${adminApiBase()}/admin-unit-profiles/mine/submit`,{
      method:"POST",headers:{Authorization:`Bearer ${token}`},cache:"no-store",signal:AbortSignal.timeout(10000),
    });
    const data:unknown=await r.json().catch(()=>({error:`Backend HTTP ${r.status}`}));
    const result=NextResponse.json(data,{status:r.status});result.headers.set("Cache-Control","no-store");return result;
  } catch { return NextResponse.json({error:"Тестовый Backend недоступен"},{status:502}); }
}
