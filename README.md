# МКА «Семенцов и Партнёры» — Сайт + Админ-панель

Лендинг-сайт Московской коллегии адвокатов «Семенцов и Партнёры» с встроенной WYSIWYG-подобной админ-панелью для редактирования всего визуального контента.

> **Подробный план реализации** — см. [ADMIN-PLAN.md](./ADMIN-PLAN.md)

---

## Стек технологий

| Технология | Назначение |
|------------|------------|
| **Next.js 15** | SSR, API routes, standalone-режим |
| **React 18 + TypeScript** | Компоненты, типизация |
| **TailwindCSS** | Стилизация |
| **SQLite (better-sqlite3)** | Хранение всех данных сайта |
| **sharp** | Обработка фото (ресайз, конвертация в webp) |
| **JWT (jsonwebtoken)** | Аутентификация админов |
| **bcryptjs** | Хеширование паролей |
| **Docker** | Контейнеризация и деплой |

---

## Быстрый старт

### Локальная разработка

```bash
npm install
cp .env.example .env   # настроить JWT_SECRET, ADMIN_USER, ADMIN_PASSWORD
npm run dev
```

Сайт: `http://localhost:3000`
Админка: `http://localhost:3000/admin/login`

### Docker (продакшн)

```bash
cp .env.example .env   # настроить переменные
docker compose build
docker compose up -d
```

Контейнер слушает на порте **3000** (внутри). Nginx проксирует на `http://sementsov-frontend:3000`.

---

## Переменные окружения (.env)

| Переменная | Описание | Значение по умолчанию |
|------------|----------|-----------------------|
| `JWT_SECRET` | Секретный ключ для подписи JWT-токенов | обязательно сменить! |
| `ADMIN_USER` | Логин первого суперадмина (создаётся при seed) | `admin` |
| `ADMIN_PASSWORD` | Пароль первого суперадмина | `admin123` |

---

## Структура проекта

```
sementsov_landing/
├── data/                          # SQLite БД (Docker volume, в git не входит)
│   └── sementsov.db
├── uploads/                       # Загруженные фото (Docker volume, в git не входит)
│   └── team/
│       ├── {id}.webp              # Основное фото (900×1198)
│       └── {id}-thumb.webp        # Миниатюра (160×160)
├── public/                        # Статика (шрифты, иконки, исходные фото команды)
│   ├── fonts/
│   ├── team/                      # Исходные webp-фото (используются до загрузки через админку)
│   └── ...
├── src/
│   ├── app/
│   │   ├── page.tsx               # Главная страница (SSR, читает из БД)
│   │   ├── layout.tsx             # Корневой layout (SEO, метрика, шрифты)
│   │   ├── privacy/page.tsx       # Политика конфиденциальности
│   │   ├── admin/
│   │   │   ├── login/page.tsx     # Страница входа
│   │   │   ├── page.tsx           # Админ-панель (SSR, проверка авторизации)
│   │   │   ├── AdminPageClient.tsx # Клиентская часть админки (WYSIWYG-редактор)
│   │   │   ├── layout.tsx         # Layout админки (noindex)
│   │   │   └── users/
│   │   │       ├── page.tsx       # Управление пользователями (только superadmin)
│   │   │       └── UsersPageClient.tsx
│   │   └── api/                   # API-роуты
│   │       ├── auth/login/route.ts
│   │       ├── auth/me/route.ts
│   │       ├── team/route.ts          # GET, POST, PUT, DELETE
│   │       ├── team/upload/route.ts   # POST — загрузка фото
│   │       ├── team/reorder/route.ts  # PUT — изменение порядка
│   │       ├── services/route.ts      # GET, POST, PUT, DELETE
│   │       ├── cases/route.ts         # GET, POST, PUT, DELETE
│   │       ├── about/route.ts         # GET, PUT (текст + преимущества)
│   │       ├── contacts/route.ts      # GET, PUT
│   │       ├── hero/route.ts          # GET, PUT
│   │       ├── users/route.ts         # GET, POST, PUT, DELETE (superadmin)
│   │       └── uploads/[...path]/route.ts  # Отдача загруженных файлов
│   ├── components/
│   │   ├── Header.tsx             # Шапка (контакты из БД)
│   │   ├── Hero.tsx               # Hero-секция (данные из БД)
│   │   ├── About.tsx              # О коллегии + преимущества
│   │   ├── Services.tsx           # Услуги (бизнес + граждане)
│   │   ├── Team.tsx               # Команда адвокатов
│   │   ├── Cases.tsx              # Кейсы / практика
│   │   ├── ContactForm.tsx        # Форма обратной связи + контакты
│   │   ├── Footer.tsx             # Подвал (контакты из БД)
│   │   ├── AnimateOnScroll.tsx    # Анимации при скролле
│   │   └── ClientBody.tsx         # Клиентская обёртка body
│   ├── lib/
│   │   ├── db.ts                  # SQLite: схема, seed, все CRUD-функции
│   │   ├── auth.ts                # JWT sign/verify, bcrypt, getSessionUser
│   │   └── images.ts              # sharp: ресайз, webp, удаление фото
│   └── middleware.ts              # Защита /admin/* и /api/* роутов
├── Dockerfile                     # Multi-stage: builder → node:18-slim runner
├── docker-compose.yml             # Volumes, env, сеть
├── next.config.js                 # standalone output, serverExternalPackages
├── ADMIN-PLAN.md                  # Подробный план реализации админки
├── .env.example                   # Шаблон переменных окружения
├── .gitignore                     # data/, uploads/, .env, node_modules/
└── package.json
```

