"use client";
import {useLocale} from "@/components/i18n/LocaleProvider";
import {catalogText as tr} from "@/lib/catalog-i18n-v14";
export default function CatalogNoteV14(){const {locale}=useLocale();return <>{tr(locale,"programDisclaimer")}</>;}
