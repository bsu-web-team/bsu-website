import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminApiBase, SESSION_COOKIE } from "@/lib/admin-session";

type Principal = {
  role?: string;
  facultySlug?: string | null;
  departmentSlug?: string | null;
};

// Display-only; public content always comes from the same API used by the live site.
export async function GET() {
  if (process.env.NODE_ENV !== "development") return NextResponse.json({ error: "Недоступно" }, { status: 404 });
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json({ error: "Требуется вход" }, { status: 401 });
  try {
    const me = await fetch(`${adminApiBase()}/admin-auth/me`, {
      headers: { Authorization: `Bearer ${token}` }, cache: "no-store", signal: AbortSignal.timeout(7000),
    });
    if (!me.ok) return NextResponse.json({ error: "Недействительная сессия" }, { status: 401 });
    const principal = (await me.json()) as Principal;
    const role = principal.role;
    if (role !== "faculty" && role !== "department") return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    const slug = role === "faculty" ? principal.facultySlug : principal.departmentSlug;
    if (!slug || !/^[a-z0-9-]{1,300}$/.test(slug)) return NextResponse.json({ error: "Подразделение не привязано к аккаунту" }, { status: 403 });

    const base = process.env.BSU_API_BASE_URL;
    if (!base) return NextResponse.json({ error: "Не настроен BSU_API_BASE_URL" }, { status: 503 });
    const url = new URL(`${base.replace(/\/+$/, "")}/${role === "faculty" ? "faculties" : "departments"}/${encodeURIComponent(slug)}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.search || url.hash) {
      return NextResponse.json({ error: "Небезопасная конфигурация публичного API" }, { status: 503 });
    }
    const source = await fetch(url.toString(), { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (source.status === 404) return NextResponse.json({ error: "Подразделение отсутствует в публичной базе. Черновик не затронут" }, { status: 404 });
    if (!source.ok) return NextResponse.json({ error: `Публичный Backend ответил HTTP ${source.status}` }, { status: 502 });
    const raw = (await source.json()) as Record<string, unknown>;
    const val = (key: string) => typeof raw[key] === "string" ? raw[key] as string : undefined;
    if (val("slug") !== slug || !val("name")) return NextResponse.json({ error: "Некорректный ответ публичного API" }, { status: 502 });
    return NextResponse.json({data:{source:"public-api",role,slug,name:val("name"),category:val("category"),summary:val("summary"),leader:val("leader"),phone:val("phone"),email:val("email"),address:val("address"),facultyName:val("facultyName")}}, {headers:{"Cache-Control":"private, no-store"}});
  } catch {
    return NextResponse.json({ error: "Публичный Backend недоступен" }, { status: 502 });
  }
}
