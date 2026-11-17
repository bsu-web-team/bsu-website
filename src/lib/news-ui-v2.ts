import type { Locale } from "@/lib/i18n";
export const newsV2: Record<Locale, {
 faculty:string; department:string; allFaculties:string; allDepartments:string;
 year:string; month:string; allYears:string; allMonths:string; reset:string;
 general:string; unitNews:string; noUnitNews:string; openAll:string; more:string;
 showMore:string; results:string; featured:string; preview:string; allNews:string;
}> = {
 ru:{faculty:"Факультет / институт",department:"Кафедра",allFaculties:"Все подразделения",allDepartments:"Все кафедры",year:"Год",month:"Месяц",allYears:"Все годы",allMonths:"Все месяцы",reset:"Сбросить фильтры",general:"Без привязки к подразделению",unitNews:"Новости подразделения",noUnitNews:"Пока нет опубликованных новостей этого подразделения.",openAll:"Все новости подразделения",more:"Читать далее",showMore:"Показать ещё",results:"Показано",featured:"Последняя публикация",preview:"Фото публикации",allNews:"Все новости"},
 ky:{faculty:"Факультет / институт",department:"Кафедра",allFaculties:"Бардык бөлүмдөр",allDepartments:"Бардык кафедралар",year:"Жыл",month:"Ай",allYears:"Бардык жылдар",allMonths:"Бардык айлар",reset:"Чыпкаларды тазалоо",general:"Бөлүмү көрсөтүлгөн эмес",unitNews:"Бөлүмдүн жаңылыктары",noUnitNews:"Бул бөлүмдүн жарыяланган жаңылыктары азырынча жок.",openAll:"Бөлүмдүн бардык жаңылыктары",more:"Толук окуу",showMore:"Дагы көрсөтүү",results:"Көрсөтүлдү",featured:"Акыркы жарыя",preview:"Жарыянын сүрөтү",allNews:"Бардык жаңылыктар"},
 en:{faculty:"Faculty / institute",department:"Department",allFaculties:"All units",allDepartments:"All departments",year:"Year",month:"Month",allYears:"All years",allMonths:"All months",reset:"Reset filters",general:"No unit assigned",unitNews:"Department and faculty news",noUnitNews:"No published news from this unit yet.",openAll:"All news from this unit",more:"Read more",showMore:"Show more",results:"Showing",featured:"Latest publication",preview:"Publication image",allNews:"All news"},
 "zh-CN":{faculty:"学院 / 研究所",department:"系",allFaculties:"全部部门",allDepartments:"全部系",year:"年份",month:"月份",allYears:"全部年份",allMonths:"全部月份",reset:"重置筛选",general:"未关联部门",unitNews:"部门新闻",noUnitNews:"本部门暂无已发布新闻。",openAll:"查看本部门全部新闻",more:"阅读更多",showMore:"显示更多",results:"已显示",featured:"最新发布",preview:"新闻图片",allNews:"全部新闻"}
};
