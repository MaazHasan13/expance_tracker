import uuid
from datetime import date, datetime, timedelta
from typing import Optional

from sqlalchemy import func, extract, or_
from sqlalchemy.orm import Session

from . import models, schemas


# ---------- Categories ----------

def get_categories(db: Session):
    return db.query(models.Category).order_by(models.Category.name).all()


def get_category(db: Session, category_id: uuid.UUID):
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def get_category_by_name(db: Session, name: str):
    return db.query(models.Category).filter(func.lower(models.Category.name) == name.lower()).first()


def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def update_category(db: Session, db_category: models.Category, changes: schemas.CategoryUpdate):
    for key, value in changes.model_dump(exclude_unset=True).items():
        setattr(db_category, key, value)
    db.commit()
    db.refresh(db_category)
    return db_category


def delete_category(db: Session, db_category: models.Category):
    db.delete(db_category)
    db.commit()


# ---------- Expenses ----------

def get_expenses(
    db: Session,
    skip: int = 0,
    limit: int = 50,
    category_id: Optional[uuid.UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    sort_by: str = "date",
    sort_dir: str = "desc",
):
    query = db.query(models.Expense)

    if category_id:
        query = query.filter(models.Expense.category_id == category_id)
    if start_date:
        query = query.filter(models.Expense.date >= start_date)
    if end_date:
        query = query.filter(models.Expense.date <= end_date)
    if search:
        like = f"%{search}%"
        query = query.filter(
            or_(models.Expense.title.ilike(like), models.Expense.description.ilike(like))
        )

    total = query.count()

    sort_column = getattr(models.Expense, sort_by, models.Expense.date)
    if sort_dir == "asc":
        query = query.order_by(sort_column.asc())
    else:
        query = query.order_by(sort_column.desc())

    items = query.offset(skip).limit(limit).all()
    return total, items


def get_expense(db: Session, expense_id: uuid.UUID):
    return db.query(models.Expense).filter(models.Expense.id == expense_id).first()


def create_expense(db: Session, expense: schemas.ExpenseCreate):
    db_expense = models.Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def update_expense(db: Session, db_expense: models.Expense, changes: schemas.ExpenseUpdate):
    for key, value in changes.model_dump(exclude_unset=True).items():
        setattr(db_expense, key, value)
    db.commit()
    db.refresh(db_expense)
    return db_expense


def delete_expense(db: Session, db_expense: models.Expense):
    db.delete(db_expense)
    db.commit()


# ---------- Stats ----------

def get_summary(db: Session):
    today = date.today()
    this_month_start = today.replace(day=1)
    last_month_end = this_month_start - timedelta(days=1)
    last_month_start = last_month_end.replace(day=1)

    total_all_time = db.query(func.coalesce(func.sum(models.Expense.amount), 0.0)).scalar()
    total_this_month = (
        db.query(func.coalesce(func.sum(models.Expense.amount), 0.0))
        .filter(models.Expense.date >= this_month_start)
        .scalar()
    )
    total_last_month = (
        db.query(func.coalesce(func.sum(models.Expense.amount), 0.0))
        .filter(models.Expense.date >= last_month_start, models.Expense.date <= last_month_end)
        .scalar()
    )
    expense_count = db.query(func.count(models.Expense.id)).scalar()

    mom_pct = None
    if total_last_month and total_last_month > 0:
        mom_pct = ((total_this_month - total_last_month) / total_last_month) * 100

    average_expense = (total_all_time / expense_count) if expense_count else 0.0

    # By category breakdown
    rows = (
        db.query(
            models.Category.id,
            models.Category.name,
            models.Category.color,
            func.coalesce(func.sum(models.Expense.amount), 0.0).label("total"),
            func.count(models.Expense.id).label("count"),
        )
        .outerjoin(models.Expense, models.Expense.category_id == models.Category.id)
        .group_by(models.Category.id, models.Category.name, models.Category.color)
        .order_by(func.sum(models.Expense.amount).desc().nullslast())
        .all()
    )
    by_category = [
        schemas.CategoryBreakdown(
            category_id=row.id,
            category_name=row.name,
            color=row.color,
            total=float(row.total or 0.0),
            count=row.count,
        )
        for row in rows
    ]

    # Uncategorized
    uncategorized_total = (
        db.query(func.coalesce(func.sum(models.Expense.amount), 0.0))
        .filter(models.Expense.category_id.is_(None))
        .scalar()
    )
    if uncategorized_total:
        uncategorized_count = (
            db.query(func.count(models.Expense.id))
            .filter(models.Expense.category_id.is_(None))
            .scalar()
        )
        by_category.append(
            schemas.CategoryBreakdown(
                category_id=None,
                category_name="Uncategorized",
                color="#6B7280",
                total=float(uncategorized_total),
                count=uncategorized_count,
            )
        )

    # Trend: last 6 months
    trend_rows = (
        db.query(
            extract("year", models.Expense.date).label("year"),
            extract("month", models.Expense.date).label("month"),
            func.coalesce(func.sum(models.Expense.amount), 0.0).label("total"),
        )
        .group_by("year", "month")
        .order_by("year", "month")
        .all()
    )
    trend = [
        schemas.MonthlyTrendPoint(month=f"{int(r.year):04d}-{int(r.month):02d}", total=float(r.total))
        for r in trend_rows
    ][-6:]

    return schemas.SummaryOut(
        total_all_time=float(total_all_time or 0.0),
        total_this_month=float(total_this_month or 0.0),
        total_last_month=float(total_last_month or 0.0),
        month_over_month_pct=mom_pct,
        expense_count=expense_count,
        average_expense=float(average_expense),
        by_category=by_category,
        trend=trend,
    )