---

## База данных (SQLite)

Файл: `data/sementsov.db` — создаётся автоматически при первом запуске.

### Таблицы

| Таблица | Тип | Описание |
|---------|-----|----------|
| `team` | CRUD | Адвокаты: ФИО, должность, фото, краткое/полное био, ссылка, порядок |
| `services` | CRUD | Услуги: категория (business/personal), иконка, название, описание |
| `cases` | CRUD | Кейсы/практика: иконка, название, категория, описание |
| `case_links` | связь | Ссылки кейсов (многие-к-одному к cases) |
| `about` | синглтон | Текст «О коллегии» (два абзаца) |
| `advantages` | CRUD | Преимущества в секции About (иконка, заголовок, описание) |
| `contacts` | синглтон | Телефон, email, адрес, URL карты, координаты |
| `hero` | синглтон | Подзаголовок, заголовок, описание, 3 статистики |
| `users` | CRUD | Пользователи админки: логин, хеш пароля, роль |

### Seed (начальные данные)

При первом запуске (если таблица `team` пуста) автоматически заполняются все таблицы данными из текущего сайта: 11 адвокатов, 18 услуг, 4 кейса, текст About, 4 преимущества, контакты, hero-секция. Первый суперадмин создаётся из env-переменных `ADMIN_USER` / `ADMIN_PASSWORD`.

---

## Админ-панель

### Вход

**URL:** `/admin/login`

Логин и пароль. При успешном входе устанавливается JWT-cookie `admin_token` (срок: 7 дней). Неавторизованные пользователи автоматически перенаправляются на страницу входа.

### Концепция WYSIWYG

**URL:** `/admin`

Страница админки отрисовывает **те же секции сайта** (Hero → About → Services → Team → Cases → Contacts → Footer), но с наложенными кнопками редактирования:

- **Hover** на секцию → появляется кнопка «Редактировать»
- **Клик** → модальное окно с формой редактирования полей
- **Team**: карточки адвокатов с кнопками ✏️ редактировать и 🗑️ удалить; кнопка «+ Добавить адвоката»
- **Services / Cases**: аналогично — редактирование, удаление, добавление
- **Hero, About, Contacts**: редактирование через модалки
- Изменения сохраняются **по кнопке «Сохранить»**, секция обновляется без перезагрузки

### Тулбар

Вверху страницы — фиксированная панель вместо обычного хедера:
- Навигация по секциям (Hero, О коллегии, Услуги, Команда, Кейсы, Контакты)
- Ссылка «Пользователи» (только для superadmin)
- Текущий пользователь + кнопка «Выйти»

### Управление пользователями

**URL:** `/admin/users` (только superadmin)

- Список всех пользователей с ролями и датой создания
- Создание нового пользователя (логин + пароль + роль)
- Удаление пользователя
- Переключение роли superadmin ↔ admin
- **Ограничения безопасности:**
  - Нельзя забрать superadmin **у себя**
  - Нельзя забрать superadmin у **последнего** суперадмина
  - Нельзя удалить **себя**
  - Нельзя удалить **последнего** суперадмина

### Загрузка фото адвокатов

При загрузке фото через модалку редактирования адвоката:
1. Принимается файл (jpg/png/webp, до 10 MB)
2. **sharp** создаёт два варианта:
   - `{id}.webp` — основное фото (900×1198, fit cover, position top)
   - `{id}-thumb.webp` — миниатюра (160×160)
3. Файлы сохраняются в `uploads/team/` (Docker volume)
4. Отдаются через API-роут `/api/uploads/team/{id}.webp`
5. Старые файлы автоматически удаляются при замене

---

## API-роуты

### Аутентификация

| Метод | URL | Описание | Доступ |
|-------|-----|----------|--------|
| POST | `/api/auth/login` | Вход (username + password → JWT cookie) | публичный |
| GET | `/api/auth/me` | Текущий пользователь | авторизованный |

