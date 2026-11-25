"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

type Photo = { id: number; url: string; cover: boolean };
export default function NewsPhotoGallery({ slug }: { slug: string }) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  useEffect(() => {
    if (!/^editorial-[1-9]\d*$/.test(slug)) return;
    const controller = new AbortController();
    void fetch(`/api/news-gallery/${slug}`, { signal: controller.signal }).then(r => r.ok ? r.json() : { items: [] }).then((obj: { items?: Photo[] }) => {
      if (!controller.signal.aborted && Array.isArray(obj.items)) setPhotos(obj.items.filter(p => /^\/media\/news\/editorial-[1-9]\d*\/[1-9]\d*\.(jpg|png|webp)$/.test(p.url)));
    }).catch(() => {});
    return () => controller.abort();
  }, [slug]);
  const extra = photos.filter(x => !x.cover);
  if (!extra.length) return null;
  return <section className="mt-8"><h2 className="mb-4 text-lg font-bold">Фотографии</h2><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{extra.map(p => <div key={p.id} className="relative aspect-[4/3] overflow-hidden rounded-xl"><Image src={p.url} alt="Фотография мероприятия" fill unoptimized sizes="(max-width: 640px) 100vw, 400px" className="object-cover" /></div>)}</div></section>;
}
