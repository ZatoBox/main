from pydantic import BaseModel, validator, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum


class PaymentMethod(str, Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    # PIX = 'pix'
    CASH = "cash"
    BANK_TRANSFER = "bank_transfer"


class SalesStatus(str, Enum):
    PENDING = "pending"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class SalesItem(BaseModel):
    product_id: int = Field(..., gt=0, description="Product ID")
    quantity: int = Field(..., gt=0, description="Quantity")
    price: float = Field(..., gt=0, description="Price")

    @validator("quantity")
    def quantity_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Quantity must be positive")
        return v

    @validator("price")
    def price_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Price must be positive")
        return round(v, 2)


class CreateSaleRequest(BaseModel):
    items: List[SalesItem] = Field(..., min_items=1, description="Sale items list")
    total: float = Field(..., gt=0, description="Total sale")
    payment_method: PaymentMethod = Field(..., description="Payment method")
    status: SalesStatus = Field(SalesStatus.COMPLETED, description="Sale status")

    @validator("items")
    def validate_items_not_empty(cls, v):
        if not v:
            raise ValueError("At least one item is mandatory")
        return v

    @validator("total")
    def validate_total_matches_items(cls, v, values):
        if "items" in values:
            calculate_total = sum(
                item.quantity * item.price for item in values["items"]
            )
            if abs(v - calculate_total) > 0.01:
                raise ValueError("Total does not confer with the sum of the items")
        return round(v, 2)


class SaleResponse(BaseModel):
    id: int
    items: List[SalesItem]
    total: float
    payment_method: PaymentMethod
    status: SalesStatus
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True  # For compatibility with sqlalchemy
