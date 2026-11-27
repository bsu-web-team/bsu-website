import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, SESSION_COOKIE, adminAccessEnabled } from "@/lib/admin-session";

type Verb = "GET" | "POST" | "PUT";
async function proxy(req: Request, method: Verb) {
  if (!adminAccessEnabled()) return NextResponse.json({ error: "Недоступно" }, { status: 404 });
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  if (method !== "GET" && !allowedOrigin(req)) return NextResponse.json({ error: "Неверный источник" }, { status: 403 });
  const url = new URL(req.url);
  const action = url.searchParams.get("action") ?? "catalog";
  const id = url.searchParams.get("id");
  if (id && !/^[1-9]\d*$/.test(id)) return NextResponse.json({ error: "Некорректный ID" }, { status: 400 });
  let path: string | null = null;
  if (method === "GET" && ["catalog", "mine", "review", "users"].includes(action)) path = action;
  else if (method === "POST" && action === "create") path = "drafts";
  else if (method === "PUT" && action === "update" && id) path = `drafts/${id}`;
  else if (method === "POST" && ["submit", "decision"].includes(action) && id) path = `drafts/${id}/${action}`;
  else if (method === "PUT" && action === "assign" && id) path = `users/${id}/assignment`;
  if (!path) return NextResponse.json({ error: "Недопустимый запрос" }, { status: 400 });
  let body: unknown;
  if (method !== "GET") {
    try { body = await req.json(); } catch { return NextResponse.json({ error: "Неверный JSON" }, { status: 400 }); }
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Неверное тело запроса" }, { status: 400 });
  }
  try {
    const response = await fetch(`${adminApiBase()}/admin-structure/${path}`, {
      method, cache: "no-store", signal: AbortSignal.timeout(12000),
      headers: { Authorization: `Bearer ${token}`, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data: unknown = await response.json().catch(() => ({ error: `Backend HTTP ${response.status}` }));
    const out = NextResponse.json(data, { status: response.status });
    out.headers.set("Cache-Control", "no-store");
    return out;
  } catch { return NextResponse.json({ error: "Тестовый Backend недоступен" }, { status: 502 }); }
}
export async function GET(req: Request) { return proxy(req, "GET"); }
export async function POST(req: Request) { return proxy(req, "POST"); }
export async function PUT(req: Request) { return proxy(req, "PUT"); }
