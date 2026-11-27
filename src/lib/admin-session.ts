import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminRole = "ccr" | "faculty" | "department" | "news_editor";
export type AdminPrincipal = {
  username: string;
  role: AdminRole;
  facultySlug?: string | null;
  departmentSlug?: string | null;
};
/** Production admin is opt-in and requires an HTTPS auth backend. */
export function adminAccessEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return true;
  const apiBase = process.env.BSU_ADMIN_API_BASE_URL;
  return process.env.BSU_ADMIN_PRODUCTION_ENABLED === "true" &&
    typeof apiBase === "string" && /^https:\/\/[^\s/]+/.test(apiBase);
}

export const SESSION_COOKIE = "bsu_admin_session_dev";
export const adminApiBase = () => process.env.BSU_ADMIN_API_BASE_URL || "http://127.0.0.1:8001/api/v1";

function isPrincipal(value: unknown): value is AdminPrincipal {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return typeof p.username === "string" &&
    (p.role === "ccr" || p.role === "faculty" || p.role === "department" || p.role === "news_editor") &&
    (p.role !== "faculty" || typeof p.facultySlug === "string") &&
    (p.role !== "department" || typeof p.departmentSlug === "string");
}

export async function adminPrincipal(): Promise<AdminPrincipal | null> {
  if (!adminAccessEnabled()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const response = await fetch(`${adminApiBase()}/admin-auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const value: unknown = await response.json();
    return isPrincipal(value) ? value : null;
  } catch {
    return null;
  }
}

export async function requireAdminRole(role: AdminRole): Promise<AdminPrincipal> {
  if (!adminAccessEnabled()) redirect("/");
  const principal = await adminPrincipal();
  if (!principal) redirect("/admin/login");
  if (principal.role !== role) {
    redirect(correctAdminHome(principal.role));
  }
  return principal;
}

export function correctAdminHome(role: AdminRole): string {
  return role === "ccr" ? "/admin" : role === "news_editor" ? "/admin/editor" : `/admin/${role}`;
}

export function allowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    const url = new URL(origin);
    const forwardedProto = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
    return (url.protocol === "http:" || url.protocol === "https:") &&
      url.host === host && url.protocol === `${forwardedProto}:`;
  } catch { return false; }
}
