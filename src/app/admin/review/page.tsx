import { notFound } from "next/navigation";
import type { Metadata } from "next";
import EditorialDemo from "@/components/admin/EditorialDemo";
export const metadata: Metadata = { title: "ЦЦР · Проверка новостей — БГУ", robots: { index: false, follow: false } };
export default function CCRReviewPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <EditorialDemo role="review" />;
}
