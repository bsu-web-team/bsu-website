import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, SESSION_COOKIE } from "@/lib/admin-session";

// Same-origin BFF: browser never receives an upstream bearer token.
export async function GET() {
  return proxy("GET", "items");
}
export async function POST(request: Request) {
  if (!allowedOrigin(request)) return NextResponse.json({ error: "Неверный источник запроса" }, { status: 403 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Неверный JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Неверный запрос" }, { status: 400 });
  const item = body as Record<string, unknown>;
  const action = item.action;
  const id = item.id;
  if (typeof action !== "string" || !["create","update","submit","decision"].includes(action)) return NextResponse.json({ error: "Неизвестная операция" }, { status: 400 });
  if (action !== "create" && (!Number.isSafeInteger(id) || (id as number) < 1)) return NextResponse.json({ error: "Неверный ID" }, { status: 400 });
  const payload = { ...item };
  delete payload.action; delete payload.id;
  const path = action === "create" ? "items" : action === "update" ? `items/${id}` : action === "submit" ? `items/${id}/submit` : `items/${id}/decision`;
  return proxy(action === "update" ? "PUT" : "POST", path, action === "submit" ? undefined : payload);
}
async function proxy(method: "GET" | "POST" | "PUT", path: string, payload?: unknown) {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "Недоступно" }, { status: 404 });
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Необходим вход" }, { status: 401 });
  try {
    const response = await fetch(`${adminApiBase()}/admin-editorial/${path}`, {
      method, cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { Authorization: `Bearer ${token}`, ...(payload ? { "Content-Type": "application/json" } : {}) },
      ...(payload ? { body: JSON.stringify(payload) } : {}),
    });
    const data: unknown = await response.json().catch(() => ({ error: `Backend HTTP ${response.status}` }));
    const result = NextResponse.json(data, { status: response.status });
    result.headers.set("Cache-Control", "no-store");
    return result;
  } catch { return NextResponse.json({ error: "Тестовый Backend недоступен" }, { status: 502 }); }
}
