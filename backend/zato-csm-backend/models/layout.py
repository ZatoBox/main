from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime


class CreateLayoutRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    slug: str = Field(..., description="Unique slug for the layout")
    inventory_id: str = Field(..., description="UUID of the inventory")
    hero_title: Optional[str] = Field(None, description="Hero title")
    web_description: Optional[str] = Field(None, description="Web description")
    social_links: Optional[Dict[str, Any]] = Field(
        None, description="Social links in JSON"
    )


class UpdateLayoutRequest(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    hero_title: Optional[str] = Field(None, description="Hero title")
    web_description: Optional[str] = Field(None, description="Web description")
    social_links: Optional[Dict[str, Any]] = Field(
        None, description="Social links in JSON"
    )


class LayoutResponse(BaseModel):
    slug: str
    owner_id: str
    inventory_id: str
    hero_title: Optional[str]
    web_description: Optional[str]
    social_links: Optional[Dict[str, Any]]
    created_at: Optional[datetime]
    last_updated: Optional[datetime]
