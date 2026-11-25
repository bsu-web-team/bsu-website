import { cacheLife } from "next/cache";

export type ApprovedUnitProfile = {
  published: true;
  description: string;
  contact: string;
};

/** Opt-in TEST overlay. The existing V7.4 public API stays unchanged. */
export async function getApprovedUnitProfile(
  kind: "faculty" | "department", slug: string,
): Promise<ApprovedUnitProfile | null> {
  "use cache";
  cacheLife("minutes");
  const configured = process.env.BSU_UNIT_PUBLICATION_BASE_URL;
  if (!configured) return null;
  try {
    const root = new URL(configured.replace(/\/+$/, "") + "/");
    if (!["http:", "https:"].includes(root.protocol) || root.username || root.password || root.search || root.hash) return null;
    const url = new URL(`admin-unit-profiles/published/${kind}/${encodeURIComponent(slug)}`, root);
    const r = await fetch(url, { signal: AbortSignal.timeout(6000), headers: { Accept: "application/json" } });
    if (!r.ok) return null;
    const value: unknown = await r.json();
    if (typeof value !== "object" || value === null || Array.isArray(value)) return null;
    const data = value as Record<string, unknown>;
    if (data.published !== true || typeof data.description !== "string" || typeof data.contact !== "string") return null;
    return { published: true, description: data.description, contact: data.contact };
  } catch {
    // Fail closed to baseline content if the test-only publication service is down.
    return null;
  }
}
