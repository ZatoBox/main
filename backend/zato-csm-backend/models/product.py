from pydantic import BaseModel, validator, Field
from typing import List, Optional
from datetime import datetime
from enum import Enum

class ProductType(str, Enum):
    PHYSICAL_PRODUCT = "Physical Product"
    SERVICE = "Service"
    DIGITAL = "Digital"

class ProductStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"

class CreateProductRequest(BaseModel):
    name: str = Field(..., min_length=1, description="Product name")
    price: float = Field(..., gt=0, description="Product price")
    stock: int = Field(..., gt=0, description="Product stock")
    unit_id: str = Field(..., min_length=1, description="Product unit")
    product_type: ProductType = Field(..., default=ProductType.PHYSICAL_PRODUCT, description="Product type")

    images: List[str] = []

    # Optional fields
    description: Optional[str] = Field(None, description="Product description")
    category: Optional[str] = Field(None, description="Product category")
    sku: Optional[str] = Field(None, description="Product SKU")
    weight: float = Field(..., gt=0, description="Product weight")
    localization: Optional[str] = Field(None, description="Product localization")
    min_stock: int = Field(..., gt=0, description="Product minimum stock")
    status: str = Field(..., min_length=1, default=ProductStatus.ACTIVE, description="Product status")

    @validator("name")
    def validate_name(cls, v):
        if not v:
            raise ValueError("Name is mandatory")
        return v

    @validator("sku")
    def validate_price(cls, v):
        if v and len(v.strip()) == 0:
            return None
        return v

class UpdateProductRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = Field(None)
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    category: Optional[str] = Field(None, max_length=100)
    sku: Optional[str] = Field(None, max_length=255)
    weight: Optional[float] = Field(None, ge=0)
    localization: Optional[str] = Field(None)
    status: Optional[ProductStatus] = Field(None)
    product_type: Optional[ProductType] = Field(None)
    unit_id: Optional[int] = Field(None, gt=0)


def ProductResponse(product):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    category: Optional[str]
    images: Optional[List[str]] = []
    status: str
    weight: Optional[float]
    sku: Optional[str]
    creator_id: Optional[int]
    unit_id: int
    product_type: str
    created_at: datetime
    last_updated: datetime
    localization: Optional[str]

    class Config:
        from_attributes = True

