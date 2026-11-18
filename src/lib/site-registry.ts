// BSU Architecture v1
export type SiteEntry={route:string;parent:string|null;template:string;titles:Record<"ru"|"ky"|"en"|"zh-CN",string>;implementation:string;content:string;translations:string};
export const siteRegistry:SiteEntry[]=[
  {
    "route": "/",
    "parent": null,
    "template": "home",
    "titles": {
      "ru": "Главная",
      "ky": "Башкы бет",
      "en": "Home",
      "zh-CN": "首页"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Университет",
      "ky": "Университет",
      "en": "University",
      "zh-CN": "大学概况"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/history",
    "parent": "/about",
    "template": "article",
    "titles": {
      "ru": "История",
      "ky": "Тарых",
      "en": "History",
      "zh-CN": "历史"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/mission",
    "parent": "/about",
    "template": "article",
    "titles": {
      "ru": "Миссия",
      "ky": "Миссия",
      "en": "Mission",
      "zh-CN": "使命"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/leadership",
    "parent": "/about",
    "template": "directory",
    "titles": {
      "ru": "Ректорат",
      "ky": "Ректорат",
      "en": "Leadership",
      "zh-CN": "校领导"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/rector",
    "parent": "/about",
    "template": "article",
    "titles": {
      "ru": "Приветствие ректора",
      "ky": "Ректордун кайрылуусу",
      "en": "Rector’s welcome",
      "zh-CN": "校长致辞"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/academic-council",
    "parent": "/about",
    "template": "unit",
    "titles": {
      "ru": "Учёный совет",
      "ky": "Окумуштуулар кеңеши",
      "en": "Academic council",
      "zh-CN": "学术委员会"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/structure",
    "parent": "/about",
    "template": "hub",
    "titles": {
      "ru": "Структура университета",
      "ky": "Университеттин түзүмү",
      "en": "University structure",
      "zh-CN": "组织结构"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/administration",
    "parent": "/about",
    "template": "directory",
    "titles": {
      "ru": "Административные подразделения",
      "ky": "Административдик бөлүмдөр",
      "en": "Administrative departments",
      "zh-CN": "行政部门"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/administration/hr",
    "parent": "/about/administration",
    "template": "unit",
    "titles": {
      "ru": "Отдел кадров",
      "ky": "Кадрлар бөлүмү",
      "en": "Human resources",
      "zh-CN": "人事处"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/administration/finance",
    "parent": "/about/administration",
    "template": "unit",
    "titles": {
      "ru": "Планово-финансовый отдел",
      "ky": "Пландоо жана каржы бөлүмү",
      "en": "Planning and finance",
      "zh-CN": "计划财务处"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/administration/academic-office",
    "parent": "/about/administration",
    "template": "unit",
    "titles": {
      "ru": "Учебный отдел",
      "ky": "Окуу бөлүмү",
      "en": "Academic office",
      "zh-CN": "教务处"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/administration/quality-careers",
    "parent": "/about/administration",
    "template": "unit",
    "titles": {
      "ru": "Отдел качества, практики и карьеры",
      "ky": "Сапат, практика жана карьера бөлүмү",
      "en": "Quality, internships and careers",
      "zh-CN": "质量与实习就业处"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/administration/culture",
    "parent": "/about/administration",
    "template": "unit",
    "titles": {
      "ru": "Отдел культуры и работы с молодёжью",
      "ky": "Маданият жана жаштар менен иштөө бөлүмү",
      "en": "Culture and youth affairs",
      "zh-CN": "文化与青年事务处"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/quality-council",
    "parent": "/about",
    "template": "unit",
    "titles": {
      "ru": "Совет по качеству",
      "ky": "Сапат кеңеши",
      "en": "Quality council",
      "zh-CN": "质量委员会"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/alumni",
    "parent": "/about",
    "template": "unit",
    "titles": {
      "ru": "Ассоциация выпускников",
      "ky": "Бүтүрүүчүлөр ассоциациясы",
      "en": "Alumni association",
      "zh-CN": "校友协会"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/about/vacancies",
    "parent": "/about",
    "template": "directory",
    "titles": {
      "ru": "Вакансии",
      "ky": "Бош орундар",
      "en": "Vacancies",
      "zh-CN": "招聘"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/education",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Образование",
      "ky": "Билим берүү",
      "en": "Education",
      "zh-CN": "教育"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/faculties",
    "parent": "/education",
    "template": "directory",
    "titles": {
      "ru": "Факультеты и институты",
      "ky": "Факультеттер жана институттар",
      "en": "Faculties and institutes",
      "zh-CN": "学院与研究所"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/departments",
    "parent": "/education",
    "template": "directory",
    "titles": {
      "ru": "Кафедры",
      "ky": "Кафедралар",
      "en": "Departments",
      "zh-CN": "系"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/staff",
    "parent": "/education",
    "template": "directory",
    "titles": {
      "ru": "Преподаватели",
      "ky": "Окутуучулар",
      "en": "Faculty and staff",
      "zh-CN": "教职员工"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/programs",
    "parent": "/education",
    "template": "directory",
    "titles": {
      "ru": "Программы",
      "ky": "Программалар",
      "en": "Programs",
      "zh-CN": "专业目录"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/education/bachelor",
    "parent": "/education",
    "template": "hub",
    "titles": {
      "ru": "Бакалавриат",
      "ky": "Бакалавриат",
      "en": "Bachelor’s studies",
      "zh-CN": "本科"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/education/master",
    "parent": "/education",
    "template": "hub",
    "titles": {
      "ru": "Магистратура",
      "ky": "Магистратура",
      "en": "Master’s studies",
      "zh-CN": "硕士"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/education/phd",
    "parent": "/education",
    "template": "hub",
    "titles": {
      "ru": "Докторантура PhD",
      "ky": "PhD докторантурасы",
      "en": "PhD studies",
      "zh-CN": "博士"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/education/curricula",
    "parent": "/education",
    "template": "documents",
    "titles": {
      "ru": "Учебные планы",
      "ky": "Окуу пландары",
      "en": "Curricula",
      "zh-CN": "培养方案"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/education/electives",
    "parent": "/education",
    "template": "directory",
    "titles": {
      "ru": "Элективные дисциплины",
      "ky": "Тандоо дисциплиналары",
      "en": "Elective courses",
      "zh-CN": "选修课程"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/education/methodical-council",
    "parent": "/education",
    "template": "unit",
    "titles": {
      "ru": "Учебно-методический совет",
      "ky": "Окуу-усулдук кеңеш",
      "en": "Teaching and methodological council",
      "zh-CN": "教学指导委员会"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/academic-calendar",
    "parent": "/education",
    "template": "documents",
    "titles": {
      "ru": "Академический календарь",
      "ky": "Академиялык календарь",
      "en": "Academic calendar",
      "zh-CN": "校历"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/schedule",
    "parent": "/education",
    "template": "service",
    "titles": {
      "ru": "Расписание",
      "ky": "Жадыбал",
      "en": "Schedule",
      "zh-CN": "课程表"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/continuing-education",
    "parent": "/education",
    "template": "hub",
    "titles": {
      "ru": "Дополнительное образование",
      "ky": "Кошумча билим берүү",
      "en": "Continuing education",
      "zh-CN": "继续教育"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/continuing-education/courses",
    "parent": "/continuing-education",
    "template": "directory",
    "titles": {
      "ru": "Курсы",
      "ky": "Курстар",
      "en": "Courses",
      "zh-CN": "课程"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/continuing-education/apply",
    "parent": "/continuing-education",
    "template": "service",
    "titles": {
      "ru": "Запись на обучение",
      "ky": "Окууга жазылуу",
      "en": "Course application",
      "zh-CN": "课程报名"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/admissions",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Поступление",
      "ky": "Окууга кабыл алуу",
      "en": "Admissions",
      "zh-CN": "招生"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/admissions/rules",
    "parent": "/admissions",
    "template": "article",
    "titles": {
      "ru": "Правила поступления",
      "ky": "Кабыл алуу эрежелери",
      "en": "Admission rules",
      "zh-CN": "招生规定"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/admissions/documents",
    "parent": "/admissions",
    "template": "documents",
    "titles": {
      "ru": "Необходимые документы",
      "ky": "Керектүү документтер",
      "en": "Required documents",
      "zh-CN": "申请材料"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/admissions/tuition",
    "parent": "/admissions",
    "template": "article",
    "titles": {
      "ru": "Стоимость обучения",
      "ky": "Окуу акысы",
      "en": "Tuition",
      "zh-CN": "学费"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/admissions/international",
    "parent": "/admissions",
    "template": "article",
    "titles": {
      "ru": "Иностранным абитуриентам",
      "ky": "Чет өлкөлүк абитуриенттерге",
      "en": "International applicants",
      "zh-CN": "国际申请者"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/admissions/faq",
    "parent": "/admissions",
    "template": "article",
    "titles": {
      "ru": "Частые вопросы",
      "ky": "Көп берилүүчү суроолор",
      "en": "FAQ",
      "zh-CN": "常见问题"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/admissions/apply",
    "parent": "/admissions",
    "template": "service",
    "titles": {
      "ru": "Регистрация абитуриентов",
      "ky": "Абитуриенттерди каттоо",
      "en": "Applicant registration",
      "zh-CN": "申请者注册"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/college",
    "parent": "/admissions",
    "template": "hub",
    "titles": {
      "ru": "Колледж БГУ",
      "ky": "БМУнун колледжи",
      "en": "BSU College",
      "zh-CN": "大学附属学院"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/college/administration",
    "parent": "/college",
    "template": "unit",
    "titles": {
      "ru": "Администрация колледжа",
      "ky": "Колледждин администрациясы",
      "en": "College administration",
      "zh-CN": "学院管理部门"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/college/programs",
    "parent": "/college",
    "template": "directory",
    "titles": {
      "ru": "Специальности колледжа",
      "ky": "Колледждин адистиктери",
      "en": "College programs",
      "zh-CN": "学院专业"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/college/admissions",
    "parent": "/college",
    "template": "article",
    "titles": {
      "ru": "Поступление в колледж",
      "ky": "Колледжге кабыл алуу",
      "en": "College admissions",
      "zh-CN": "学院招生"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Наука",
      "ky": "Илим",
      "en": "Research",
      "zh-CN": "科研"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/research",
    "parent": "/science",
    "template": "directory",
    "titles": {
      "ru": "Исследования",
      "ky": "Изилдөөлөр",
      "en": "Research projects",
      "zh-CN": "研究项目"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/conferences",
    "parent": "/science",
    "template": "directory",
    "titles": {
      "ru": "Конференции",
      "ky": "Конференциялар",
      "en": "Conferences",
      "zh-CN": "学术会议"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/publications",
    "parent": "/science",
    "template": "directory",
    "titles": {
      "ru": "Публикации",
      "ky": "Жарыяланымдар",
      "en": "Publications",
      "zh-CN": "科研出版物"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/dissertation-councils",
    "parent": "/science",
    "template": "unit",
    "titles": {
      "ru": "Диссертационные советы",
      "ky": "Диссертациялык кеңештер",
      "en": "Dissertation councils",
      "zh-CN": "学位论文委员会"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/research-office",
    "parent": "/science",
    "template": "unit",
    "titles": {
      "ru": "Управление НИР",
      "ky": "Илимий иштер башкармалыгы",
      "en": "Research office",
      "zh-CN": "科研管理处"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/young-researchers",
    "parent": "/science",
    "template": "unit",
    "titles": {
      "ru": "Совет молодых учёных",
      "ky": "Жаш окумуштуулар кеңеши",
      "en": "Young researchers",
      "zh-CN": "青年科研人员委员会"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/student-research",
    "parent": "/science",
    "template": "directory",
    "titles": {
      "ru": "Студенческая наука",
      "ky": "Студенттик илим",
      "en": "Student research",
      "zh-CN": "学生科研"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/journals",
    "parent": "/science",
    "template": "directory",
    "titles": {
      "ru": "Научные журналы",
      "ky": "Илимий журналдар",
      "en": "Academic journals",
      "zh-CN": "学术期刊"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/journals/vestnik",
    "parent": "/science/journals",
    "template": "documents",
    "titles": {
      "ru": "Вестник БГУ",
      "ky": "БМУнун жарчысы",
      "en": "BSU Bulletin",
      "zh-CN": "大学学报"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/journals/izvestia",
    "parent": "/science/journals",
    "template": "documents",
    "titles": {
      "ru": "Известия БГУ",
      "ky": "БМУнун кабарлары",
      "en": "BSU Proceedings",
      "zh-CN": "大学科研通讯"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/journals/problems",
    "parent": "/science/journals",
    "template": "documents",
    "titles": {
      "ru": "Проблемы социально-экономических и гуманитарных наук",
      "ky": "Социалдык-экономикалык жана гуманитардык илимдердин көйгөйлөрү",
      "en": "Social, economic and humanities issues",
      "zh-CN": "社会经济与人文学科问题"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/antiplagiarism",
    "parent": "/science",
    "template": "article",
    "titles": {
      "ru": "Антиплагиат",
      "ky": "Антиплагиат",
      "en": "Academic integrity",
      "zh-CN": "学术诚信"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/science/business",
    "parent": "/science",
    "template": "service",
    "titles": {
      "ru": "Наука для бизнеса",
      "ky": "Бизнес үчүн илим",
      "en": "Research for business",
      "zh-CN": "产学合作"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Международное сотрудничество",
      "ky": "Эл аралык кызматташтык",
      "en": "International cooperation",
      "zh-CN": "国际合作"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/office",
    "parent": "/international",
    "template": "unit",
    "titles": {
      "ru": "Отдел международных связей",
      "ky": "Эл аралык байланыштар бөлүмү",
      "en": "International office",
      "zh-CN": "国际交流处"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/partners",
    "parent": "/international",
    "template": "directory",
    "titles": {
      "ru": "Партнёры",
      "ky": "Өнөктөштөр",
      "en": "Partners",
      "zh-CN": "合作伙伴"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/mobility",
    "parent": "/international",
    "template": "directory",
    "titles": {
      "ru": "Академическая мобильность",
      "ky": "Академиялык мобилдүүлүк",
      "en": "Academic mobility",
      "zh-CN": "学术交流"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/grants",
    "parent": "/international",
    "template": "directory",
    "titles": {
      "ru": "Программы и гранты",
      "ky": "Программалар жана гранттар",
      "en": "Programs and grants",
      "zh-CN": "项目与资助"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/projects",
    "parent": "/international",
    "template": "directory",
    "titles": {
      "ru": "Международные проекты",
      "ky": "Эл аралык долбоорлор",
      "en": "International projects",
      "zh-CN": "国际项目"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/centers",
    "parent": "/international",
    "template": "directory",
    "titles": {
      "ru": "Центры и офисы",
      "ky": "Борборлор жана кеңселер",
      "en": "Centers and offices",
      "zh-CN": "中心与办公室"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/education-center",
    "parent": "/international",
    "template": "unit",
    "titles": {
      "ru": "Международный образовательный институт",
      "ky": "Эл аралык билим берүү институту",
      "en": "International Education Institute",
      "zh-CN": "国际教育学院"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/language-courses",
    "parent": "/international/education-center",
    "template": "directory",
    "titles": {
      "ru": "Языковые курсы",
      "ky": "Тил курстары",
      "en": "Language courses",
      "zh-CN": "语言课程"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/visa",
    "parent": "/international/education-center",
    "template": "article",
    "titles": {
      "ru": "Визовая поддержка",
      "ky": "Виза боюнча колдоо",
      "en": "Visa support",
      "zh-CN": "签证支持"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/international/honorary-professors",
    "parent": "/international",
    "template": "directory",
    "titles": {
      "ru": "Почётные профессора",
      "ky": "Ардактуу профессорлор",
      "en": "Honorary professors",
      "zh-CN": "荣誉教授"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/student-life",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Студентам",
      "ky": "Студенттерге",
      "en": "Students",
      "zh-CN": "学生服务"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/student-life/clubs",
    "parent": "/student-life",
    "template": "directory",
    "titles": {
      "ru": "Студенческие организации",
      "ky": "Студенттик уюмдар",
      "en": "Student organizations",
      "zh-CN": "学生组织"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/student-life/careers",
    "parent": "/student-life",
    "template": "hub",
    "titles": {
      "ru": "Практика и карьера",
      "ky": "Практика жана карьера",
      "en": "Internships and careers",
      "zh-CN": "实习与就业"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/dormitories",
    "parent": "/student-life",
    "template": "article",
    "titles": {
      "ru": "Общежития",
      "ky": "Жатаканалар",
      "en": "Dormitories",
      "zh-CN": "宿舍"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/library",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Библиотека",
      "ky": "Китепкана",
      "en": "Library",
      "zh-CN": "图书馆"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/library/books",
    "parent": "/library",
    "template": "directory",
    "titles": {
      "ru": "Книги БГУ",
      "ky": "БМУнун китептери",
      "en": "BSU books",
      "zh-CN": "大学图书"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/library/resources",
    "parent": "/library",
    "template": "directory",
    "titles": {
      "ru": "Электронные ресурсы",
      "ky": "Электрондук ресурстар",
      "en": "Electronic resources",
      "zh-CN": "电子资源"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/news",
    "parent": "/",
    "template": "directory",
    "titles": {
      "ru": "Новости",
      "ky": "Жаңылыктар",
      "en": "News",
      "zh-CN": "新闻"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/news/events",
    "parent": "/news",
    "template": "directory",
    "titles": {
      "ru": "Мероприятия",
      "ky": "Иш-чаралар",
      "en": "Events",
      "zh-CN": "活动"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/news/announcements",
    "parent": "/news",
    "template": "directory",
    "titles": {
      "ru": "Объявления",
      "ky": "Кулактандыруулар",
      "en": "Announcements",
      "zh-CN": "公告"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/documents",
    "parent": "/",
    "template": "documents",
    "titles": {
      "ru": "Документы",
      "ky": "Документтер",
      "en": "Documents",
      "zh-CN": "文件"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/documents/accreditation",
    "parent": "/documents",
    "template": "documents",
    "titles": {
      "ru": "Аккредитация",
      "ky": "Аккредитация",
      "en": "Accreditation",
      "zh-CN": "认证"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/documents/licenses",
    "parent": "/documents",
    "template": "documents",
    "titles": {
      "ru": "Лицензии",
      "ky": "Лицензиялар",
      "en": "Licenses",
      "zh-CN": "许可证"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/documents/regulations",
    "parent": "/documents",
    "template": "documents",
    "titles": {
      "ru": "Положения БГУ",
      "ky": "БМУнун жоболору",
      "en": "University regulations",
      "zh-CN": "大学规章"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/documents/national",
    "parent": "/documents",
    "template": "documents",
    "titles": {
      "ru": "Нормативные документы КР",
      "ky": "КРнын ченемдик документтери",
      "en": "National regulations",
      "zh-CN": "国家法规"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/services",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Электронные сервисы",
      "ky": "Электрондук кызматтар",
      "en": "Digital services",
      "zh-CN": "在线服务"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/services/avn",
    "parent": "/services",
    "template": "service",
    "titles": {
      "ru": "АВН",
      "ky": "АВН",
      "en": "AVN",
      "zh-CN": "AVN"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/services/support",
    "parent": "/services",
    "template": "service",
    "titles": {
      "ru": "Техническая поддержка",
      "ky": "Техникалык колдоо",
      "en": "Technical support",
      "zh-CN": "技术支持"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/contacts",
    "parent": "/",
    "template": "article",
    "titles": {
      "ru": "Контакты",
      "ky": "Байланыштар",
      "en": "Contacts",
      "zh-CN": "联系方式"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/search",
    "parent": "/",
    "template": "directory",
    "titles": {
      "ru": "Поиск",
      "ky": "Издөө",
      "en": "Search",
      "zh-CN": "搜索"
    },
    "implementation": "existing",
    "content": "review",
    "translations": "review"
  },
  {
    "route": "/site-map",
    "parent": "/",
    "template": "hub",
    "titles": {
      "ru": "Карта сайта",
      "ky": "Сайттын картасы",
      "en": "Site map",
      "zh-CN": "网站地图"
    },
    "implementation": "scaffold",
    "content": "review",
    "translations": "review"
  }
];
