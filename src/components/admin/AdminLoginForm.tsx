"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn, ShieldCheck } from "lucide-react";

export default function AdminLoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin-auth/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }), cache: "no-store",
      });
      const result: { error?: string; redirectTo?: string } = await response.json();
      if (!response.ok || !result.redirectTo) { setError(result.error || "Вход не выполнен"); return; }
      setPassword("");
      router.replace(result.redirectTo);
      router.refresh();
    } catch { setError("Не удалось подключиться к серверу"); }
    finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-[#f2f5fa] px-4 py-12 text-slate-900">
    <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
      <div className="bg-[#153d70] px-8 py-8 text-white"><div className="flex items-center gap-3"><span className="rounded-xl bg-white/10 p-3"><ShieldCheck size={27}/></span><div><p className="text-xs tracking-[.22em] text-blue-200">БГУ · АДМИНИСТРИРОВАНИЕ</p><h1 className="mt-1 text-2xl font-bold">Вход в кабинет</h1></div></div><p className="mt-5 text-sm text-blue-100">ЦЦР, факультеты и кафедры входят через персональные учётные записи.</p></div>
      <form onSubmit={submit} className="space-y-5 p-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">Тестовая авторизация V8.10. Доступна только локально. Редактирование новостей остаётся демонстрационным.</div>
        <label className="block text-sm font-semibold">Логин<input autoComplete="username" required maxLength={100} value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600" placeholder="Например, ccr-test" /></label>
        <label className="block text-sm font-semibold">Пароль<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-blue-600" placeholder="Введите пароль" /></label>
        {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
        <button disabled={busy} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#235aa2] px-4 py-3 font-semibold text-white hover:bg-[#174882] disabled:opacity-50">{busy ? <LockKeyhole size={18}/> : <LogIn size={18}/>} {busy ? "Проверяем…" : "Войти"}</button>
      </form>
    </div>
  </main>;
}
