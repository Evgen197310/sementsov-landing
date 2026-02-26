import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

const DB_PATH = path.join(process.cwd(), "data", "sementsov.db");

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!_db) {
    _db = new Database(DB_PATH);
    _db.pragma("journal_mode = WAL");
    _db.pragma("foreign_keys = ON");
    initSchema(_db);
    seedIfEmpty(_db);
  }
  return _db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS team (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      role        TEXT NOT NULL,
      photo       TEXT,
      short_bio   TEXT,
      full_bio    TEXT,
      link        TEXT,
      sort_order  INTEGER DEFAULT 0,
      created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id          TEXT PRIMARY KEY,
      category    TEXT NOT NULL,
      icon        TEXT NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      sort_order  INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS cases (
      id          TEXT PRIMARY KEY,
      icon        TEXT NOT NULL,
      title       TEXT NOT NULL,
      category    TEXT,
      description TEXT,
      sort_order  INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS case_links (
      id      TEXT PRIMARY KEY,
      case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
      text    TEXT NOT NULL,
      url     TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS about (
      id    TEXT PRIMARY KEY DEFAULT 'main',
      text1 TEXT,
      text2 TEXT
    );

    CREATE TABLE IF NOT EXISTS advantages (
      id          TEXT PRIMARY KEY,
      icon        TEXT NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      sort_order  INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id      TEXT PRIMARY KEY DEFAULT 'main',
      phone   TEXT,
      email   TEXT,
      address TEXT,
      map_url TEXT,
      lat     REAL,
      lng     REAL
    );

    CREATE TABLE IF NOT EXISTS hero (
      id          TEXT PRIMARY KEY DEFAULT 'main',
      subtitle    TEXT,
      title       TEXT,
      description TEXT,
      stat1_value INTEGER,
      stat1_label TEXT,
      stat2_value INTEGER,
      stat2_label TEXT,
      stat3_value INTEGER,
      stat3_label TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id            TEXT PRIMARY KEY,
      username      TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role          TEXT NOT NULL DEFAULT 'admin',
      created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function seedIfEmpty(db: Database.Database) {
  const teamCount = db.prepare("SELECT COUNT(*) as c FROM team").get() as { c: number };
  if (teamCount.c > 0) return;

  // Seed team
  const teamMembers = [
    { id: "sementsov", name: "Семенцов Владимир Алексеевич", role: "Председатель Президиума", photo: "/team/sementsov.webp", shortBio: "Следователь по особо важным делам Генпрокуратуры РФ. Адвокат с 1997 года.", fullBio: "В 1974 г. окончил Саратовский юридический институт им. Д.И. Курского, работал в органах прокуратуры в должностях следователя, зам. прокурора, прокурора, следователя по особо важным делам Следственного Управления Генеральной Прокуратуры Российской Федерации. Старший советник юстиции. Занимается адвокатской практикой с 1997 года. Защитник по делу генерала СК Музраева. Автор книги «Анатомия предательства». Эксперт программы «Следствие вели».", link: null },
    { id: "kuklin", name: "Куклин Валентин Валентинович", role: "Адвокат", photo: "/team/kuklin.webp", shortBio: "К.н., подполковник милиции, член-корреспондент Российской Академии Адвокатуры.", fullBio: "С 1978 по 1984 г.г. работал в должности следователя, затем старшего следователя отдела внутренних дел Восьмого Главного управления МВД СССР. С 1984 по 1988 г.г. занимался научной работой во ВНИИ МВД СССР, защитил кандидатскую диссертацию. 1988–1989 г.г. — следователь Главного следственного управления МВД СССР. 1989–1995 г.г. — педагогическая работа в Московской высшей школе милиции МВД СССР, Академии МВД РФ. С 1995 г. — подполковник милиции в отставке, адвокат. Член-корреспондент Российской Академии Адвокатуры (2003 г.). Более 25 п.л. научных трудов.", link: null },
    { id: "zhukova", name: "Жукова Ирина Владимировна", role: "Адвокат", photo: "/team/zhukova.webp", shortBio: "Специалист по европейской защите прав человека. Психолог.", fullBio: "В 1995 г. окончила юридический факультет Дальневосточного Государственного Университета (г. Владивосток). В 2000 г. окончила факультет психологии в Забайкальском Государственном педагогическом университете. В 2009 г. успешно завершила образовательный курс Центра содействия международной защите «Европейская защита прав человека» в г. Москве и г. Страсбурге.", link: null },
    { id: "pogorelov", name: "Погорелов Борис Владимирович", role: "Адвокат", photo: "/team/pogorelov.webp", shortBio: "Следователь по особо важным делам при Генеральном Прокуроре СССР.", fullBio: "В 1970 г. окончил Свердловский юридический институт, работал в органах прокуратуры в должностях следователя, заместителя прокурора, прокурора, следователя по особо важным делам при Генеральном Прокуроре СССР, старшего следователя по особо важным делам Генеральной Прокуратуры Российской Федерации. Избран заместителем председателя Совета общественной организации «Союз ветеранов следствия».", link: null },
    { id: "khudoliy", name: "Худолий Кристина Андреевна", role: "Адвокат", photo: "/team/khudoliy.webp", shortBio: "Адвокатская практика с 2010 года.", fullBio: "Адвокат Московской коллегии адвокатов «Семенцов и партнеры». Занимается адвокатской практикой с 2010 года.", link: null },
    { id: "kokin-am", name: "Кокин Александр Михайлович", role: "Адвокат", photo: "/team/kokin-am.webp", shortBio: "Бывший помощник Председателя Верховного Суда РФ.", fullBio: "Окончил юридический факультет Воронежского Государственного университета. С 1983 года адвокат Воронежской коллегии адвокатов. С 1991 года главный консультант Судебной коллегии по уголовным делам Верховного Суда Российской Федерации, затем помощник Председателя Верховного Суда Российской Федерации.", link: null },
    { id: "ambarnova", name: "Амбарнова Елена Борисовна", role: "Адвокат, медиатор", photo: "/team/ambarnova.webp", shortBio: "К.э.н., специалист по медиации и гражданскому праву.", fullBio: "В 1999 г. закончила Российский государственный гуманитарный университет, в 2006 г. — Московскую государственную юридическую академию. Кандидат экономических наук. Специализируется в области гражданского права и психологии. Занимается медиацией (внесудебным разрешением споров), оказывает помощь в проведении переговоров.", link: null },
    { id: "goldberg", name: "Гольдберг Денис Сергеевич", role: "Адвокат", photo: "/team/goldberg.webp", shortBio: "Международное право, защита активов, оффшорное право. Опыт работы в Лондоне.", fullBio: "В 1997 году закончил Государственную Еврейскую Академию им. Маймонида. Возглавлял ряд юридических фирм: «Джон Тайнер и Российские Партнеры» (Элиста), «Панков и Партнеры» (Москва), «Юридический центр «Грачев и Партнеры» (Москва), «Filatov Goldberg Musatov LLP» (Лондон). В 2007 году получил статус адвоката. Работал в коллегиях «Гранкин и Партнеры», «Юков и Партнеры». Специалист по международному праву, защите активов, оффшорному законодательству, банковскому праву, уголовному праву.", link: null },
    { id: "proshina", name: "Прошина Юлия Александровна", role: "Адвокат", photo: "/team/proshina.webp", shortBio: "Гражданское, арбитражное, административное право.", fullBio: "Оказывает юридические услуги в области гражданского, арбитражного, административного права гражданам и бизнесу.", link: null },
    { id: "kokin-ka", name: "Кокин Курт Александрович", role: "Адвокат", photo: "/team/kokin-ka.webp", shortBio: "Арбитражные (коммерческие) споры.", fullBio: "Представляет интересы компаний в арбитражных (коммерческих) судах: коммерческие споры, связанные с нарушением договорных и внедоговорных обязательств.", link: null },
    { id: "pustoshilov", name: "Пустошилов Евгений Фёдорович", role: "Адвокат, арбитражный управляющий", photo: "/team/pustoshilov.webp", shortBio: "46 процедур банкротства, 3 прецедента в Верховном Суде РФ.", fullBio: "Адвокат Адвокатской палаты Московской области, арбитражный управляющий. В период с 2016 по 2023 год вёл 46 судебных процедур банкротства, в том числе крупных предприятий. Создал 3 прецедента в Верховном Суде РФ: отмена незаконных банковских комиссий (1+ млн руб.), прецедент по НДС с эффектом 80 млрд руб./год для кредиторов, отмена решений трёх инстанций по исковой давности. Лауреат премии «Арбитражный управляющий года» Петербургского банкротного форума.", link: "https://trust.moscow" },
  ];

  const insertTeam = db.prepare("INSERT INTO team (id, name, role, photo, short_bio, full_bio, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  teamMembers.forEach((m, i) => {
    insertTeam.run(m.id, m.name, m.role, m.photo, m.shortBio, m.fullBio, m.link, i);
  });

  // Seed services
  const businessServices = [
    { icon: "Scale", title: "Арбитраж", description: "Представительство в арбитражных судах всех инстанций по коммерческим спорам" },
    { icon: "Gavel", title: "Представительство в судах", description: "Защита интересов в судах общей юрисдикции и арбитражных судах" },
    { icon: "Shield", title: "Защита в контролирующих органах", description: "Защита интересов компаний при проверках ФНС, ФАС и иных органов" },
    { icon: "Banknote", title: "Взыскание долгов", description: "Досудебное и судебное взыскание дебиторской задолженности" },
    { icon: "FileText", title: "Взыскание убытков", description: "Возмещение материального ущерба и упущенной выгоды" },
    { icon: "Building2", title: "Корпоративные споры", description: "Разрешение конфликтов между участниками и акционерами компаний" },
    { icon: "ScrollText", title: "Исполнительное производство", description: "Сопровождение на стадии принудительного исполнения решений" },
    { icon: "UserCheck", title: "Корпоративный адвокат", description: "Постоянное юридическое сопровождение деятельности компании" },
    { icon: "HandshakeIcon", title: "Медиация", description: "Внесудебное разрешение споров с участием профессионального медиатора" },
  ];
  const personalServices = [
    { icon: "Briefcase", title: "Юридические консультации", description: "Профессиональная правовая оценка вашей ситуации" },
    { icon: "FileText", title: "Составление исковых заявлений", description: "Грамотная подготовка процессуальных документов" },
    { icon: "Home", title: "Жилищное право", description: "Споры о праве собственности, выселении, приватизации" },
    { icon: "Heart", title: "Семейное право", description: "Расторжение браков, раздел имущества, алименты, опека" },
    { icon: "Landmark", title: "Наследственное право", description: "Оформление наследства, споры между наследниками" },
    { icon: "Users", title: "Трудовое право", description: "Незаконное увольнение, трудовые споры, восстановление" },
    { icon: "Wheat", title: "Земельное право", description: "Земельные споры, оформление прав на земельные участки" },
    { icon: "Gavel", title: "Уголовное право", description: "Защита на всех стадиях уголовного судопроизводства" },
    { icon: "Building2", title: "Корпоративное право", description: "Создание, реорганизация и ликвидация юридических лиц" },
  ];

  const insertService = db.prepare("INSERT INTO services (id, category, icon, title, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
  businessServices.forEach((s, i) => {
    insertService.run(uuidv4(), "business", s.icon, s.title, s.description, i);
  });
  personalServices.forEach((s, i) => {
    insertService.run(uuidv4(), "personal", s.icon, s.title, s.description, i);
  });

  // Seed cases
  const casesData = [
    { icon: "Gavel", title: "Дело генерала СК Музраева", category: "Уголовное право", description: "Владимир Семенцов — защитник бывшего руководителя следственного управления СК РФ по Волгоградской области генерал-лейтенанта Михаила Музраева. Одно из самых резонансных уголовных дел последних лет.", links: [{ text: "Подробнее на sementsov.ru", url: "https://sementsov.ru/index.php/2012-07-08-18-39-08/kollegiya-v-smi/item/389-general-sk-muzraev-ne-priznal-svoyu-vinu-v-terrorizme" }] },
    { icon: "Tv", title: "«Следствие вели» — телевизионная экспертиза", category: "Экспертная деятельность", description: "Владимир Семенцов участвует в роли эксперта и следователя по громкому делу 80-х в программе «Следствие вели» на НТВ. Уникальный опыт расследования резонансных преступлений.", links: [{ text: "Смотреть программу", url: "https://sementsov.ru/index.php/2012-07-08-18-39-08/kollegiya-v-smi/item/106-vladimir-sementsov-uchastvuet-v-roli-eksperta-i-sledovatelya-po-gromkomu-delo-80-kh-v-programme-sledstvie-veli" }] },
    { icon: "BookOpen", title: "Книга «Анатомия предательства»", category: "Публикации", description: "Владимир Семенцов — автор книги «Анатомия предательства». Исследование природы человеческих поступков в экстремальных ситуациях, основанное на реальном опыте следственной и адвокатской практики.", links: [{ text: "Подробнее", url: "https://sementsov.ru/index.php/2012-07-08-18-39-08/novosti-v-kollegii/item/60-skoro-vyjdet-v-svet" }] },
    { icon: "Scale", title: "Прецеденты в Верховном Суде РФ", category: "Банкротство", description: "Адвокат коллегии Е.Ф. Пустошилов создал 3 правовых прецедента в Верховном Суде РФ: отмена незаконных банковских комиссий на 1+ млн руб., прецедент по НДС с макроэкономическим эффектом 80 млрд руб./год для кредиторов, отмена решений трёх инстанций по исковой давности.", links: [{ text: "Сайт адвоката Пустошилова", url: "https://trust.moscow" }] },
  ];

  const insertCase = db.prepare("INSERT INTO cases (id, icon, title, category, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)");
  const insertCaseLink = db.prepare("INSERT INTO case_links (id, case_id, text, url) VALUES (?, ?, ?, ?)");
  casesData.forEach((c, i) => {
    const caseId = uuidv4();
    insertCase.run(caseId, c.icon, c.title, c.category, c.description, i);
    c.links.forEach((l) => {
      insertCaseLink.run(uuidv4(), caseId, l.text, l.url);
    });
  });

  // Seed about
  db.prepare("INSERT INTO about (id, text1, text2) VALUES (?, ?, ?)").run(
    "main",
    "Московская коллегия адвокатов «Семенцов и Партнёры» — юридическая компания, работающая в России с 1997 года. За это время нашими клиентами стали десятки крупных компаний различных отраслей, государственные учреждения, большое количество предпринимателей и физических лиц.",
    "Адвокаты коллегии имеют многолетний опыт работы в различных отраслях российского права. Наша коллегия находится в партнёрских отношениях с адвокатскими образованиями Европы и Америки, поэтому мы оказываем юридическую поддержку не только в России, но и за рубежом."
  );

  // Seed advantages
  const advantagesData = [
    { icon: "Calendar", title: "С 1997 года", description: "Более 27 лет успешной адвокатской практики в России" },
    { icon: "Clock", title: "Круглосуточно", description: "Юридическая помощь доступна 24/7, включая экстренные случаи" },
    { icon: "Globe", title: "Международное партнёрство", description: "Сотрудничество с адвокатскими образованиями Европы и Америки" },
    { icon: "Briefcase", title: "Комплексный подход", description: "18 направлений права — от арбитража до медиации" },
  ];
  const insertAdv = db.prepare("INSERT INTO advantages (id, icon, title, description, sort_order) VALUES (?, ?, ?, ?, ?)");
  advantagesData.forEach((a, i) => {
    insertAdv.run(uuidv4(), a.icon, a.title, a.description, i);
  });

  // Seed contacts
  db.prepare("INSERT INTO contacts (id, phone, email, address, map_url, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    "main",
    "+7 (495) 629-82-50",
    "vsementsov11@mail.ru",
    "г. Москва, ул. Большая Дмитровка, д. 20/5, стр. 2, офис 20",
    "https://yandex.ru/map-widget/v1/?ll=37.6136%2C55.7632&z=16&pt=37.6136%2C55.7632%2Cpm2rdm&lang=ru_RU",
    55.7632,
    37.6136
  );

  // Seed hero
  db.prepare("INSERT INTO hero (id, subtitle, title, description, stat1_value, stat1_label, stat2_value, stat2_label, stat3_value, stat3_label) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(
    "main",
    "С 1997 года на защите ваших интересов",
    "Московская коллегия адвокатов «Семенцов и Партнёры»",
    "Юридическая защита бизнеса и граждан. 27 лет успешной практики, 11 адвокатов, международное партнёрство. Комплексное решение правовых задач любой сложности.",
    27, "лет практики",
    11, "адвокатов",
    18, "направлений права"
  );

  // Seed admin user from env
  const adminUser = process.env.ADMIN_USER || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const hash = bcrypt.hashSync(adminPassword, 10);
  db.prepare("INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)").run(
    uuidv4(), adminUser, hash, "superadmin"
  );
}

// ============ Data access helpers ============

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  short_bio: string | null;
  full_bio: string | null;
  link: string | null;
  sort_order: number;
}

export interface Service {
  id: string;
  category: string;
  icon: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface CaseItem {
  id: string;
  icon: string;
  title: string;
  category: string | null;
  description: string | null;
  sort_order: number;
  links?: CaseLink[];
}

export interface CaseLink {
  id: string;
  case_id: string;
  text: string;
  url: string;
}

export interface AboutData {
  text1: string | null;
  text2: string | null;
}

export interface Advantage {
  id: string;
  icon: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface ContactsData {
  phone: string | null;
  email: string | null;
  address: string | null;
  map_url: string | null;
  lat: number | null;
  lng: number | null;
}

export interface HeroData {
  subtitle: string | null;
  title: string | null;
  description: string | null;
  stat1_value: number | null;
  stat1_label: string | null;
  stat2_value: number | null;
  stat2_label: string | null;
  stat3_value: number | null;
  stat3_label: string | null;
}

export interface User {
  id: string;
  username: string;
  password_hash: string;
  role: string;
  created_at: string;
}

// Team
export function getAllTeam(): TeamMember[] {
  return getDb().prepare("SELECT * FROM team ORDER BY sort_order ASC").all() as TeamMember[];
}

export function getTeamMember(id: string): TeamMember | undefined {
  return getDb().prepare("SELECT * FROM team WHERE id = ?").get(id) as TeamMember | undefined;
}

export function insertTeamMember(member: Omit<TeamMember, "sort_order"> & { sort_order?: number }): void {
  const maxOrder = getDb().prepare("SELECT COALESCE(MAX(sort_order), -1) as m FROM team").get() as { m: number };
  getDb().prepare("INSERT INTO team (id, name, role, photo, short_bio, full_bio, link, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
    member.id, member.name, member.role, member.photo, member.short_bio, member.full_bio, member.link, member.sort_order ?? maxOrder.m + 1
  );
}

export function updateTeamMember(id: string, data: Partial<TeamMember>): void {
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    fields.push(`${key} = ?`);
    values.push(value);
  }
  if (fields.length === 0) return;
  values.push(id);
  getDb().prepare(`UPDATE team SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}

export function deleteTeamMember(id: string): void {
  getDb().prepare("DELETE FROM team WHERE id = ?").run(id);
}

// Services
export function getAllServices(): Service[] {
  return getDb().prepare("SELECT * FROM services ORDER BY category, sort_order ASC").all() as Service[];
}

export function getServicesByCategory(category: string): Service[] {
  return getDb().prepare("SELECT * FROM services WHERE category = ? ORDER BY sort_order ASC").all(category) as Service[];
}

export function insertService(service: Service): void {
  getDb().prepare("INSERT INTO services (id, category, icon, title, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)").run(
    service.id, service.category, service.icon, service.title, service.description, service.sort_order
  );
}

export function updateService(id: string, data: Partial<Service>): void {
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    fields.push(`${key} = ?`);
    values.push(value);
  }
  if (fields.length === 0) return;
  values.push(id);
  getDb().prepare(`UPDATE services SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}

export function deleteService(id: string): void {
  getDb().prepare("DELETE FROM services WHERE id = ?").run(id);
}

// Cases
export function getAllCases(): CaseItem[] {
  const cases = getDb().prepare("SELECT * FROM cases ORDER BY sort_order ASC").all() as CaseItem[];
  const links = getDb().prepare("SELECT * FROM case_links").all() as CaseLink[];
  return cases.map((c) => ({ ...c, links: links.filter((l) => l.case_id === c.id) }));
}

export function insertCaseItem(caseItem: CaseItem): void {
  getDb().prepare("INSERT INTO cases (id, icon, title, category, description, sort_order) VALUES (?, ?, ?, ?, ?, ?)").run(
    caseItem.id, caseItem.icon, caseItem.title, caseItem.category, caseItem.description, caseItem.sort_order
  );
  if (caseItem.links) {
    const stmt = getDb().prepare("INSERT INTO case_links (id, case_id, text, url) VALUES (?, ?, ?, ?)");
    caseItem.links.forEach((l) => stmt.run(l.id || uuidv4(), caseItem.id, l.text, l.url));
  }
}

export function updateCaseItem(id: string, data: Partial<CaseItem>): void {
  const { links, ...rest } = data;
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, value] of Object.entries(rest)) {
    if (key === "id") continue;
    fields.push(`${key} = ?`);
    values.push(value);
  }
  if (fields.length > 0) {
    values.push(id);
    getDb().prepare(`UPDATE cases SET ${fields.join(", ")} WHERE id = ?`).run(...values);
  }
  if (links) {
    getDb().prepare("DELETE FROM case_links WHERE case_id = ?").run(id);
    const stmt = getDb().prepare("INSERT INTO case_links (id, case_id, text, url) VALUES (?, ?, ?, ?)");
    links.forEach((l) => stmt.run(l.id || uuidv4(), id, l.text, l.url));
  }
}

export function deleteCaseItem(id: string): void {
  getDb().prepare("DELETE FROM cases WHERE id = ?").run(id);
}

// About
export function getAbout(): AboutData | undefined {
  return getDb().prepare("SELECT text1, text2 FROM about WHERE id = 'main'").get() as AboutData | undefined;
}

export function updateAbout(data: AboutData): void {
  getDb().prepare("UPDATE about SET text1 = ?, text2 = ? WHERE id = 'main'").run(data.text1, data.text2);
}

// Advantages
export function getAllAdvantages(): Advantage[] {
  return getDb().prepare("SELECT * FROM advantages ORDER BY sort_order ASC").all() as Advantage[];
}

export function insertAdvantage(adv: Advantage): void {
  getDb().prepare("INSERT INTO advantages (id, icon, title, description, sort_order) VALUES (?, ?, ?, ?, ?)").run(
    adv.id, adv.icon, adv.title, adv.description, adv.sort_order
  );
}

export function updateAdvantage(id: string, data: Partial<Advantage>): void {
  const fields: string[] = [];
  const values: unknown[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    fields.push(`${key} = ?`);
    values.push(value);
  }
  if (fields.length === 0) return;
  values.push(id);
  getDb().prepare(`UPDATE advantages SET ${fields.join(", ")} WHERE id = ?`).run(...values);
}

export function deleteAdvantage(id: string): void {
  getDb().prepare("DELETE FROM advantages WHERE id = ?").run(id);
}

// Contacts
export function getContacts(): ContactsData | undefined {
  return getDb().prepare("SELECT phone, email, address, map_url, lat, lng FROM contacts WHERE id = 'main'").get() as ContactsData | undefined;
}

export function updateContacts(data: ContactsData): void {
  getDb().prepare("UPDATE contacts SET phone = ?, email = ?, address = ?, map_url = ?, lat = ?, lng = ? WHERE id = 'main'").run(
    data.phone, data.email, data.address, data.map_url, data.lat, data.lng
  );
}

// Hero
export function getHero(): HeroData | undefined {
  return getDb().prepare("SELECT subtitle, title, description, stat1_value, stat1_label, stat2_value, stat2_label, stat3_value, stat3_label FROM hero WHERE id = 'main'").get() as HeroData | undefined;
}

export function updateHero(data: HeroData): void {
  getDb().prepare("UPDATE hero SET subtitle = ?, title = ?, description = ?, stat1_value = ?, stat1_label = ?, stat2_value = ?, stat2_label = ?, stat3_value = ?, stat3_label = ? WHERE id = 'main'").run(
    data.subtitle, data.title, data.description, data.stat1_value, data.stat1_label, data.stat2_value, data.stat2_label, data.stat3_value, data.stat3_label
  );
}

// Users
export function getAllUsers(): Omit<User, "password_hash">[] {
  return getDb().prepare("SELECT id, username, role, created_at FROM users ORDER BY created_at ASC").all() as Omit<User, "password_hash">[];
}

export function getUserByUsername(username: string): User | undefined {
  return getDb().prepare("SELECT * FROM users WHERE username = ?").get(username) as User | undefined;
}

export function getUserById(id: string): User | undefined {
  return getDb().prepare("SELECT * FROM users WHERE id = ?").get(id) as User | undefined;
}

export function insertUser(user: { id: string; username: string; password_hash: string; role: string }): void {
  getDb().prepare("INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)").run(
    user.id, user.username, user.password_hash, user.role
  );
}

export function updateUserRole(id: string, role: string): void {
  getDb().prepare("UPDATE users SET role = ? WHERE id = ?").run(role, id);
}

export function deleteUser(id: string): void {
  getDb().prepare("DELETE FROM users WHERE id = ?").run(id);
}

export function countSuperadmins(): number {
  const row = getDb().prepare("SELECT COUNT(*) as c FROM users WHERE role = 'superadmin'").get() as { c: number };
  return row.c;
}
