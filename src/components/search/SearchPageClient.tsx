'use client';
import {useSearchParams} from 'next/navigation';
import {useLocale} from '@/components/i18n/LocaleProvider';
import SearchExperience from './SearchExperience';
export default function SearchPageClient(){const params=useSearchParams();const {locale}=useLocale();const query=params.get('q')??'';return <section className="mx-auto max-w-4xl px-5 py-14 sm:px-8"><p className="text-xs font-bold tracking-widest text-[#88672f]">BSU SEARCH</p><h1 className="mb-8 mt-3 text-3xl font-extrabold text-[#102b4e] sm:text-5xl">{{ru:'Поиск по университету',ky:'Университет боюнча издөө',en:'Search the university','zh-CN':'搜索大学网站'}[locale]}</h1><SearchExperience key={query} initialQuery={query}/></section>}
