from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .database import engine, SessionLocal
from .routers import expenses, categories, stats

DEFAULT_CATEGORIES = [
    {"name": "Food & Dining", "color": "#E8A33D", "icon": "utensils"},
    {"name": "Transport", "color": "#2DD4BF", "icon": "car"},
    {"name": "Shopping", "color": "#C084FC", "icon": "shopping-bag"},
    {"name": "Bills & Utilities", "color": "#F87171", "icon": "receipt"},
    {"name": "Entertainment", "color": "#60A5FA", "icon": "clapperboard"},
    {"name": "Health", "color": "#4ADE80", "icon": "heart-pulse"},
    {"name": "Groceries", "color": "#FBBF24", "icon": "shopping-cart"},
    {"name": "Rent & Housing", "color": "#F472B6", "icon": "home"},
    {"name": "Travel", "color": "#38BDF8", "icon": "plane"},
    {"name": "Other", "color": "#94A3B8", "icon": "more-horizontal"},
]


def seed_categories():
    db = SessionLocal()
    try:
        existing = db.query(models.Category).count()
        if existing == 0:
            for cat in DEFAULT_CATEGORIES:
                db.add(models.Category(**cat))
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    models.Base.metadata.create_all(bind=engine)
    seed_categories()
    yield


app = FastAPI(title="Expense Tracker API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router)
app.include_router(categories.router)
app.include_router(stats.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}
