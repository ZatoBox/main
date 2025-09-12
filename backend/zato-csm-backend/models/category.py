from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional


class Category(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    created_at: Optional[datetime] = None
    last_updated: Optional[datetime] = None


class CategoryResponse(BaseModel):
    success: bool
    category: Category


class CategoriesResponse(BaseModel):
    success: bool
    categories: list[Category]
