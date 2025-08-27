from fastapi import HTTPException
from datetime import datetime


class InventoryService:
    def __init__(self, supabase):
        self.supabase = supabase

    def get_inventory(self):
        resp = self.supabase.table("inventory").select("*").execute()
        return getattr(resp, "data", []) or []

    def get_inventory_by_user(self, user_id: int):
        resp = (
            self.supabase.table("inventory")
            .select("*")
            .eq("creator_id", user_id)
            .execute()
        )
        return getattr(resp, "data", []) or []

    def update_stock(self, product_id: str, quantity: int, user_timezone: str = "UTC"):
        if quantity < 0:
            raise HTTPException(status_code=400, detail="Quantity cannot be negative")

        resp = (
            self.supabase.table("inventory")
            .update({"quantity": quantity})
            .eq("product_id", product_id)
            .execute()
        )
        data = getattr(resp, "data", None) or []
        if not data:
            raise HTTPException(
                status_code=404, detail="Product not found or update failed"
            )
        return data

    def check_low_stock(self, min_threshold: int = 0):
        resp = (
            self.supabase.table("inventory")
            .select("*")
            .lte("quantity", min_threshold)
            .execute()
        )
        return getattr(resp, "data", []) or []

    def get_inventory_summary(self):
        resp = self.supabase.table("inventory").select("*").execute()
        products = getattr(resp, "data", []) or []
        total_products = len(products)
        total_stock = sum(p.get("quantity", 0) for p in products)
        low_stock_count = len([p for p in products if p.get("quantity", 0) <= 0])
        return {
            "totalProducts": total_products,
            "totalStock": total_stock,
            "lowStockProducts": low_stock_count,
            "lastUpdated": datetime.now().isoformat() + "Z",
        }
