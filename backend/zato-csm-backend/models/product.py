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

class ProductUnity(str, Enum):
    PER_ITEM = "Per item"
    PER_KILOGRAM = "Per kilogram"
    PER_LITER = "Per liter"

class CreateProductRequest(BaseModel):
    # Default fields
    name: str = Field(..., min_length=1, description="Product name")
    price: float = Field(..., gt=0, description="Product price")
    stock: int = Field(..., gt=0, description="Product stock")
    unit: ProductUnity = Field(...)
    product_type: ProductType = Field(...)

    # Optional fields
    description: Optional[str] = Field(None, description="Product description")
    category_id: Optional[str] = Field(None, description="Product category", gt=0)
    sku: Optional[str] = Field(None, max_length=255, description="Product SKU")
    weight: Optional[float] = Field(None, gt=0, description="Product weight")
    localization: Optional[str] = Field(None, description="Product localization")
    min_stock: Optional[int] = Field(..., gt=0, description="Product minimum stock")
    status: ProductStatus = Field(ProductStatus.ACTIVE)

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
    category_id: Optional[str] = Field(None, gt=0)
    sku: Optional[str] = Field(None, max_length=255)
    weight: Optional[float] = Field(None, ge=0)
    localization: Optional[str] = Field(None)
    min_stock: Optional[int] = Field(None, ge=0)
    status: Optional[ProductStatus] = Field(None)
    product_type: Optional[ProductType] = Field(None)
    unit: Optional[ProductUnity] = Field(None)


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    min_stock: int
    category_id: Optional[int]
    images: Optional[List[str]] = []
    status: str
    weight: Optional[float]
    sku: Optional[str]
    creator_id: Optional[int]
    unit: str
    product_type: str
    created_at: datetime
    last_updated: datetime
    localization: Optional[str]

    class Config:
        from_attributes = True

