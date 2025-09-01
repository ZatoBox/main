from fastapi import HTTPException
from typing import List, Dict, Any

from models.layout import CreateLayoutRequest
from repositories.layout_repositories import LayoutRepository


class LayoutService:
    def __init__(self, repo: LayoutRepository):
        self.repo = repo

    def create_layout(
        self,
        layout_data: CreateLayoutRequest,
        owner_id: str,
    ):
        return self.repo.create_layout(
            slug=layout_data.slug,
            owner_id=owner_id,
            inventory_id=layout_data.inventory_id,
            hero_title=layout_data.hero_title,
            web_description=layout_data.web_description,
            social_links=layout_data.social_links,
        )

    def list_layouts(self):
        return self.repo.find_all()

    def get_layout(self, layout_slug: str):
        if not layout_slug or not isinstance(layout_slug, str):
            raise HTTPException(status_code=400, detail="Invalid layout slug")

        layout = self.repo.find_by_slug(layout_slug)
        if not layout:
            raise HTTPException(status_code=404, detail="Layout not found")
        return layout

    def update_layout(
        self,
        layout_slug: str,
        updates: dict,
        user_timezone: str = "UTC",
    ):
        allowed_fields = [
            "hero_title",
            "web_description",
            "social_links",
        ]

        for field in list(updates.keys()):
            if field not in allowed_fields:
                raise HTTPException(status_code=400, detail=f"Invalid field: {field}")

        for fld in ("hero_title", "web_description", "social_links"):
            val = updates.get(fld)
            if val == "" or val is None:
                updates.pop(fld, None)

        return self.repo.update_layout(layout_slug, updates, user_timezone)

    def delete_layout(self, layout_slug: str):
        return self.repo.delete_layout(layout_slug)

    def list_layouts_by_owner(self, owner_id: str):
        return self.repo.find_by_owner(owner_id)

    def list_layouts_by_inventory(self, inventory_id: str):
        return self.repo.find_by_inventory(inventory_id)
