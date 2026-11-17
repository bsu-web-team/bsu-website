"use client";
import { useLocale } from "@/components/i18n/LocaleProvider";
const labels = {
  ru: { home:"Главная", catalog:"Архив материалов БГУ", source:"Материал перенесён с прежнего сайта. Актуальность проверяет ЦЦР.", original:"Язык оригинала", links:"Связанные материалы", files:"Открыть файл" },
  ky: { home:"Башкы бет", catalog:"БМУнун материалдар архиви", source:"Мурунку сайттан көчүрүлгөн материал. Актуалдуулугун санариптик өнүктүрүү борбору текшерет.", original:"Түп нусканын тили", links:"Байланыштуу материалдар", files:"Файлды ачуу" },
  en: { home:"Home", catalog:"BSU materials archive", source:"Migrated from the previous website. The digital development center reviews its accuracy.", original:"Original language", links:"Related materials", files:"Open file" },
  "zh-CN": { home:"首页", catalog:"大学资料档案", source:"资料迁移自原网站，由数字发展中心审核其时效性。", original:"原文语言", links:"相关资料", files:"打开文件" },
};
export default function MigrationLabel({name}:{name:keyof typeof labels.ru}) {const {locale}=useLocale();return <>{labels[locale][name]}</>;}