### Контент (публичный GET, авторизованный POST/PUT/DELETE)

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/team` | Все адвокаты (sort_order ASC) |
| POST | `/api/team` | Добавить адвоката |
| PUT | `/api/team` | Обновить адвоката |
| DELETE | `/api/team` | Удалить адвоката |
| POST | `/api/team/upload` | Загрузить фото (multipart/form-data: file + memberId) |
| PUT | `/api/team/reorder` | Изменить порядок (массив { id, sort_order }[]) |
| GET | `/api/services` | Все услуги |
| POST/PUT/DELETE | `/api/services` | CRUD услуг |
| GET | `/api/cases` | Все кейсы (с вложенными links) |
| POST/PUT/DELETE | `/api/cases` | CRUD кейсов |
| GET | `/api/about` | Текст About + массив advantages |
| PUT | `/api/about` | Обновить (about: {text1, text2}, advantages?: [...]) |
| GET | `/api/contacts` | Контакты (phone, email, address, map_url, lat, lng) |
| PUT | `/api/contacts` | Обновить контакты |
| GET | `/api/hero` | Hero-секция (subtitle, title, description, 3 stat) |
| PUT | `/api/hero` | Обновить hero |
| GET | `/api/uploads/[...path]` | Отдача загруженных файлов |

### Пользователи (только superadmin)

| Метод | URL | Описание |
|-------|-----|----------|
| GET | `/api/users` | Список пользователей (без паролей) |
| POST | `/api/users` | Создать пользователя (username, password, role) |
| PUT | `/api/users` | Изменить роль (id, role) |
| DELETE | `/api/users` | Удалить пользователя (id) |

---

## Middleware (защита роутов)

Файл: `src/middleware.ts`

Логика:
- `/admin/login` и `/api/auth/login` — всегда открыты
- `/api/uploads/*` GET — открыт (публичные файлы)
- `/admin/*` — требует JWT cookie `admin_token`, иначе редирект на login
- `/api/*` GET для контентных роутов (team, services, cases, about, contacts, hero) — открыт (данные для публичного сайта)
- `/api/*` POST/PUT/DELETE — требует JWT cookie или Bearer-токен

---

## Компоненты — архитектура props

Все компоненты публичного сайта получают данные через props из серверного компонента `page.tsx`, который читает из SQLite:

```
page.tsx (server) → читает из БД → передаёт props:
  → Header    (contacts)
  → Hero      (hero, contacts)
  → About     (about, advantages)
  → Services  (services)
  → Team      (members)
  → Cases     (cases)
  → ContactForm (contacts)
  → Footer    (contacts)
```

Каждый компонент поддерживает два режима:
- **Публичный сайт** — просто отображает данные
- **Админка** — те же данные + prop `editable={true}` + колбэки `onEdit`, `onDelete`, `onAdd`

Иконки из lucide-react рендерятся динамически через маппинг строковых имён (`"Scale"` → `<Scale />`) в компонентах About, Services, Cases.

---

## Docker

### Dockerfile

Двухстадийная сборка:
1. **builder** (`node:18-slim`) — `npm ci`, `npm run build`
2. **runner** (`node:18-slim`) — копирует `.next/standalone`, `.next/static`, `public`; запускает `node server.js`

### docker-compose.yml

```yaml
services:
  sementsov-frontend:
    build: .
    container_name: sementsov-frontend
    restart: unless-stopped
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - ADMIN_USER=${ADMIN_USER:-admin}
      - ADMIN_PASSWORD=${ADMIN_PASSWORD:-admin123}
    volumes:
      - sementsov-data:/app/data        # SQLite БД
      - sementsov-uploads:/app/uploads  # загруженные фото
    networks:
      - pustoshilov-lawyer_default      # общая сеть с nginx

volumes:
  sementsov-data:
  sementsov-uploads:
```

### Nginx

Внешний nginx-контейнер проксирует на `http://sementsov-frontend:3000`. Конфиг: `/srv/pustoshilov-lawyer/nginx/conf/app.conf`.

---

## Деплой (пересборка)

```bash
cd /srv/sementsov_landing
docker compose down
docker compose build --no-cache
docker compose up -d
docker exec nginx nginx -s reload   # если менялся nginx конфиг
```

### Проверка

```bash
docker logs sementsov-frontend --tail 20           # логи контейнера
curl -s https://sementsov.trust.moscow/ -o /dev/null -w "%{http_code}"  # 200
curl -s https://sementsov.trust.moscow/api/team | head -c 100           # JSON
```

---

## Важные файлы для понимания кодовой базы

| Файл | Что в нём | Зачем читать |
|------|-----------|--------------|
| `src/lib/db.ts` | Вся работа с БД: схема, seed, CRUD-функции, типы | Центральный файл данных |
| `src/lib/auth.ts` | JWT, bcrypt, getSessionUser | Логика авторизации |
| `src/lib/images.ts` | sharp-обработка фото | Пайплайн загрузки фото |
| `src/middleware.ts` | Защита роутов | Кто куда имеет доступ |
| `src/app/page.tsx` | Главная страница | Как данные из БД попадают в компоненты |
| `src/app/admin/AdminPageClient.tsx` | Вся логика админки | WYSIWYG-редактор, модалки, CRUD |
| `src/app/admin/users/UsersPageClient.tsx` | Управление пользователями | Роли, ограничения |
| `ADMIN-PLAN.md` | Исходный план реализации | Архитектурные решения, полная схема БД |

---

## Домены

- **Продакшн:** `https://sementsov.trust.moscow`
- **Админка:** `https://sementsov.trust.moscow/admin/login`
- **Редиректы:** `sementsov.ru`, `www.sementsov.ru` → `sementsov.trust.moscow`
