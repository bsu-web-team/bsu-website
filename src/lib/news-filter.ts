import type { NewsRecord } from "@/lib/news-data";
export type NewsScope = { facultySlug?: string; departmentSlug?: string };
export function matchesNewsScope(item: NewsRecord, scope: NewsScope): boolean {
  return (!scope.facultySlug || item.facultySlug === scope.facultySlug) &&
    (!scope.departmentSlug || item.departmentSlug === scope.departmentSlug);
}
export function normalizeNewsText(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/ё/g, "е").replace(/[\p{P}\p{S}]+/gu, " ").replace(/\s+/g, " ").trim();
}
export function matchesNewsQuery(query: string, values: (string | undefined)[]): boolean {
  const needle = normalizeNewsText(query).split(" ").filter(Boolean);
  const haystack = normalizeNewsText(values.filter(Boolean).join(" "));
  return needle.every(word => haystack.includes(word));
}
export function safeNewsImage(url?: string): string | undefined {
  // Local public media only. Never embed an arbitrary third-party tracking URL.
  return url && /^\/(?:media|images|news)\/[a-zA-Z0-9_%./-]+\.(?:webp|avif|png|jpe?g)$/i.test(url) && !url.includes("..") && !url.includes("%") && !url.includes("//") ? url : undefined;
}
