from pydantic import BaseModel, validator, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"


class SalesStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    FAILED = "failed"
    REFUNDED = "refunded"


class SalesItem(BaseModel):
    product_id: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)
    price: Optional[float] = Field(None, gt=0)

    @validator("quantity")
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be positive")
        return v

    @validator("price")
    def price_must_be_positive(cls, v):
        if v is not None and v <= 0:
            raise ValueError("Price must be positive")
        return round(v, 2) if v is not None else v


class CreateSalesItem(BaseModel):
    product_id: str = Field(..., min_length=1)
    quantity: int = Field(..., gt=0)

    @validator("quantity")
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be positive")
        return v


class CreateSaleRequest(BaseModel):
    items: List[CreateSalesItem] = Field(..., min_items=1)
    payment_method: PaymentMethod
    status: SalesStatus = SalesStatus.COMPLETED

    @validator("items")
    def validate_items_not_empty(cls, v):
        if not v:
            raise ValueError("At least one item is mandatory")
        return v


class SaleResponse(BaseModel):
    id: str
    items: List[SalesItem]
    total: float
    payment_method: PaymentMethod
    status: SalesStatus
    creator_id: str
    created_at: datetime

    class Config:
        from_attributes = True
