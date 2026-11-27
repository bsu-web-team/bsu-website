import { NextResponse } from "next/server";
import { adminApiBase, allowedOrigin, correctAdminHome, SESSION_COOKIE, adminAccessEnabled } from "@/lib/admin-session";

type LoginResult = {
  accessToken?: unknown;
  expiresIn?: unknown;
  principal?: { username?: unknown; role?: unknown; facultySlug?: unknown; departmentSlug?: unknown };
};

export async function POST(request: Request) {
  if (!adminAccessEnabled()) return NextResponse.json({ error: "Not available" }, { status: 404 });
  if (!allowedOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  let input: unknown;
  try { input = await request.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!input || typeof input !== "object") return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  const data = input as Record<string, unknown>;
  if (typeof data.username !== "string" || !data.username.trim() || data.username.length > 100 ||
    typeof data.password !== "string" || !data.password || data.password.length > 1024) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
  }
  try {
    const upstream = await fetch(`${adminApiBase()}/admin-auth/login`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: data.username, password: data.password }),
      cache: "no-store", signal: AbortSignal.timeout(5000),
    });
    if (upstream.status === 401) return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
    if (!upstream.ok) return NextResponse.json({ error: "Сервис входа недоступен" }, { status: 502 });
    const result: LoginResult = await upstream.json();
    const role = result.principal?.role;
    if (typeof result.accessToken !== "string" || result.accessToken.length < 20 ||
        (role !== "ccr" && role !== "faculty" && role !== "department" && role !== "news_editor")) {
      return NextResponse.json({ error: "Некорректный ответ сервера" }, { status: 502 });
    }
    if ((role === "faculty" && typeof result.principal?.facultySlug !== "string") ||
        (role === "department" && typeof result.principal?.departmentSlug !== "string")) {
      return NextResponse.json({ error: "Учётная запись не привязана к подразделению" }, { status: 403 });
    }
    const response = NextResponse.json({ ok: true, redirectTo: correctAdminHome(role) });
    response.headers.set("Cache-Control", "no-store");
    response.cookies.set(SESSION_COOKIE, result.accessToken, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/",
      maxAge: Math.min(typeof result.expiresIn === "number" ? result.expiresIn : 28800, 28800),
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Не удалось подключиться к Backend на 8001" }, { status: 502 });
  }
}

