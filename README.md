## StroyControl (server)

Backend сервис для учёта выполненных работ

### Стек

- **NestJS (TypeScript)**: структурированный backend-фреймворк, удобно расширять и тестировать
- **Prisma + PostgreSQL**: типобезопасный доступ к БД и простые миграции
- **Docker Compose (PostgreSQL)**: быстрый локальный запуск БД без установки Postgres
- **pnpm**: быстрый пакетный менеджер
- **Biome + ESLint**: проверка качества кода и форматирование
- **Bruno**: коллекции HTTP-запросов для ручной проверки API

### Запуск

#### 1) Поднять PostgreSQL в Docker

В корне `server/`:

переименовать `.env.example` -> `.env`, отредактировать, если требуется

```bash
pnpm run db:up
```

#### 2) Установить зависимости

```bash
pnpm install
```

#### 3) Засеять базу демо-данными

```bash
pnpm run db:seed
```

#### 4) Применить миграции и запустить сервер

```bash
pnpm run start:dev
```

Сервер поднимется на `http://localhost:3000`

- API префикс: `http://localhost:3000/api`
- Health-check: `http://localhost:3000/health`

### CORS

Разрешённый origin задаётся переменной `CORS_ORIGIN` в `.env`
По умолчанию: `http://localhost:5173`
