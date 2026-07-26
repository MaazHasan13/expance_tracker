import uuid
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from .. import crud, schemas
from ..database import get_db

router = APIRouter(prefix="/api/expenses", tags=["expenses"])


@router.get("", response_model=schemas.ExpenseListOut)
def list_expenses(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    category_id: Optional[uuid.UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    sort_by: str = Query("date", pattern="^(date|amount|title|created_at)$"),
    sort_dir: str = Query("desc", pattern="^(asc|desc)$"),
    db: Session = Depends(get_db),
):
    total, items = crud.get_expenses(
        db,
        skip=skip,
        limit=limit,
        category_id=category_id,
        start_date=start_date,
        end_date=end_date,
        search=search,
        sort_by=sort_by,
        sort_dir=sort_dir,
    )
    return schemas.ExpenseListOut(total=total, items=items)


@router.get("/{expense_id}", response_model=schemas.ExpenseOut)
def get_expense(expense_id: uuid.UUID, db: Session = Depends(get_db)):
    db_expense = crud.get_expense(db, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    return db_expense


@router.post("", response_model=schemas.ExpenseOut, status_code=201)
def create_expense(expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    if expense.category_id and not crud.get_category(db, expense.category_id):
        raise HTTPException(status_code=400, detail="Category does not exist")
    return crud.create_expense(db, expense)


@router.put("/{expense_id}", response_model=schemas.ExpenseOut)
def update_expense(expense_id: uuid.UUID, changes: schemas.ExpenseUpdate, db: Session = Depends(get_db)):
    db_expense = crud.get_expense(db, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    if changes.category_id and not crud.get_category(db, changes.category_id):
        raise HTTPException(status_code=400, detail="Category does not exist")
    return crud.update_expense(db, db_expense, changes)


@router.delete("/{expense_id}", status_code=204)
def delete_expense(expense_id: uuid.UUID, db: Session = Depends(get_db)):
    db_expense = crud.get_expense(db, expense_id)
    if not db_expense:
        raise HTTPException(status_code=404, detail="Expense not found")
    crud.delete_expense(db, db_expense)
    return None
