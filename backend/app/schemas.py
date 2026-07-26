import uuid
from datetime import date, datetime
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict

from .models import PaymentMethod


# ---------- Category ----------

class CategoryBase(BaseModel):
    name: str = Field(..., max_length=64)
    color: str = Field(default="#2DD4BF", max_length=7)
    icon: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None


class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime


# ---------- Expense ----------

class ExpenseBase(BaseModel):
    title: str = Field(..., max_length=120)
    description: Optional[str] = None
    amount: float = Field(..., gt=0)
    date: date
    payment_method: PaymentMethod = PaymentMethod.card
    category_id: Optional[uuid.UUID] = None


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    amount: Optional[float] = Field(default=None, gt=0)
    date: Optional[date] = None
    payment_method: Optional[PaymentMethod] = None
    category_id: Optional[uuid.UUID] = None


class ExpenseOut(ExpenseBase):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryOut] = None


class ExpenseListOut(BaseModel):
    total: int
    items: List[ExpenseOut]


# ---------- Stats ----------

class CategoryBreakdown(BaseModel):
    category_id: Optional[uuid.UUID]
    category_name: str
    color: str
    total: float
    count: int


class MonthlyTrendPoint(BaseModel):
    month: str  # YYYY-MM
    total: float


class SummaryOut(BaseModel):
    total_all_time: float
    total_this_month: float
    total_last_month: float
    month_over_month_pct: Optional[float]
    expense_count: int
    average_expense: float
    by_category: List[CategoryBreakdown]
    trend: List[MonthlyTrendPoint]
