import type { Locale } from "@/lib/i18n";
/** Draft translations: source data and links remain untouched. */
export type AboutText = {
  home: string;
  about: string;
  university: string;
  eyebrow: string;
  intro: string;
  explore: string;
  go: string;
  sourceIntro: string;
  history: string;
  historyIntro: string;
  historySource: string;
  mission: string;
  ourMission: string;
  missionText: string;
  missionNote: string;
  principles: string;
  priorities: string;
  officialSource: string;
  leadership: string;
  leadershipIntro: string;
  leadershipNote: string;
  administration: string;
  roleRector: string;
  roleAcademic: string;
  roleScience: string;
  roleInternational: string;
  cards: string[][];
  events: string[][];
  principleItems: string[];
  priorityItems: string[];
};
export const aboutUi: Record<Locale, AboutText> = {
  "ru": {
    "home": "Главная",
    "about": "Об университете",
    "university": "Бишкекский государственный университет имени академика Кусеина Карасаева",
    "eyebrow": "БГУ имени К. Карасаева",
    "intro": "Бишкекский государственный университет имени академика Кусеина Карасаева — образовательное и научное учреждение с историей, начавшейся в 1979 году.",
    "explore": "Знакомство с БГУ",
    "go": "Перейти",
    "sourceIntro": "Сведения для предварительного переноса со старого сайта БГУ. Перед официальным запуском необходима редакторская проверка.",
    "history": "История БГУ",
    "historyIntro": "Ключевые этапы становления университета",
    "historySource": "Историческая справка на старом сайте БГУ",
    "mission": "Миссия университета",
    "ourMission": "Наша миссия",
    "missionText": "Подготовка специалистов с гуманитарным и социально-экономическим образованием, отвечающих национальным интересам страны и конкурентоспособных на современном рынке труда.",
    "missionNote": "По сведениям прежнего сайта: переутверждена Учёным советом, протокол № 3 от 1 декабря 2023 года.",
    "principles": "Принципы",
    "priorities": "Приоритеты",
    "officialSource": "Официальный источник",
    "leadership": "Руководство БГУ",
    "leadershipIntro": "Предварительные сведения из опубликованной структуры ректората. Состав и полномочия требуют подтверждения перед официальным запуском.",
    "leadershipNote": "Список неполный. Для актуализации используйте страницу администрации университета на прежнем сайте.",
    "administration": "Администрация университета",
    "roleRector": "Ректор",
    "roleAcademic": "Проректор по учебной работе",
    "roleScience": "Проректор по научной работе",
    "roleInternational": "Проректор по международным связям и инвестициям",
    "cards": [
      [
        "История университета",
        "От педагогического института 1979 года до современного БГУ.",
        "/about/history"
      ],
      [
        "Миссия и ценности",
        "Приоритеты, принципы деятельности и стратегические ориентиры.",
        "/about/mission"
      ],
      [
        "Руководство",
        "Ректорат и контактная информация руководства.",
        "/about/leadership"
      ],
      [
        "Факультеты и институты",
        "Академическая структура университета.",
        "/faculties"
      ],
      [
        "Образовательные программы",
        "Направления подготовки и уровни образования.",
        "/programs"
      ],
      [
        "Контакты",
        "Адрес университета, номера телефонов и электронная почта.",
        "/contacts"
      ]
    ],
    "events": [
      [
        "Основание института",
        "29 мая учреждён Педагогический институт русского языка и литературы (ПИРЯЛ)."
      ],
      [
        "Институт языков и гуманитарных наук",
        "17 июня учреждён Государственный институт языков и гуманитарных наук."
      ],
      [
        "Бишкекский гуманитарный университет",
        "11 мая институт преобразован в Бишкекский гуманитарный университет."
      ],
      [
        "Имя академика Кусеина Карасаева",
        "29 июня университету присвоено имя академика Кусеина Карасаева."
      ]
    ],
    "principleItems": [
      "Динамичное развитие",
      "Международное признание",
      "Гибкость",
      "Доступность",
      "Востребованность на рынке труда"
    ],
    "priorityItems": [
      "Повышение качества образования",
      "Модернизация образовательных программ",
      "Внедрение современных образовательных технологий",
      "Развитие научно-исследовательской деятельности",
      "Академическая мобильность преподавателей и студентов",
      "Интеграция в мировое образовательное пространство"
    ]
  },
  "ky": {
    "home": "Башкы бет",
    "about": "Университет жөнүндө",
    "university": "Академик Кусейин Карасаев атындагы Бишкек мамлекеттик университети",
    "eyebrow": "К. Карасаев атындагы БМУ",
    "intro": "Академик Кусейин Карасаев атындагы Бишкек мамлекеттик университети — тарыхы 1979-жылы башталган билим берүү жана илим мекемеси.",
    "explore": "БМУ менен таанышуу",
    "go": "Өтүү",
    "sourceIntro": "Бул маалыматтар БМУнун мурдагы сайтынан алдын ала көчүрүлгөн. Расмий жарыялоодон мурда редакциялык текшерүү талап кылынат.",
    "history": "БМУнун тарыхы",
    "historyIntro": "Университеттин калыптанышынын негизги этаптары",
    "historySource": "БМУнун эски сайтындагы тарыхый маалымат",
    "mission": "Университеттин миссиясы",
    "ourMission": "Биздин миссия",
    "missionText": "Өлкөнүн улуттук кызыкчылыктарына жооп берген, заманбап эмгек рыногунда атаандаштыкка жөндөмдүү гуманитардык жана социалдык-экономикалык билимдүү адистерди даярдоо.",
    "missionNote": "Мурдагы сайттын маалыматы боюнча: Окумуштуулар кеңешинин 2023-жылдын 1-декабрындагы № 3 протоколу менен кайра бекитилген.",
    "principles": "Принциптер",
    "priorities": "Артыкчылыктуу багыттар",
    "officialSource": "Расмий булак",
    "leadership": "БМУнун жетекчилиги",
    "leadershipIntro": "Ректораттын жарыяланган түзүмү боюнча алдын ала маалымат. Расмий ишке киргизүүдөн мурда курамы жана ыйгарым укуктары такталышы керек.",
    "leadershipNote": "Тизме толук эмес. Тактоо үчүн университеттин мурдагы сайтындагы администрация барагын караңыз.",
    "administration": "Университеттин администрациясы",
    "roleRector": "Ректор",
    "roleAcademic": "Окуу иштери боюнча проректор",
    "roleScience": "Илимий иштер боюнча проректор",
    "roleInternational": "Эл аралык байланыштар жана инвестициялар боюнча проректор",
    "cards": [
      [
        "Университеттин тарыхы",
        "1979-жылдагы педагогикалык институттан азыркы БМУга чейинки жол.",
        "/about/history"
      ],
      [
        "Миссия жана баалуулуктар",
        "Ишмердиктин принциптери, артыкчылыктары жана стратегиялык максаттары.",
        "/about/mission"
      ],
      [
        "Жетекчилик",
        "Ректорат жана жетекчилердин байланыш маалыматы.",
        "/about/leadership"
      ],
      [
        "Факультеттер жана институттар",
        "Университеттин академиялык түзүмү.",
        "/faculties"
      ],
      [
        "Билим берүү программалары",
        "Даярдоо багыттары жана билим берүү баскычтары.",
        "/programs"
      ],
      [
        "Байланыштар",
        "Университеттин дареги, телефон номерлери жана электрондук почтасы.",
        "/contacts"
      ]
    ],
    "events": [
      [
        "Институттун негизделиши",
        "29-майда Орус тили жана адабияты педагогикалык институту түзүлгөн."
      ],
      [
        "Тилдер жана гуманитардык илимдер институту",
        "17-июнда Мамлекеттик тилдер жана гуманитардык илимдер институту түзүлгөн."
      ],
      [
        "Бишкек гуманитардык университети",
        "11-майда институт Бишкек гуманитардык университети болуп кайра түзүлгөн."
      ],
      [
        "Академик Кусейин Карасаевдин ысымы",
        "29-июнда университетке академик Кусейин Карасаевдин ысымы ыйгарылган."
      ]
    ],
    "principleItems": [
      "Динамикалуу өнүгүү",
      "Эл аралык таанылуу",
      "Ийкемдүүлүк",
      "Жеткиликтүүлүк",
      "Эмгек рыногунда суроо-талапка ээ болуу"
    ],
    "priorityItems": [
      "Билим берүүнүн сапатын жогорулатуу",
      "Билим берүү программаларын жаңылоо",
      "Заманбап билим берүү технологияларын киргизүү",
      "Илимий-изилдөө ишмердигин өнүктүрүү",
      "Окутуучулардын жана студенттердин академиялык мобилдүүлүгү",
      "Дүйнөлүк билим берүү мейкиндигине интеграциялануу"
    ]
  },
  "en": {
    "home": "Home",
    "about": "About the university",
    "university": "Bishkek State University named after Academician Kusein Karasaev",
    "eyebrow": "K. Karasaev Bishkek State University",
    "intro": "Bishkek State University named after Academician Kusein Karasaev is an educational and research institution whose history began in 1979.",
    "explore": "Discover BSU",
    "go": "Explore",
    "sourceIntro": "This information is provisionally migrated from the former BSU website and requires editorial verification before official publication.",
    "history": "History of BSU",
    "historyIntro": "Key milestones in the university’s development",
    "historySource": "Historical overview on the former BSU website",
    "mission": "University mission",
    "ourMission": "Our mission",
    "missionText": "To train specialists in the humanities and socio-economic fields who serve the national interests of the country and are competitive in the modern job market.",
    "missionNote": "According to the former website: reapproved by the Academic Council under Protocol No. 3 of December 1, 2023.",
    "principles": "Principles",
    "priorities": "Priorities",
    "officialSource": "Official source",
    "leadership": "BSU leadership",
    "leadershipIntro": "Provisional information drawn from the published rectorate structure. Members and responsibilities require verification before official launch.",
    "leadershipNote": "This list is incomplete. Refer to the university administration page on the former website for verification.",
    "administration": "University administration",
    "roleRector": "Rector",
    "roleAcademic": "Vice-Rector for Academic Affairs",
    "roleScience": "Vice-Rector for Research",
    "roleInternational": "Vice-Rector for International Relations and Investment",
    "cards": [
      [
        "University history",
        "From the teacher-training institute of 1979 to present-day BSU.",
        "/about/history"
      ],
      [
        "Mission and values",
        "Priorities, guiding principles and strategic goals.",
        "/about/mission"
      ],
      [
        "Leadership",
        "Rectorate and leadership contact information.",
        "/about/leadership"
      ],
      [
        "Faculties and institutes",
        "The university’s academic structure.",
        "/faculties"
      ],
      [
        "Academic programs",
        "Fields of study and degree levels.",
        "/programs"
      ],
      [
        "Contacts",
        "Address, phone numbers and email.",
        "/contacts"
      ]
    ],
    "events": [
      [
        "Founding of the institute",
        "On May 29, the Pedagogical Institute of Russian Language and Literature was established."
      ],
      [
        "Institute of Languages and Humanities",
        "On June 17, the State Institute of Languages and Humanities was established."
      ],
      [
        "Bishkek Humanities University",
        "On May 11, the institute was reorganized as Bishkek Humanities University."
      ],
      [
        "Named after Academician Kusein Karasaev",
        "On June 29, the university was named after Academician Kusein Karasaev."
      ]
    ],
    "principleItems": [
      "Dynamic development",
      "International recognition",
      "Flexibility",
      "Accessibility",
      "Relevance to the labor market"
    ],
    "priorityItems": [
      "Improving the quality of education",
      "Modernizing academic programs",
      "Introducing modern educational technologies",
      "Developing research activities",
      "Academic mobility of teachers and students",
      "Integration into the global education space"
    ]
  },
  "zh-CN": {
    "home": "首页",
    "about": "大学概况",
    "university": "以库赛因·卡拉萨耶夫院士命名的比什凯克国立大学",
    "eyebrow": "卡拉萨耶夫比什凯克国立大学",
    "intro": "以库赛因·卡拉萨耶夫院士命名的比什凯克国立大学是一所教育和科研机构，其历史始于1979年。",
    "explore": "了解大学",
    "go": "查看详情",
    "sourceIntro": "以下信息初步整理自大学旧网站，正式发布前仍需编辑核实。",
    "history": "大学历史",
    "historyIntro": "大学发展历程中的重要节点",
    "historySource": "旧网站上的大学历史介绍",
    "mission": "大学使命",
    "ourMission": "我们的使命",
    "missionText": "培养符合国家利益、具备人文及社会经济领域知识、能够在现代劳动力市场上保持竞争力的专业人才。",
    "missionNote": "根据旧网站资料：大学学术委员会于2023年12月1日通过第3号会议纪要重新批准。",
    "principles": "基本原则",
    "priorities": "重点方向",
    "officialSource": "官方来源",
    "leadership": "大学领导",
    "leadershipIntro": "以下信息依据已公布的校领导机构资料整理，正式上线前须核实人员及职责。",
    "leadershipNote": "本名单并不完整。请参阅大学旧网站上的校行政管理页面核实。",
    "administration": "大学行政管理",
    "roleRector": "校长",
    "roleAcademic": "教学事务副校长",
    "roleScience": "科研事务副校长",
    "roleInternational": "国际关系与投资事务副校长",
    "cards": [
      [
        "大学历史",
        "从1979年的师范学院到今天的大学。",
        "/about/history"
      ],
      [
        "使命与价值观",
        "大学的发展原则、重点方向和战略目标。",
        "/about/mission"
      ],
      [
        "领导团队",
        "校领导及其联系方式。",
        "/about/leadership"
      ],
      [
        "学院和研究所",
        "大学的学术组织结构。",
        "/faculties"
      ],
      [
        "学位项目",
        "专业方向与学位层次。",
        "/programs"
      ],
      [
        "联系方式",
        "大学地址、电话及电子邮箱。",
        "/contacts"
      ]
    ],
    "events": [
      [
        "学院成立",
        "5月29日，俄语语言文学师范学院成立。"
      ],
      [
        "语言与人文科学学院",
        "6月17日，国立语言与人文科学学院成立。"
      ],
      [
        "比什凯克人文大学",
        "5月11日，学院改制为比什凯克人文大学。"
      ],
      [
        "以卡拉萨耶夫院士命名",
        "6月29日，大学获授库赛因·卡拉萨耶夫院士之名。"
      ]
    ],
    "principleItems": [
      "动态发展",
      "国际认可",
      "灵活性",
      "可及性",
      "符合就业市场需求"
    ],
    "priorityItems": [
      "提高教育质量",
      "改革与更新学位项目",
      "引进现代教育技术",
      "发展科学研究",
      "促进师生学术交流与流动",
      "融入全球教育体系"
    ]
  }
};
