from fastapi import HTTPException
from supabase import Client
from utils.timezone_utils import get_current_time_with_timezone


class ProductRepository:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table = "products"

    def create_product(
        self,
        name: str,
        description: str | None,
        price: float,
        stock: int,
        unit: str,
        product_type: str,
        category_id: str,
        sku: str | None,
        min_stock: int,
        status: str,
        weigth: float | None,
        localization: str | None,
        creator_id: str,
    ):
        payload = {
            "name": name,
            "description": description,
            "price": price,
            "stock": stock,
            "min_stock": min_stock,
            "category_id": category_id,
            "images": [],
            "status": status,
            "weigth": weigth,
            "sku": sku,
            "creator_id": creator_id,
            "unit": unit,
            "product_type": product_type,
            "localization": localization,
        }
        resp = self.supabase.table(self.table).insert(payload).execute()
        if resp.error:
            raise HTTPException(
                status_code=400, detail=f"Error creating product: {resp.error.message}"
            )
        return resp.data[0]

    def update_product(
        self, product_id: int, updates: dict, user_timezone: str = "UTC"
    ):
        updates.pop("id", None)
        updates.pop("created_at", None)
        updates["last_updated"] = get_current_time_with_timezone(user_timezone)
        resp = (
            self.supabase.table(self.table)
            .update(updates)
            .eq("id", product_id)
            .execute()
        )
        if resp.error:
            raise HTTPException(
                status_code=400, detail=f"Error updating product: {resp.error.message}"
            )
        if not resp.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return resp.data[0]

    def find_all(self):
        resp = self.supabase.table(self.table).select("*").execute()
        if resp.error:
            raise HTTPException(
                status_code=400, detail=f"Error fetching products: {resp.error.message}"
            )
        return resp.data or []

    def find_by_id(self, product_id: int):
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("id", product_id)
            .single()
            .execute()
        )
        if resp.error:
            if getattr(resp.error, "message", "").lower().startswith("row not found"):
                return None
            raise HTTPException(
                status_code=400, detail=f"Error fetching product: {resp.error.message}"
            )
        return resp.data

    def find_by_category(self, category_id: str):
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("category_id", category_id)
            .execute()
        )
        if resp.error:
            raise HTTPException(
                status_code=400,
                detail=f"Error fetching by category: {resp.error.message}",
            )
        return resp.data or []

    def find_by_name(self, name: str):
        resp = self.supabase.table(self.table).select("*").ilike("name", name).execute()
        if resp.error:
            raise HTTPException(
                status_code=400, detail=f"Error searching by name: {resp.error.message}"
            )
        return resp.data or []

    def delete_product(self, product_id: int):
        resp = self.supabase.table(self.table).delete().eq("id", product_id).execute()
        if resp.error:
            raise HTTPException(
                status_code=400, detail=f"Error deleting product: {resp.error.message}"
            )
        if not resp.data:
            raise HTTPException(status_code=404, detail="Product not found")
        return resp.data[0]

    def find_by_creator(self, creator_id: str):
        resp = (
            self.supabase.table(self.table)
            .select("*")
            .eq("creator_id", creator_id)
            .execute()
        )
        if resp.error:
            raise HTTPException(
                status_code=400,
                detail=f"Error fetching by creator: {resp.error.message}",
            )
        return resp.data or []
