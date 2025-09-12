from typing import Optional, List
from pydantic import BaseModel, Field
from uuid import UUID


class Product(BaseModel):
    id: UUID
    name: Optional[str] = None
    status: Optional[str] = None


class Inventory(BaseModel):
    id: Optional[UUID] = None
    inventory_owner: Optional[UUID] = None
    products: List[Product] = Field(default_factory=list)
    created_at: Optional[str] = None
    last_updated: Optional[str] = None


class InventoryResponse(BaseModel):
    success: bool
    inventory: Optional[Inventory] = None
    total_products: int = 0
    total_stock: Optional[int] = None
    low_stock_count: Optional[int] = None
