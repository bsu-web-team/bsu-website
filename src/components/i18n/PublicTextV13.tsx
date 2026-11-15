"use client";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { publicV13Text } from "@/lib/public-v13-i18n";
import { displayPersonName } from "@/lib/catalog-i18n-v14";

export default function PublicTextV13({ value }: { value: string }) {
  const { locale } = useLocale();
  return <>{publicV13Text(value, locale)}</>;
}

export function PublicPersonV13({ name }: { name: string }) {
  const { locale } = useLocale();
  return <>{displayPersonName(name, locale)}</>;
}
