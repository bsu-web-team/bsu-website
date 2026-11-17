import type { Locale } from "@/lib/i18n";
type LocalText = Record<Locale, string>;
export type PublicPage = { title: LocalText; intro: LocalText; links: {label: LocalText; href: string}[] };
export const publicPages: Record<string, PublicPage> = {
  "library": {
    "title": {
      "ru": "Научная библиотека",
      "ky": "Илимий китепкана",
      "en": "Research library",
      "zh-CN": "学术图书馆"
    },
    "intro": {
      "ru": "Учебная литература, научные публикации и электронные ресурсы БГУ.",
      "ky": "БМУнун окуу адабияттары, илимий эмгектери жана электрондук ресурстары.",
      "en": "Academic literature, research and digital resources.",
      "zh-CN": "大学教材、科研出版物和电子资源。"
    },
    "links": [
      {
        "label": {
          "ru": "Собственный фонд",
          "ky": "Өз фондубуз",
          "en": "Local collection",
          "zh-CN": "本校馆藏"
        },
        "href": "#local-books"
      },
      {
        "label": {
          "ru": "Университетская библиотека ONLINE",
          "ky": "Университеттик онлайн китепкана",
          "en": "University Library Online",
          "zh-CN": "大学在线图书馆"
        },
        "href": "https://biblioclub.ru/"
      },
      {
        "label": {
          "ru": "Научный архив БГУ",
          "ky": "БМУнун илимий архиви",
          "en": "BSU research archive",
          "zh-CN": "本校科研档案"
        },
        "href": "https://arch.kyrlibnet.kg/?browse=19&nadd=holder&npage=browse"
      },
      {
        "label": {
          "ru": "О библиотеке",
          "ky": "Китепкана жөнүндө",
          "en": "About the library",
          "zh-CN": "图书馆介绍"
        },
        "href": "/library/content/09a2c11806da"
      }
    ]
  },
  "about/academic-council": {
    "title": {
      "ru": "Учёный совет",
      "ky": "Окумуштуулар кеңеши",
      "en": "Academic council",
      "zh-CN": "学术委员会"
    },
    "intro": {
      "ru": "Решения и документы коллегиального органа университета.",
      "ky": "Университеттин коллегиялык органынын чечимдери жана документтери.",
      "en": "University council decisions and documents.",
      "zh-CN": "大学学术委员会决议及文件。"
    },
    "links": [
      {
        "label": {
          "ru": "Заседание Учёного совета",
          "ky": "Кеңештин жыйыны",
          "en": "Council meeting",
          "zh-CN": "委员会会议"
        },
        "href": "/news/content/a0dac8d76820"
      },
      {
        "label": {
          "ru": "Документы",
          "ky": "Документтер",
          "en": "Documents",
          "zh-CN": "文件"
        },
        "href": "/documents"
      }
    ]
  },
  "about/administration": {
    "title": {
      "ru": "Административные подразделения",
      "ky": "Административдик бөлүмдөр",
      "en": "Administrative units",
      "zh-CN": "行政部门"
    },
    "intro": {
      "ru": "Управление университетом и контакты подразделений.",
      "ky": "Университетти башкаруу жана бөлүмдөрдүн байланыштары.",
      "en": "University administration and contacts.",
      "zh-CN": "大学行政管理与联系方式。"
    },
    "links": [
{"label":{"ru":"Колледж БГУ","ky":"БМУнун колледжи","en":"BSU College","zh-CN":"大学附属学院"},"href":"/admissions/content/99f81b1ba387"},
{"label":{"ru":"Учебный отдел","ky":"Окуу бөлүмү","en":"Academic office","zh-CN":"教务处"},"href":"/about/content/4b5c1d4d1174"},
      {"label":{"ru":"Администрация университета","ky":"Университеттин администрациясы","en":"University administration","zh-CN":"大学行政管理"},"href":"/about/content/e51bfd001417"},
      {"label":{"ru":"Отдел кадров","ky":"Кадрлар бөлүмү","en":"Human resources","zh-CN":"人事部门"},"href":"/about/content/cedab2bb4acb"},
      {"label":{"ru":"Совет по качеству","ky":"Сапат боюнча кеңеш","en":"Quality council","zh-CN":"质量委员会"},"href":"/about/content/c2e869419168"},
      {"label":{"ru":"Планово-финансовый отдел","ky":"Пландоо жана каржы бөлүмү","en":"Planning and finance office","zh-CN":"计划与财务部门"},"href":"/about/content/7c455a6bc360"},
      {"label":{"ru":"Отдел качества, практики и карьеры","ky":"Сапат, практика жана карьера бөлүмү","en":"Quality, internships and careers","zh-CN":"质量、实习与就业部门"},"href":"/about/content/ad69111c8d38"},
      {"label":{"ru":"Отдел культуры и работы с молодежью","ky":"Маданият жана жаштар менен иштөө бөлүмү","en":"Culture and youth affairs","zh-CN":"文化与青年事务部门"},"href":"/about/content/ed17a0863eb7"},
      {"label":{"ru":"Учебный отдел","ky":"Окуу бөлүмү","en":"Academic office","zh-CN":"教务处"},"href":"/about/content/4b5c1d4d1174"},
      {"label":{"ru":"Положение об учебном отделе","ky":"Окуу бөлүмүнүн жобосу","en":"Academic office regulations","zh-CN":"教务处规章"},"href":"/about/content/4c907a045e36"},
      {"label":{"ru":"Учебно-методический совет","ky":"Окуу-методикалык кеңеш","en":"Teaching and methodology council","zh-CN":"教学方法委员会"},"href":"/about/content/1b3882f148be"},
      {"label":{"ru":"Отдел международных связей","ky":"Эл аралык байланыштар бөлүмү","en":"International relations office","zh-CN":"国际关系部门"},"href":"/international/content/85e9aa3b646c"},
      {"label":{"ru":"Редакционно-издательский отдел","ky":"Редакциялык-басма бөлүмү","en":"Editorial and publishing office","zh-CN":"编辑出版部门"},"href":"/science/content/bb918df1396b"},
      {"label":{"ru":"Все материалы и отделы","ky":"Бардык материалдар жана бөлүмдөр","en":"All materials and departments","zh-CN":"所有资料与部门"},"href":"/materials"},
      {
        "label": {
          "ru": "Ректорат",
          "ky": "Ректорат",
          "en": "Rectorate",
          "zh-CN": "校领导"
        },
        "href": "/about/leadership"
      },
      {
        "label": {
          "ru": "Научное управление",
          "ky": "Илим башкармалыгы",
          "en": "Research office",
          "zh-CN": "科研管理部门"
        },
        "href": "/science/content/06dc38468f64"
      },
      {
        "label": {
          "ru": "Контакты",
          "ky": "Байланыш",
          "en": "Contacts",
          "zh-CN": "联系方式"
        },
        "href": "/contacts"
      }
    ]
  },
  "schedule": {
    "title": {
      "ru": "Расписание занятий",
      "ky": "Сабактардын жадыбалы",
      "en": "Class schedule",
      "zh-CN": "课程表"
    },
    "intro": {
      "ru": "Актуальное расписание доступно через образовательные порталы АВН.",
      "ky": "Актуалдуу жадыбал AVN порталдарында жеткиликтүү.",
      "en": "Current schedules are available through the AVN portals.",
      "zh-CN": "最新课程安排可通过 AVN 门户查看。"
    },
    "links": [
      {
        "label": {
          "ru": "АВН БГУ",
          "ky": "БМУ AVN",
          "en": "BSU AVN",
          "zh-CN": "大学 AVN"
        },
        "href": "https://avn.bhu.kg/"
      },
      {
        "label": {
          "ru": "АВН ИНДОППК",
          "ky": "ИНДОППК AVN",
          "en": "Institute AVN",
          "zh-CN": "继续教育学院 AVN"
        },
        "href": "https://avn.indo.kg/"
      },
      {
        "label": {
          "ru": "Помощь и контакты",
          "ky": "Жардам жана байланыш",
          "en": "Help and contacts",
          "zh-CN": "帮助与联系"
        },
        "href": "/contacts"
      }
    ]
  },
  "academic-calendar": {
    "title": {
      "ru": "Академический календарь",
      "ky": "Академиялык календарь",
      "en": "Academic calendar",
      "zh-CN": "校历"
    },
    "intro": {
      "ru": "Утверждённый календарь учебного года будет размещён после получения документа.",
      "ky": "Бекитилген окуу календары документ алынгандан кийин жарыяланат.",
      "en": "The approved academic calendar will be posted when available.",
      "zh-CN": "经批准的校历将在收到文件后发布。"
    },
    "links": [
{"label":{"ru":"Учебные планы","ky":"Окуу пландары","en":"Study plans","zh-CN":"教学计划"},"href":"/programs/content/eb07d398bba2"},
{"label":{"ru":"Элективные дисциплины","ky":"Тандоо сабактары","en":"Elective courses","zh-CN":"选修课程"},"href":"/programs/content/b167b31470f9"},
      {
        "label": {
          "ru": "Учебное расписание",
          "ky": "Сабактардын жадыбалы",
          "en": "Class schedule",
          "zh-CN": "课程表"
        },
        "href": "/schedule"
      },
      {
        "label": {
          "ru": "Документы",
          "ky": "Документтер",
          "en": "Documents",
          "zh-CN": "文件"
        },
        "href": "/documents"
      }
    ]
  },
  "continuing-education": {
    "title": {
      "ru": "Дополнительное образование",
      "ky": "Кошумча билим берүү",
      "en": "Continuing education",
      "zh-CN": "继续教育"
    },
    "intro": {
      "ru": "Повышение квалификации и переподготовка в ИНДОППК БГУ. Условия и сроки уточняйте в институте.",
      "ky": "БМУнун ИНДОППК институтунда квалификацияны жогорулатуу жана кайра даярдоо. Шарттарды институттан тактаңыз.",
      "en": "Professional development and retraining. Confirm dates and conditions with the institute.",
      "zh-CN": "继续教育与职业培训。具体条件和日期请向学院确认。"
    },
    "links": [
{"label":{"ru":"Международный образовательный центр","ky":"Эл аралык билим берүү борбору","en":"International education center","zh-CN":"国际教育中心"},"href":"/continuing-education/content/c5959c2c688c"},
      {
        "label": {
          "ru": "ИНДОППК",
          "ky": "ИНДОППК",
          "en": "Institute of continuing education",
          "zh-CN": "继续教育学院"
        },
        "href": "/faculties/continuing-distance-education"
      },
      {
        "label": {
          "ru": "Программы института",
          "ky": "Институттун программалары",
          "en": "Institute programs",
          "zh-CN": "学院课程"
        },
        "href": "/faculties/content/175d2bdf98d5"
      },
      {
        "label": {
          "ru": "Связаться с университетом",
          "ky": "Университет менен байланышуу",
          "en": "Contact the university",
          "zh-CN": "联系大学"
        },
        "href": "/contacts"
      }
    ]
  },
  "international": {
    "title": {
      "ru": "Международное сотрудничество",
      "ky": "Эл аралык кызматташтык",
      "en": "International cooperation",
      "zh-CN": "国际合作"
    },
    "intro": {
      "ru": "Академическая мобильность, обмен и международные проекты.",
      "ky": "Академиялык мобилдүүлүк, алмашуу жана эл аралык долбоорлор.",
      "en": "Academic mobility, exchanges and international projects.",
      "zh-CN": "学术交流、交换项目与国际合作。"
    },
    "links": [
{"label":{"ru":"Международные программы и гранты","ky":"Эл аралык программалар жана гранттар","en":"International programs and grants","zh-CN":"国际项目与奖学金"},"href":"/international/content/95c7400c0ab2"},
{"label":{"ru":"Академическая мобильность","ky":"Академиялык мобилдүүлүк","en":"Academic mobility","zh-CN":"学术交流"},"href":"/international/content/63d1a32cf171"},
{"label":{"ru":"Международные партнёры","ky":"Эл аралык өнөктөштөр","en":"International partners","zh-CN":"国际合作伙伴"},"href":"/international/content/4c8e834c4e64"},
{"label":{"ru":"Международные проекты","ky":"Эл аралык долбоорлор","en":"International projects","zh-CN":"国际项目"},"href":"/international/content/0aa8c190be42"},
{"label":{"ru":"Центры и офисы","ky":"Борборлор жана кеңселер","en":"Centers and offices","zh-CN":"中心与办公室"},"href":"/international/content/dc1fd727f191"},
      {
        "label": {
          "ru": "Студенческий обмен",
          "ky": "Студенттик алмашуу",
          "en": "Student exchange",
          "zh-CN": "学生交换"
        },
        "href": "/international/content/dd21bfc5c622"
      },
      {
        "label": {
          "ru": "Документы сотрудничества",
          "ky": "Кызматташтык документтери",
          "en": "Cooperation documents",
          "zh-CN": "合作文件"
        },
        "href": "/documents/content/ad64d1fc12d1"
      },
      {
        "label": {
          "ru": "Иностранным студентам",
          "ky": "Чет өлкөлүк студенттерге",
          "en": "International students",
          "zh-CN": "国际学生"
        },
        "href": "/admissions/international"
      }
    ]
  },
  "student-life": {
    "title": {
      "ru": "Студенческая жизнь",
      "ky": "Студенттик жашоо",
      "en": "Student life",
      "zh-CN": "校园生活"
    },
    "intro": {
      "ru": "Студенческие инициативы, мероприятия и возможности участия.",
      "ky": "Студенттик демилгелер, иш-чаралар жана катышуу мүмкүнчүлүктөрү.",
      "en": "Student initiatives, events and participation opportunities.",
      "zh-CN": "学生倡议、校园活动与参与机会。"
    },
    "links": [
{"label":{"ru":"Ассоциация выпускников","ky":"Бүтүрүүчүлөр ассоциациясы","en":"Alumni association","zh-CN":"校友协会"},"href":"/student-life/content/ed850bacbcb0"},
      {
        "label": {
          "ru": "Студенческий совет",
          "ky": "Студенттик кеңеш",
          "en": "Student council",
          "zh-CN": "学生会"
        },
        "href": "/news/content/d9327dc89440"
      },
      {
        "label": {
          "ru": "Новости",
          "ky": "Жаңылыктар",
          "en": "News",
          "zh-CN": "新闻"
        },
        "href": "/news"
      },
      {
        "label": {
          "ru": "Общежития",
          "ky": "Жатаканалар",
          "en": "Dormitories",
          "zh-CN": "宿舍"
        },
        "href": "/dormitories"
      }
    ]
  },
  "dormitories": {
    "title": {
      "ru": "Общежития",
      "ky": "Жатаканалар",
      "en": "Dormitories",
      "zh-CN": "宿舍"
    },
    "intro": {
      "ru": "Наличие мест, условия проживания и порядок заселения уточняйте в университете.",
      "ky": "Бош орундарды жана жайгашуу шарттарын университеттен тактаңыз.",
      "en": "Contact the university for vacancies and accommodation conditions.",
      "zh-CN": "床位情况及入住条件请咨询大学。"
    },
    "links": [
      {
        "label": {
          "ru": "Информация для иностранных студентов",
          "ky": "Чет өлкөлүк студенттерге маалымат",
          "en": "International student information",
          "zh-CN": "国际学生信息"
        },
        "href": "/international/content/1ff00064daf4"
      },
      {
        "label": {
          "ru": "Контакты",
          "ky": "Байланыш",
          "en": "Contacts",
          "zh-CN": "联系方式"
        },
        "href": "/contacts"
      }
    ]
  },
  "science/business": {
    "title": {
      "ru": "Наука для бизнеса",
      "ky": "Бизнес үчүн илим",
      "en": "Research for business",
      "zh-CN": "面向企业的科研"
    },
    "intro": {
      "ru": "Предложения о совместных исследованиях и прикладных проектах направляйте через контакты университета.",
      "ky": "Биргелешкен изилдөө жана долбоор сунуштарын университетке жөнөтүңүз.",
      "en": "Contact the university to discuss joint research and applied projects.",
      "zh-CN": "联合研究与应用项目请联系大学。"
    },
    "links": [
{"label":{"ru":"Научные исследования","ky":"Илимий изилдөөлөр","en":"Research activities","zh-CN":"科研活动"},"href":"/science/content/4db09ba19db3"},
{"label":{"ru":"Вестник БГУ","ky":"БМУнун жарчысы","en":"BSU Bulletin","zh-CN":"大学学报"},"href":"/science/content/35fbb7b1a4d8"},
{"label":{"ru":"Известия БГУ","ky":"БМУнун кабарлары","en":"BSU Proceedings","zh-CN":"大学科研期刊"},"href":"/science/content/1c7c4b1a8776"},
      {
        "label": {
          "ru": "Научные исследования",
          "ky": "Илимий изилдөөлөр",
          "en": "Research",
          "zh-CN": "科研"
        },
        "href": "/science/research"
      },
      {
        "label": {
          "ru": "Научное управление",
          "ky": "Илим башкармалыгы",
          "en": "Research office",
          "zh-CN": "科研管理部门"
        },
        "href": "/science/content/06dc38468f64"
      },
      {
        "label": {
          "ru": "Обсудить сотрудничество",
          "ky": "Кызматташтыкты талкуулоо",
          "en": "Discuss cooperation",
          "zh-CN": "洽谈合作"
        },
        "href": "/contacts"
      }
    ]
  },
  "services": {
    "title": {
      "ru": "Электронные сервисы",
      "ky": "Электрондук кызматтар",
      "en": "Digital services",
      "zh-CN": "在线服务"
    },
    "intro": {
      "ru": "Единая точка входа в университетские цифровые ресурсы.",
      "ky": "Университеттин санарип ресурстарына бирдиктүү кирүү.",
      "en": "One place to access university digital resources.",
      "zh-CN": "大学数字资源统一入口。"
    },
    "links": [
{
        "label": {
          "ru": "АВН БГУ",
          "ky": "БМУ AVN",
          "en": "BSU AVN",
          "zh-CN": "大学 AVN"
        },
        "href": "https://avn.bhu.kg/"
      },
      {
        "label": {
          "ru": "Расписание",
          "ky": "Жадыбал",
          "en": "Schedule",
          "zh-CN": "课表"
        },
        "href": "/schedule"
      },
      {
        "label": {
          "ru": "Библиотека",
          "ky": "Китепкана",
          "en": "Library",
          "zh-CN": "图书馆"
        },
        "href": "/library"
      },
      {
        "label": {
          "ru": "Документы",
          "ky": "Документтер",
          "en": "Documents",
          "zh-CN": "文件"
        },
        "href": "/documents"
      },
      {
        "label": {
          "ru": "Академический календарь",
          "ky": "Академиялык календарь",
          "en": "Academic calendar",
          "zh-CN": "校历"
        },
        "href": "/academic-calendar"
      }
    ]
  }
};
