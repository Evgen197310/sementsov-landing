# МКА «Семенцов и Партнёры» — Официальный сайт

Многостраничный сайт Московской коллегии адвокатов «Семенцов и Партнёры».  
Построен на **Next.js 15** (App Router, Server Components) + **Prisma ORM** (SQLite) + **TailwindCSS**.  
Разворачивается через **Docker** с внешним реверс-прокси (Nginx).

---

## Технологический стек

| Слой | Технология |
|---|---|
| Фреймворк | Next.js 15.3 (App Router, Turbopack dev) |
| Язык | TypeScript 5.8 |
| ORM / БД | Prisma 6.19 + SQLite |
| Стили | TailwindCSS 3.4 + tailwindcss-animate |
| UI-компоненты | Lucide React (иконки), CVA + clsx + tailwind-merge |
| Шрифты | Playfair Display, Open Sans (локальные woff2) |
| Контейнеризация | Docker (multi-stage build), Docker Compose |
| Деплой | standalone-режим Next.js, реверс-прокси Nginx |

---

## Структура проекта

```
sementsov_landing/
├── prisma/
│   ├── schema.prisma          # Схема БД (15 моделей)
│   ├── seed.ts                # Начальные данные
│   └── migrations/            # Миграции Prisma
├── prisma.config.ts           # Конфиг Prisma
├── public/
│   ├── favicon.ico
│   ├── logo.png
│   ├── og-image.png
│   ├── fonts/                 # Локальные шрифты (woff2)
│   ├── team/                  # Фото адвокатов (webp)
│   └── news/images/           # Изображения к новостям (webp)
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Корневой layout (Header + Footer)
│   │   ├── page.tsx           # Главная страница
│   │   ├── globals.css        # Глобальные стили + Tailwind
│   │   ├── about/             # О коллегии
│   │   ├── team/              # Команда адвокатов + [slug]
│   │   ├── services/          # Услуги: individuals, legal, mediation
│   │   ├── practice/          # Судебная практика + [slug]
│   │   ├── media/             # СМИ: news, press, publications, legislation
│   │   ├── documents/         # Правовые документы
│   │   ├── partners/          # Партнёры
│   │   ├── contacts/          # Контакты
│   │   ├── career/            # Карьера
│   │   ├── admin/             # Админ-панель (11 разделов)
│   │   │   ├── login/         # Авторизация
│   │   │   ├── team/          # Управление командой
│   │   │   ├── services/      # Управление услугами
│   │   │   ├── news/          # Управление новостями
│   │   │   ├── media/         # Управление СМИ
│   │   │   ├── practice/      # Управление практикой
│   │   │   ├── partners/      # Управление партнёрами
│   │   │   ├── documents/     # Управление документами
│   │   │   ├── publications/  # Управление публикациями
│   │   │   ├── pages/         # Управление страницами
│   │   │   └── messages/      # Входящие заявки
│   │   └── api/               # API-роуты (REST)
│   ├── components/
│   │   ├── Header.tsx         # Шапка с навигацией
│   │   └── Footer.tsx         # Подвал
│   └── lib/
│       └── db.ts              # Prisma-клиент (singleton)
├── Dockerfile                 # Multi-stage сборка
├── docker-compose.yml         # Конфигурация сервиса
├── docker-entrypoint.sh       # Entrypoint: копирование seed-БД при первом запуске
├── .dockerignore
├── next.config.js             # standalone output + Prisma external packages
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── .gitignore
```

---

## Модели данных (Prisma)

| Модель | Описание |
|---|---|
| `Admin` | Администраторы (логин + bcrypt-хеш) |
| `TeamMember` | Адвокаты и сотрудники (ФИО, slug, фото, должность, специализация, био) |
| `ServiceCategory` | Категории услуг (физлица / юрлица / медиация) |
| `Service` | Услуги (привязка к категории, контент, FAQ) |
| `ServiceFaq` | FAQ к услугам (cascade delete) |
| `NewsArticle` | Новости коллегии (с вложениями) |
| `MediaCategory` | Рубрики СМИ |
| `MediaArticle` | Статьи из СМИ (источник, теги) |
| `PracticeCategory` | Категории судебной практики |
| `PracticeCase` | Дела (ситуация → действия → результат) |
| `Partner` | Партнёры коллегии |
| `Document` | Правовые документы (ссылка на файл) |
| `Publication` | Публикации адвокатов |
| `Page` | Произвольные текстовые страницы |
| `ContactMessage` | Заявки с сайта (имя, email, телефон, сообщение) |

---

## Быстрый старт (разработка)

```bash
# 1. Клонировать репозиторий
git clone https://github.com/Evgen197310/sementsov_landing.git
cd sementsov_landing

# 2. Установить зависимости
npm ci

# 3. Создать файл окружения
echo 'DATABASE_URL="file:./dev.db"' > .env

# 4. Применить миграции и засеять БД
npx prisma migrate deploy
npx tsx prisma/seed.ts

# 5. Сгенерировать Prisma Client
npx prisma generate

# 6. Запустить dev-сервер
npm run dev
# → http://localhost:3000
```

Админ-панель: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Продакшен (Docker)

```bash
# Сборка и запуск
docker compose up -d --build

# Контейнер стартует на порте 3000
# Данные сохраняются в Docker volume sementsov-data
# При первом запуске seed-БД копируется в /app/data/prod.db
```

### Как это работает

1. **Multi-stage build**: сборка Next.js в standalone-режиме
2. **Entrypoint** (`docker-entrypoint.sh`): при первом старте копирует seed-БД в persistent volume
3. **Volume** `sementsov-data` → `/app/data` — данные переживают пересборку контейнера
4. Контейнер подключается к внешней Docker-сети `pustoshilov-lawyer_default` для работы через общий Nginx реверс-прокси

---

## Переменные окружения

| Переменная | Описание | Пример |
|---|---|---|
| `DATABASE_URL` | Путь к SQLite-файлу | `file:./dev.db` (dev) / `file:/app/data/prod.db` (prod) |

---

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Dev-сервер с Turbopack (0.0.0.0:3000) |
| `npm run build` | Продакшен-сборка (standalone) |
| `npm run start` | Запуск продакшен-сервера |
| `npx prisma studio` | Веб-интерфейс для просмотра БД |
| `npx prisma migrate dev` | Создать новую миграцию |
| `npx prisma migrate deploy` | Применить миграции |

---

## Лицензия

Проект является собственностью МКА «Семенцов и Партнёры». Все права защищены.
