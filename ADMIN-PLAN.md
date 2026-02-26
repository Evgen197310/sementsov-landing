# Админ-панель для сайта «Семенцов и Партнёры»

Создать WYSIWYG-подобную админ-панель внутри Next.js: страница админки визуально повторяет сайт, но каждый блок редактируемый «на месте». SQLite для хранения данных, sharp для обработки фото, управление пользователями с ролями superadmin.

---

## Текущее состояние сайта

- **Стек:** Next.js 15, TailwindCSS, TypeScript
- **Режим:** статический экспорт (`output: "export"`) → nginx в Docker
- **Данные:** захардкожены в компонентах (`Team.tsx`, `Services.tsx`, `Cases.tsx`, `About.tsx`, `Hero.tsx`, `Header.tsx`, `Footer.tsx`, `ContactForm.tsx`)
- **Команда:** 11 адвокатов — `id`, `name`, `role`, `photo`, `shortBio`, `fullBio`, `link?`
- **Фото:** webp в `public/team/`

## Архитектурные решения

| Решение | Обоснование |
|---------|-------------|
| **SQLite (better-sqlite3)** | Лёгкая встроенная БД, без отдельного сервиса, файл на диске, транзакции, персистентность через Docker volume |
| **sharp** | Ресайз + конвертация в webp при загрузке фото; генерация нескольких размеров (карточка, модалка, hero) |
| **Админка = визуальная копия сайта** | Каждая секция отрисовывается так же, как на сайте, но с overlay-кнопками редактирования. Клик → inline-модалка или inline-поля |
| **Переход на SSR (`next start`)** | API-роуты, динамический контент, авторизация |
| **Многопользовательская система** | Таблица `users` с ролью `superadmin`/`admin`. Суперадмин управляет пользователями. Нельзя забрать superadmin у себя и у последнего суперадмина |

## Схема БД (SQLite)

