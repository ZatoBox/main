from fastapi import HTTPException
from supabase import Client
from typing import List, Dict, Any


class LayoutRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "layouts"

    def create_layout(
        self,
        slug: str,
        owner_id: str,
        inventory_id: str,
        hero_title: str | None,
        web_description: str | None,
        social_links: Dict[str, Any] | None,
    ):
        payload = {
            "slug": slug,
            "owner_id": owner_id,
            "inventory_id": inventory_id,
            "hero_title": hero_title,
            "web_description": web_description,
            "social_links": social_links,
        }
        resp = self.supabase.table(self.table).insert(payload).execute()
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=400, detail="Error creating layout")
        return data[0]

    def update_layout(
        self, layout_slug: str, updates: dict, user_timezone: str = "UTC"
    ):
        updates.pop("slug", None)
        updates.pop("created_at", None)
        updates.pop("last_updated", None)
        resp = (
            self.supabase.table(self.table)
            .update(updates)
            .eq("slug", layout_slug)
            .execute()
        )
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=404, detail="Layout not found")
        return data[0]

    def find_all(self):
        resp = self.supabase.table(self.table).select("*").execute()
        data = getattr(resp, "data", None) or []
        return data

    def find_by_slug(self, layout_slug: str):
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("slug", layout_slug)
            .single()
            .execute()
        )
        data = getattr(resp, "data", None)
        if not data:
            return None
        return data

    def find_by_owner(self, owner_id: str):
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("owner_id", owner_id)
            .execute()
        )
        data = getattr(resp, "data", None) or []
        return data

    def find_by_inventory(self, inventory_id: str):
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("inventory_id", inventory_id)
            .execute()
        )
        data = getattr(resp, "data", None) or []
        return data

    def delete_layout(self, layout_slug: str):
        resp = (
            self.supabase.table(self.table).delete().eq("slug", layout_slug).execute()
        )
        data = getattr(resp, "data", None)
        if not data:
            raise HTTPException(status_code=404, detail="Layout not found")
        return data[0]
