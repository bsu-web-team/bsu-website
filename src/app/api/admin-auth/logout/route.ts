import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminApiBase, allowedOrigin, SESSION_COOKIE, adminAccessEnabled } from "@/lib/admin-session";

export async function POST(request: Request) {
  if (!adminAccessEnabled()) return NextResponse.json({ error: "Not available" }, { status: 404 });
  if (!allowedOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) {
    try {
      await fetch(`${adminApiBase()}/admin-auth/logout`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
        cache: "no-store", signal: AbortSignal.timeout(5000),
      });
    } catch { /* Expire the browser cookie even when Backend is unreachable. */ }
  }
  const response = NextResponse.json({ ok: true });
  response.headers.set("Cache-Control", "no-store");
  response.cookies.delete(SESSION_COOKIE);
  return response;
}
