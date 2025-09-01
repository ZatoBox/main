from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List
from datetime import datetime


class InventoryItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    min_stock: int
    category_id: str
    images: List[str] = []
    status: str
    weight: Optional[float]
    sku: Optional[str]
    creator_id: str
    unit: str
    product_type: str
    localization: Optional[str]
    created_at: datetime
    last_updated: datetime


class Inventory(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    inventory_owner: str
    products: Dict[str, InventoryItem] = Field(default_factory=dict)  # JSONB structure


class InventoryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    success: bool
    inventory: List[InventoryItem]
    total_products: int
    total_stock: int
    low_stock_count: int


class InventoryUpdateRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: str
    quantity: int
    reason: Optional[str] = None
