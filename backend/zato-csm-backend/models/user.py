from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class RoleUser(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"


class UserItem(BaseModel):
    full_name: str = Field(..., min_length=1, description="User full name")
    email: EmailStr = Field(..., description="User email")
    role: RoleUser = Field(RoleUser.USER, description="User role")
    phone: Optional[str] = Field(None, min_length=1, description="User phone")
