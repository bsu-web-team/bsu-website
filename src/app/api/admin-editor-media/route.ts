import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, SESSION_COOKIE } from "@/lib/admin-session";

const devOnly = () => process.env.NODE_ENV === "development";
const idOf = (s: string | null) => s && /^[1-9]\d*$/.test(s) ? s : null;
async function tokenOf() { return (await cookies()).get(SESSION_COOKIE)?.value; }
function err(status: number, error: string) { return NextResponse.json({ error }, { status }); }

export async function GET(req: Request) {
  if (!devOnly()) return err(404, "Недоступно");
  const token = await tokenOf(); if (!token) return err(401, "Необходим вход");
  const q = new URL(req.url).searchParams;
  const item = idOf(q.get("itemId")), media = idOf(q.get("mediaId"));
  if (!item || !media) return err(400, "Неверный ID");
  try {
    const upstream = await fetch(`${adminApiBase()}/admin-editorial/items/${item}/media/${media}`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    if (!upstream.ok) return err(upstream.status, "Файл недоступен");
    const type = upstream.headers.get("content-type") || "application/octet-stream";
    if (!["image/jpeg", "image/png", "image/webp"].includes(type)) return err(502, "Неверный тип файла");
    return new Response(upstream.body, { status: 200, headers: { "Content-Type": type, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return err(502, "Backend недоступен"); }
}

export async function POST(req: Request) {
  if (!devOnly()) return err(404, "Недоступно");
  if (!allowedOrigin(req)) return err(403, "Неверный источник запроса");
  const token = await tokenOf(); if (!token) return err(401, "Необходим вход");
  const size = Number(req.headers.get("content-length") ?? 0);
  if (size > 6 * 1024 * 1024) return err(413, "Файл слишком большой");
  const q = new URL(req.url).searchParams;
  const item = idOf(q.get("itemId")), media = idOf(q.get("mediaId"));
  if (!item) return err(400, "Неверный ID");
  const action = q.get("action");
  if (action !== "upload" && (action !== "cover" || !media)) return err(400, "Неверная операция");
  try {
    let url = `${adminApiBase()}/admin-editorial/items/${item}/media`;
    let body: FormData | undefined;
    if (action === "upload") {
      body = await req.formData();
      const file = body.get("file");
      if (!(file instanceof File) || file.size < 1 || file.size > 5 * 1024 * 1024) return err(413, "Размер изображения: до 5 МБ");
      const forward = new FormData(); forward.set("file", file); forward.set("cover", body.get("cover") === "true" ? "true" : "false");
      body = forward;
    } else { url += `/${media}/cover`; }
    const upstream = await fetch(url, { method: "POST", headers: { Authorization: `Bearer ${token}` }, body, cache: "no-store", signal: AbortSignal.timeout(25000) });
    const payload: unknown = await upstream.json().catch(() => ({ error: `HTTP ${upstream.status}` }));
    return NextResponse.json(payload, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
  } catch { return err(502, "Ошибка передачи файла"); }
}

export async function DELETE(req: Request) {
  if (!devOnly()) return err(404, "Недоступно");
  if (!allowedOrigin(req)) return err(403, "Неверный источник запроса");
  const token = await tokenOf(); if (!token) return err(401, "Необходим вход");
  const q = new URL(req.url).searchParams;
  const item = idOf(q.get("itemId")), media = idOf(q.get("mediaId"));
  if (!item || !media) return err(400, "Неверный ID");
  try {
    const upstream = await fetch(`${adminApiBase()}/admin-editorial/items/${item}/media/${media}`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(10000),
    });
    const payload: unknown = await upstream.json().catch(() => ({ error: `HTTP ${upstream.status}` }));
    return NextResponse.json(payload, { status: upstream.status, headers: { "Cache-Control": "no-store" } });
  } catch { return err(502, "Backend недоступен"); }
}
