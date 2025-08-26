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
    PER_METRO = "Per metro"


class CreateProductRequest(BaseModel):
    name: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)
    stock: int = Field(..., ge=0)
    unit: ProductUnity = Field(...)
    product_type: ProductType = Field(...)
    category_id: str = Field(..., min_length=1, description="UUID de la categoría")

    description: Optional[str] = None
    sku: Optional[str] = Field(None, max_length=255)
    weigth: Optional[float] = Field(
        None, gt=0, description="Peso (columna se llama 'weigth')"
    )
    localization: Optional[str] = None
    min_stock: int = Field(0, ge=0)
    status: ProductStatus = Field(ProductStatus.ACTIVE)

    @validator("sku")
    def _normalize_sku(cls, v):
        if v is not None and v.strip() == "":
            return None
        return v


class UpdateProductRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    category_id: Optional[str] = None
    sku: Optional[str] = Field(None, max_length=255)
    weigth: Optional[float] = Field(None, ge=0)
    localization: Optional[str] = None
    min_stock: Optional[int] = Field(None, ge=0)
    status: Optional[ProductStatus] = None
    product_type: Optional[ProductType] = None
    unit: Optional[ProductUnity] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    price: float
    stock: int
    min_stock: int
    category_id: str
    images: Optional[List[str]] = []
    status: str
    weigth: Optional[float]
    sku: Optional[str]
    creator_id: Optional[str]
    unit: str
    product_type: str
    created_at: datetime
    last_updated: datetime
    localization: Optional[str]

    class Config:
        from_attributes = True
        fields = {"weigth": "weigth"}
