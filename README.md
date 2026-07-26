# Ledger — Expense Tracker

A full-stack expense tracker: **FastAPI + PostgreSQL** backend, **React (Vite, JavaScript) + Tailwind** frontend, styled like a physical ledger/receipt — dark ink background, warm paper-colored cards, monospace numbers.

```
expense-tracker/
├── backend/          FastAPI + SQLAlchemy + PostgreSQL
├── frontend/          React (Vite, JS) + Tailwind + Recharts
└── docker-compose.yml Postgres + backend, one command
```

## Features

- Add / edit / delete expenses with title, amount, date, category, payment method, notes
- Custom categories with colors and icons
- Dashboard: this month vs last month, month-over-month %, category breakdown donut, 6-month trend chart, recent transactions
- Full expense list with search, category filter, date-range filter, pagination
- Clean REST API, auto-generated docs at `/docs`

## Quickest start (Docker)

Requires Docker + Docker Compose.

```bash
docker compose up --build
```

This starts Postgres on `5432` and the API on `8000` (`http://localhost:8000/docs` for interactive API docs). Then run the frontend separately (see below) — it proxies `/api` to `localhost:8000`.

## Manual setup

### 1. PostgreSQL

Create a database (adjust credentials as you like):

```bash
createdb expense_tracker
# or, with psql:
psql -U postgres -c "CREATE DATABASE expense_tracker;"
```

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # edit DATABASE_URL if needed
uvicorn app.main:app --reload --port 8000
```

The API creates its tables and seeds default categories automatically on first startup. Docs live at `http://localhost:8000/docs`.

### 3. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite dev server proxies `/api/*` requests to `http://localhost:8000`, so no extra config is needed.

## API overview

| Method | Endpoint                | Description                          |
|--------|-------------------------|---------------------------------------|
| GET    | `/api/expenses`         | List expenses (filters, search, pagination) |
| POST   | `/api/expenses`         | Create an expense                    |
| GET    | `/api/expenses/{id}`    | Get one expense                      |
| PUT    | `/api/expenses/{id}`    | Update an expense                    |
| DELETE | `/api/expenses/{id}`    | Delete an expense                    |
| GET    | `/api/categories`       | List categories                      |
| POST   | `/api/categories`       | Create a category                    |
| PUT    | `/api/categories/{id}`  | Update a category                    |
| DELETE | `/api/categories/{id}`  | Delete a category (expenses become uncategorized) |
| GET    | `/api/stats/summary`    | Totals, month-over-month %, category breakdown, 6-month trend |

Query params on `GET /api/expenses`: `skip`, `limit`, `category_id`, `start_date`, `end_date`, `search`, `sort_by` (`date`/`amount`/`title`/`created_at`), `sort_dir` (`asc`/`desc`).

## Production notes

- Set `CORSMiddleware` `allow_origins` to your real frontend domain instead of `*`.
- Consider Alembic for schema migrations instead of `create_all` once the schema needs to evolve.
- Put the frontend behind a reverse proxy (nginx/Caddy) that forwards `/api` to the FastAPI service, and serve the built `frontend/dist` as static files (`npm run build`).
# expance_tracker
