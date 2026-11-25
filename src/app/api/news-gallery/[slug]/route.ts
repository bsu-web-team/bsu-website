import { NextResponse } from "next/server";

type Context = { params: Promise<{ slug: string }> };
export async function GET(_req: Request, { params }: Context) {
  const { slug } = await params;
  if (!/^editorial-[1-9]\d*$/.test(slug)) return NextResponse.json({ items: [] });
  const base = process.env.BSU_API_BASE_URL;
  if (process.env.BSU_DATA_SOURCE !== "backend" || !base) return NextResponse.json({ items: [] });
  try {
    const upstream = await fetch(`${base.replace(/\/$/, "")}/news/${slug}/gallery`, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) return NextResponse.json({ items: [] }, { status: upstream.status });
    const body: unknown = await upstream.json();
    return NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });
  } catch { return NextResponse.json({ items: [] }, { status: 502 }); }
}
