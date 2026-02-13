# Вишлист — списки желаний с реалтаймом

Пользователь создаёт вишлисты (день рождения, Новый год и т.д.), добавляет товары (название, ссылка, цена, картинка), делится списком по ссылке. Друзья видят список без регистрации, могут зарезервировать подарок или скинуться. Владелец не видит, кто что зарезервировал или внёс. Обновления (резерв, вклад) отображаются в реальном времени по WebSocket.

## Стек

- **Frontend:** Next.js 16, React, Tailwind, Zustand
- **Backend:** FastAPI, SQLAlchemy 2 (async), PostgreSQL
- **Реалтайм:** WebSocket (подписка на вишлист по id)

## Исправление типичных ошибок

1. **Backend не запускается / `ModuleNotFoundError: No module named 'jose'`**  
   Установите зависимости из папки Backend:
   ```bash
   cd Backend && pip install -r requirements.txt
   ```
   (лучше в виртуальном окружении: `python -m venv .venv` и `source .venv/bin/activate` или `.venv\Scripts\activate`).

2. **Frontend: `Module not found: Can't resolve '@/lib/auth-store'`**  
   В `Frontend/tsconfig.json` путь для алиаса `@/` должен указывать на `src`:
   ```json
   "paths": { "@/*": ["./src/*"] }
   ```

3. **Frontend: JSX parse error в `app/w/[slug]/page.tsx`**  
   В тернарном выражении `!isReserveOpen ? (...) : null` должна быть явная вторая ветка (`: null`), иначе парсер падает.

4. **Таблицы в БД не созданы**  
   Выполните один раз из папки Backend (при запущенном PostgreSQL):
   ```bash
   cd Backend && python -m scripts.init_db
   ```

5. **Frontend не видит API / CORS / 401**  
   В `Frontend/.env.local` задайте `NEXT_PUBLIC_API_URL` (URL бэкенда без слэша в конце, например `https://api.example.com` или `http://localhost:8000`). После изменений перезапустите `npm run dev`. На бэкенде в `.env` в `CORS_ORIGINS` должен быть указан адрес фронта (например `http://localhost:3000` или ваш домен).

## Локальный запуск

### 1. PostgreSQL

Поднимите БД (например Docker):

```bash
docker run -d --name wishlist-db -e POSTGRES_USER=wishlist -e POSTGRES_PASSWORD=wishlist -e POSTGRES_DB=wishlist_ai -p 5432:5432 postgres:16-alpine
```

### 2. Backend

```bash
cd Backend
python -m venv .venv
source .venv/bin/activate   # или .venv\Scripts\activate на Windows
pip install -r requirements.txt
```

Создайте `.env` в `Backend/` (или экспортируйте переменные):

```
DATABASE_URL=postgresql+asyncpg://wishlist:wishlist@localhost:5432/wishlist_ai
SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:3000
```

Создайте таблицы:

```bash
python -m scripts.init_db
```

Запуск API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

(Из корня репозитория: `cd Backend && uvicorn app.main:app --reload --port 8000`)

### 3. Frontend

Создайте в папке `Frontend` файл `.env.local` (можно скопировать из `.env.example`) и укажите URL вашего API:

```
NEXT_PUBLIC_API_URL=https://your-backend.com
```

Без протокола и с лишними слэшами в конце — подправятся автоматически. После изменения `.env.local` перезапустите dev-сервер (`npm run dev`).

```bash
cd Frontend
npm install
npm run dev
```

Откройте http://localhost:3000. Если API на другом порту (например локально):

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Деплой (Docker Compose)

Из корня репозитория:

```bash
docker compose up -d
```

- Frontend: http://localhost:3000  
- Backend: http://localhost:8000  
- API docs: http://localhost:8000/docs  

Перед первым запуском создайте таблицы в контейнере БД:

```bash
docker compose exec backend python -m scripts.init_db
```

Для продакшена задайте в окружении (или в `docker-compose.override.yml`):

- `SECRET_KEY` — надёжный секрет для JWT
- `CORS_ORIGINS` — домен фронтенда (например `https://your-app.vercel.app`)
- `NEXT_PUBLIC_API_URL` при сборке фронтенда — URL вашего API

## Поведение продукта

- **Пустой вишлист:** владелец видит приглашение «Добавить подарок»; по публичной ссылке — сообщение «В этом списке пока нет подарков».
- **Просмотр по ссылке без регистрации:** гость открывает `/w/{slug}`, видит список, прогресс сборов и может резервировать/вносить вклад (имя по желанию).
- **Минимальный вклад:** не задаётся — можно вносить любую сумму до остатка.
- **Если сумма не набралась:** показывается «Собрано X из Y ₽»; можно продолжать вносить вклады до полной суммы (или оставить как есть).
- **Реалтайм:** при резерве или вкладе все открытые страницы этого вишлиста получают обновление по WebSocket (прогресс и счётчик участников) без перезагрузки.

## Основные эндпоинты

| Метод | Путь | Описание |
|-------|------|----------|
| POST | /api/auth/register | Регистрация (email, password, name) |
| POST | /api/auth/login | Вход (email, password) → access + refresh token |
| GET | /api/wishlists | Список вишлистов пользователя (JWT) |
| POST | /api/wishlists | Создать вишлист (JWT) |
| GET | /api/wishlists/:id/items | Список товаров вишлиста (JWT) |
| POST | /api/wishlists/:id/items | Добавить товар (JWT) |
| GET | /api/public/wishlists/by-slug/:slug | Публичный вишлист по slug (без авторизации) |
| POST | /api/wishlists/:id/items/:itemId/reservations | Резерв/вклад (JWT опционально, можно гость) |
| WS | /api/ws/wishlist/:id | Подписка на реалтайм-обновления вишлиста |