```sql
-- Адвокаты
CREATE TABLE team (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  photo       TEXT,            -- путь к webp файлу
  short_bio   TEXT,
  full_bio    TEXT,
  link        TEXT,
  sort_order  INTEGER DEFAULT 0,
  created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Услуги
CREATE TABLE services (
  id          TEXT PRIMARY KEY,
  category    TEXT NOT NULL,   -- 'business' | 'personal'
  icon        TEXT NOT NULL,   -- имя иконки Lucide
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0
);

-- Кейсы
CREATE TABLE cases (
  id          TEXT PRIMARY KEY,
  icon        TEXT NOT NULL,
  title       TEXT NOT NULL,
  category    TEXT,
  description TEXT,
  sort_order  INTEGER DEFAULT 0
);

-- Ссылки кейсов (многие-к-одному)
CREATE TABLE case_links (
  id      TEXT PRIMARY KEY,
  case_id TEXT REFERENCES cases(id) ON DELETE CASCADE,
  text    TEXT NOT NULL,
  url     TEXT NOT NULL
);

-- Секция «О коллегии»
CREATE TABLE about (
  id    TEXT PRIMARY KEY DEFAULT 'main',
  text1 TEXT,   -- первый абзац
  text2 TEXT    -- второй абзац
);

-- Преимущества (в секции About)
CREATE TABLE advantages (
  id          TEXT PRIMARY KEY,
  icon        TEXT NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER DEFAULT 0
);

-- Контакты (синглтон)
CREATE TABLE contacts (
  id      TEXT PRIMARY KEY DEFAULT 'main',
  phone   TEXT,
  email   TEXT,
  address TEXT,
  map_url TEXT,
  lat     REAL,
  lng     REAL
);

-- Hero-секция (синглтон)
CREATE TABLE hero (
  id          TEXT PRIMARY KEY DEFAULT 'main',
  subtitle    TEXT,    -- "С 1997 года на защите..."
  title       TEXT,    -- "Московская коллегия..."
  description TEXT,    -- основной текст
  stat1_value INTEGER, stat1_label TEXT,
  stat2_value INTEGER, stat2_label TEXT,
  stat3_value INTEGER, stat3_label TEXT
);

-- Пользователи
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',  -- 'admin' | 'superadmin'
  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Обработка фото

При загрузке фото адвоката через `/api/team/upload`:
1. **Принять** оригинал (jpg/png/webp, до 10MB)
2. **sharp** → три варианта:
   - `{id}.webp` — основное фото карточки (900×1198, fit cover)
   - `{id}-thumb.webp` — миниатюра для модалки (160×160, круг-crop, fit cover)
   - `{id}-og.webp` — для соцсетей (400×500, если нужно)
3. Сохранить в `uploads/team/` (Docker volume), отдавать через API-роут `/api/uploads/[...path]`
4. Старые файлы удаляются при замене фото

## Концепция админ-панели (WYSIWYG-like)

Страница `/admin` отрисовывает **те же секции сайта** (Hero, About, Services, Team, Cases, Contacts), но:

- Вокруг каждого редактируемого блока — **тонкая рамка + иконка карандаша** (появляется при hover)
- Клик на блок → **модальное окно** с формой редактирования полей этого блока
- Секция **Team**: карточки адвокатов + кнопка «+ Добавить адвоката» (внизу сетки); на каждой карточке — иконки ✏️ и 🗑️
- Секция **Services/Cases**: аналогично — редактирование/удаление/добавление элементов
- **Тулбар сверху** (вместо обычного хедера) — навигация по секциям + кнопка «Пользователи» (для superadmin) + «Выйти»
- Изменения сохраняются **по кнопке «Сохранить»** в каждой модалке, обновление секции без перезагрузки страницы

## Управление пользователями (`/admin/users`)

- Список всех пользователей: username, роль, дата создания
- **Создание** нового пользователя (логин + пароль + роль)
- **Удаление** пользователя
- **Переключение роли** superadmin ↔ admin
- **Ограничения:**
  - Нельзя забрать superadmin у **себя**
  - Нельзя забрать superadmin у **последнего** суперадмина (если он один — кнопка неактивна)
  - Только superadmin видит раздел «Пользователи»
- Доступ к `/admin/users` — только для superadmin (middleware проверяет роль)

## План реализации

### Этап 1 — Инфраструктура (БД, конфиг, Docker)
1. Установить зависимости: `better-sqlite3`, `sharp`, `bcryptjs`, `jsonwebtoken`, `uuid`
2. Убрать `output: "export"` из `next.config.js`, добавить `output: "standalone"`
3. Создать `src/lib/db.ts` — инициализация SQLite, создание таблиц, seed начальных данных из текущих хардкодов
4. Создать `src/lib/auth.ts` — JWT sign/verify, хеширование пароля
5. Обновить `Dockerfile` (node runtime вместо nginx)
6. Обновить `docker-compose.yml` — volumes для `data/` и `uploads/`

### Этап 2 — API-роуты
7. `/api/auth/login` — POST (вход)
8. `/api/auth/me` — GET (текущий пользователь)
9. `/api/team` — GET, POST, PUT, DELETE
10. `/api/team/upload` — POST (загрузка + обработка фото через sharp)
11. `/api/team/reorder` — PUT (изменение порядка)
12. `/api/services` — GET, POST, PUT, DELETE
13. `/api/cases` — GET, POST, PUT, DELETE
14. `/api/about` — GET, PUT
15. `/api/contacts` — GET, PUT
16. `/api/hero` — GET, PUT
17. `/api/users` — GET, POST, PUT, DELETE (только superadmin)
18. `/api/uploads/[...path]` — GET (отдача загруженных файлов)
19. `middleware.ts` — защита `/admin/*` и `/api/*` (кроме login и публичных GET)

### Этап 3 — Рефакторинг публичных компонентов
20. Все компоненты (`Team`, `Services`, `Cases`, `About`, `Hero`, `ContactForm`, `Header`, `Footer`) получают данные через server component / props из БД
21. Убрать хардкод данных из компонентов
22. Компоненты должны работать в двух режимах: **view** (публичный сайт) и **edit** (админка) — через prop `editable?: boolean`

### Этап 4 — Админ-панель UI
23. `/admin/login` — страница входа (стиль сайта, тёмная тема)
24. `/admin` — layout с тулбаром + рендер всех секций сайта в edit-режиме
25. Компонент `EditOverlay` — обёртка для каждого редактируемого блока (рамка, иконка, клик → модалка)
26. Модалки редактирования для каждой секции
27. Кнопки добавления/удаления адвокатов в секции Team
28. Drag-and-drop или стрелки для сортировки (опционально, можно в v2)
29. Загрузка фото: preview + crop area + автоматическая обработка
30. `/admin/users` — управление пользователями (только superadmin)

### Этап 5 — Seed, безопасность, деплой
31. Скрипт seed: миграция текущих хардкод-данных в SQLite при первом запуске
32. Создание первого суперадмина из env-переменных (`ADMIN_USER`, `ADMIN_PASSWORD`)
33. Тестирование всех CRUD-операций
34. Пересборка Docker-контейнера, деплой

## Структура файлов (новые/изменённые)

```
sementsov_landing/
├── data/
│   └── sementsov.db          # SQLite файл (Docker volume)
├── uploads/
│   └── team/                 # загруженные фото (Docker volume)
│       ├── sementsov.webp
│       ├── sementsov-thumb.webp
│       └── ...
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx           # тулбар + проверка auth
│   │   │   ├── page.tsx             # рендер всех секций в edit-режиме
│   │   │   ├── login/page.tsx
│   │   │   └── users/page.tsx       # управление пользователями
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/me/route.ts
│   │       ├── team/route.ts
│   │       ├── team/upload/route.ts
│   │       ├── team/reorder/route.ts
│   │       ├── services/route.ts
│   │       ├── cases/route.ts
│   │       ├── about/route.ts
│   │       ├── contacts/route.ts
│   │       ├── hero/route.ts
│   │       ├── users/route.ts
│   │       └── uploads/[...path]/route.ts
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminToolbar.tsx      # верхний тулбар админки
│   │   │   ├── EditOverlay.tsx       # обёртка редактируемых блоков
│   │   │   ├── TeamEditor.tsx        # модалка редактирования адвоката
│   │   │   ├── ServiceEditor.tsx
│   │   │   ├── CaseEditor.tsx
│   │   │   ├── AboutEditor.tsx
│   │   │   ├── HeroEditor.tsx
│   │   │   ├── ContactsEditor.tsx
│   │   │   ├── PhotoUploader.tsx     # компонент загрузки фото с preview
│   │   │   └── UserManager.tsx       # управление пользователями
│   │   ├── Team.tsx                  # рефакторинг: props + editable mode
│   │   ├── Services.tsx              # аналогично
│   │   ├── Cases.tsx
│   │   ├── About.tsx
│   │   ├── Hero.tsx
│   │   ├── ContactForm.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── db.ts                     # SQLite init + helpers
│   │   ├── auth.ts                   # JWT + bcrypt
│   │   ├── seed.ts                   # начальная миграция данных
│   │   └── images.ts                 # обработка фото через sharp
│   └── middleware.ts
├── Dockerfile                        # обновлённый (node runtime)
└── docker-compose.yml                # volumes для data/ и uploads/
```

## Зависимости (новые npm-пакеты)

- **`better-sqlite3`** + `@types/better-sqlite3` — синхронный SQLite для Node.js
- **`sharp`** — обработка изображений (resize, crop, webp conversion)
- **`jsonwebtoken`** + `@types/jsonwebtoken` — JWT
- **`bcryptjs`** + `@types/bcryptjs` — хеширование паролей
- **`uuid`** — генерация ID
