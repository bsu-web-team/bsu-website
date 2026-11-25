"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Star, Trash2 } from "lucide-react";

export type EditorialMedia = { id: number; cover: boolean; mime: string; url: string };
export default function NewsMediaPanel({ itemId, media, readOnly, onChanged }: {
  itemId: number; media: EditorialMedia[]; readOnly: boolean; onChanged: () => Promise<void>;
}) {
  const picker = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setError("");
    try {
      const selected = Array.from(files);
      if (selected.length + media.length > 8) throw new Error("Не более восьми фотографий");
      for (const file of selected) {
        if (file.size > 5 * 1024 * 1024 || file.size === 0) throw new Error("Размер каждой фотографии: до 5 МБ");
        const data = new FormData(); data.set("file", file); data.set("cover", "false");
        const response = await fetch(`/api/admin-editor-media?itemId=${itemId}&action=upload`, { method: "POST", body: data });
        if (!response.ok) { const obj = await response.json().catch(() => ({})); throw new Error(typeof obj.detail === "string" ? obj.detail : `Ошибка загрузки: HTTP ${response.status}`); }
      }
      await onChanged();
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка загрузки"); await onChanged(); }
    finally { setBusy(false); if (picker.current) picker.current.value = ""; }
  }
  async function change(action: "cover" | "delete", mediaId: number) {
    setBusy(true); setError("");
    try {
      const url = `/api/admin-editor-media?itemId=${itemId}&mediaId=${mediaId}${action === "cover" ? "&action=cover" : ""}`;
      const response = await fetch(url, { method: action === "delete" ? "DELETE" : "POST" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await onChanged();
    } catch (e) { setError(e instanceof Error ? e.message : "Ошибка изменения"); }
    finally { setBusy(false); }
  }
  return <div className="mt-4 rounded-xl bg-slate-50 p-4">
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm font-semibold">Фотографии · {media.length}/8</p>
      {!readOnly && <><input ref={picker} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => void upload(e.target.files)} />
        <button type="button" disabled={busy || media.length >= 8} onClick={() => picker.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3 py-2 text-sm text-white disabled:opacity-40"><ImagePlus size={16}/>Добавить фото</button></>}
    </div>
    {error && <p role="alert" className="my-2 text-sm text-red-700">{error}</p>}
    {media.length === 0 && <p className="text-sm text-slate-500">Пока без фотографий. Сначала сохраните черновик, затем добавьте изображения.</p>}
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{media.map(m => <div key={m.id} className="overflow-hidden rounded-lg border bg-white">
      <div className="relative aspect-[4/3]"><Image src={`/api/admin-editor-media?itemId=${itemId}&mediaId=${m.id}`} alt="Фотография новости" fill sizes="200px" unoptimized className="object-cover" /></div>
      <div className="flex flex-wrap items-center gap-1 p-2">{m.cover ? <span className="text-xs font-bold text-amber-700">Обложка</span> : !readOnly && <button type="button" disabled={busy} title="Сделать обложкой" onClick={() => void change("cover", m.id)}><Star size={17}/></button>}
      {!readOnly && <button type="button" disabled={busy} title="Удалить" className="ml-auto text-red-700" onClick={() => void change("delete", m.id)}><Trash2 size={17}/></button>}</div>
    </div>)}</div>
  </div>;
}
