"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
export default function AdminLogout() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  if (pathname === "/admin/login") return null;
  async function logout() {
    if (busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin-auth/logout", { method: "POST", cache: "no-store" });
      if (!response.ok) throw new Error("Logout failed");
      router.replace("/admin/login"); router.refresh();
    } catch { window.alert("Не удалось завершить сессию. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  }
  return <button type="button" onClick={logout} disabled={busy} className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#153d70] px-5 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#235aa2] disabled:opacity-50"><LogOut size={16}/>{busy ? "Выход…" : "Выйти"}</button>;
}
