from pydantic import BaseModel, validator, Field, EmailStr
from typing import Optional
from datetime import datetime
from enum import Enum


class RoleUser(str, Enum):
    ADMIN = "admin"
    MANAGER = "manager"
    USER = "user"


class UserItem(BaseModel):
    fullName: str = Field(..., min_length=1, description="User full name")
    email: EmailStr = Field(..., min_length=1, description="User email")
    role: RoleUser = Field(..., default=RoleUser.USER, description="User role")
    phone: Optional[str] = Field(..., min_length=1, description="User phone")
    address: Optional[str] = Field(..., min_length=1, description="User address")

    @validator("fullName")
    def validate_full_name(cls, v):
        if not v:
            raise ValueError("Full name is mandatory")
        return v

    @validator("email")
    def validate_email(cls, v):
        if not v:
            raise ValueError("Email is mandatory")
        return v
