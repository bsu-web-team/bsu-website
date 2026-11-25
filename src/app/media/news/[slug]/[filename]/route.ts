import { NextResponse } from "next/server";
type Context = { params: Promise<{ slug: string; filename: string }> };
export async function GET(_req: Request, { params }: Context) {
  const { slug, filename } = await params;
  if (!/^editorial-[1-9]\d*$/.test(slug) || !/^[1-9]\d*\.(jpg|png|webp)$/.test(filename)) return new Response(null, { status: 404 });
  const base = process.env.BSU_API_BASE_URL;
  if (process.env.BSU_DATA_SOURCE !== "backend" || !base) return new Response(null, { status: 404 });
  const media = filename.slice(0, filename.lastIndexOf("."));
  try {
    const response = await fetch(`${base.replace(/\/$/, "")}/news/${slug}/media/${media}`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) return new Response(null, { status: response.status });
    const mime = response.headers.get("content-type") || "";
    if (!["image/jpeg", "image/png", "image/webp"].includes(mime)) return new Response(null, { status: 502 });
    return new Response(response.body, { headers: { "Content-Type": mime, "Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff" } });
  } catch { return NextResponse.json({ error: "Image unavailable" }, { status: 502 }); }
}
